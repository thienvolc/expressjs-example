import UserService from './userService.js';
import AuthTokenKeyService from './authTokenKeyService.js';
import { generateRandomKeyPair, generateTokenPair } from '../auth/index.js';
import { selectFieldsFromObject } from '../utils/index.js';

export default class AuthService {
    static signUp = async ({ name, email, password }) => {
        await UserService.assureEmailNotExist(email);
        const userInfo = await this.createAndGetUserInfo({ name, email, password });
        const payload = this.createTokenPayloadForUser(userInfo);
        const tokens = await this.generateAndStoreTokens(userInfo._id, payload);
        return { user: userInfo, tokens };
    };

    static createAndGetUserInfo = async ({ name, email, password }) => {
        const user = await UserService.createUser({ name, email, password });
        return this.getUserInfo(user);
    };

    static getUserInfo = (user) => selectFieldsFromObject(user, ['_id', 'name', 'email']);

    static createTokenPayloadForUser = (user) => selectFieldsFromObject(user, ['_id', 'email']);

    static generateAndStoreTokens = async (userId, payload) => {
        const keyPair = this.generateKeyPair();
        const tokens = this.generateTokenPair(payload, keyPair);
        await this.storeKeyToken(userId, keyPair, tokens.refreshToken);
        return tokens;
    };

    static generateKeyPair = () => generateRandomKeyPair();

    static generateTokenPair = (payload, keyPair) => generateTokenPair(payload, keyPair);

    static storeKeyToken = async (userId, keyPair, refreshToken) => {
        await AuthTokenKeyService.createTokenKey({
            userId,
            publicKey: keyPair.publicKey,
            privateKey: keyPair.privateKey,
            refreshToken,
        });
    };

    static logIn = async () => {};

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
