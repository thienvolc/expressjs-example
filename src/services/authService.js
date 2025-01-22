import UserService from './userService.js';
import AuthTokenKeyService from './authTokenKeyService.js';
import { AuthFailureError } from '../utils/responses/response-error.js';
import { generateRandomKeyPair, generateTokenPair, comparePassword, hashPassword } from '../auth/index.js';
import { selectFieldsFromObject } from '../utils/index.js';

export default class AuthService {
    static signUp = async ({ name, email, password }) => {
        await UserService.assureEmailNotExist(email);
        const userInfo = await this.createUserAndRetrieveInfo({ name, email, password });
        const tokens = await this.generateAndSaveTokens(userInfo);
        return { user: userInfo, tokens };
    };

    static createUserAndRetrieveInfo = async ({ name, email, password }) => {
        const hashedPassword = await hashPassword(password);
        const user = await UserService.createUser({ name, email, password: hashedPassword });
        return this.extractUserInfo(user);
    };

    static extractUserInfo = (user) => selectFieldsFromObject(user, ['_id', 'name', 'email']);

    static generateAndSaveTokens = async (user) => {
        const keyPair = generateRandomKeyPair();
        const tokens = this.generateTokensForNewUser(user, keyPair);
        await this.saveTokenKey(user._id, keyPair, tokens.refreshToken);
        return tokens;
    };

    static generateTokensForNewUser = (user, keyPair) => {
        const payload = this.createTokenPayload(user);
        return generateTokenPair(payload, keyPair);
    };

    static createTokenPayload = (user) => selectFieldsFromObject(user, ['_id', 'email']);

    static saveTokenKey = async (userId, keyPair, refreshToken) => {
        await AuthTokenKeyService.createAuthKey({
            userId,
            publicKey: keyPair.publicKey,
            privateKey: keyPair.privateKey,
            refreshToken,
        });
    };

    static loginWithRefreshToken = async ({ email, password }, refreshToken) => {
        const userInfo = await this.validateCredentials(email, password);
        const tokens = await this.refreshTokensWithTracking(userInfo, refreshToken);
        return { user: userInfo, tokens };
    };

    static validateCredentials = async (email, password) => {
        const user = await UserService.getUserByEmailOrThrow(email);
        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
            throw new AuthFailureError('Invalid password');
        }
        return this.extractUserInfo(user);
    };

    static refreshTokensWithTracking = async (user, usedRefreshToken) => {
        const tokens = await this.createTokensForExistingUser(user);
        const refreshTokenState = { active: tokens.refreshToken, used: usedRefreshToken };
        await AuthTokenKeyService.updateRefreshTokenAndTrackUsage(user._id, refreshTokenState);
        return tokens;
    };

    static createTokensForExistingUser = async (user) => {
        const payload = this.createTokenPayload(user);
        const keyPair = await AuthTokenKeyService.getAuthKeysByUserId(user._id);
        return generateTokenPair(payload, keyPair);
    };

    static loginWithoutRefreshToken = async ({ email, password }) => {
        const userInfo = await this.validateCredentials(email, password);
        const tokens = await this.refreshTokens(userInfo);
        return { user: userInfo, tokens };
    };

    static refreshTokens = async (user) => {
        const tokens = await this.createTokensForExistingUser(user);
        await AuthTokenKeyService.updateActiveRefreshToken(user._id, tokens.refreshToken);
        return tokens;
    };

    static logOut = async () => {};
}

/*
Login Flow
Validate credentials: Ensure the provided email and password match an existing user.

Fetch key pair: Retrieve the publicKey and privateKey for the user from the database.

Generate new tokens: Create a new accessToken and refreshToken.

Store refreshToken: Update the database with the new refreshToken while keeping the old refreshToken in the usedRefreshToken list.

Respond to the client: Return the new tokens and user details.

Refresh Token Flow
Validate refreshToken: Check if the provided refreshToken matches the one in the database and is not in the usedRefreshToken list.

Generate new tokens: Create a new accessToken and refreshToken.

Update token store: Add the old refreshToken to the usedRefreshToken list and store the new refreshToken.

Respond to the client: Return the new tokens.
*/
