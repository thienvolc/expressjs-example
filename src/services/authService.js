import UserService from './userService.js';
import AuthTokenKeyService from './authTokenKeyService.js';
import { AuthFailureError, ForbiddenError } from '../utils/responses/response-error.js';
import { generateRandomKeyPair, generateTokenPair, comparePassword, hashPassword, verifyToken } from '../auth/index.js';
import { selectFieldsFromObject } from '../utils/index.js';

export default class AuthService {
    static signUp = async ({ name, email, password }) => {
        await UserService.ensureEmailNotExist(email);
        const userInfo = await this.createUserAndGetInfo({ name, email, password });
        const tokenPair = await this.createAuthTokenKeyByUserInfo(userInfo);
        return { user: userInfo, tokens: tokenPair };
    };

    static createUserAndGetInfo = async ({ name, email, password }) => {
        const hashedPassword = await hashPassword(password);
        const user = await UserService.createUser({ name, email, password: hashedPassword });
        return this.extractUserInfo(user);
    };

    static extractUserInfo = (user) => selectFieldsFromObject(user, ['_id', 'name', 'email']);

    static createAuthTokenKeyByUserInfo = async (userInfo) => {
        const keyPair = generateRandomKeyPair();
        const tokenPair = this.generateTokenPairFromKeyPair(userInfo, keyPair);
        await this.storeAuthTokenKey(userInfo._id, keyPair, tokenPair.refreshToken);
        return tokenPair;
    };

    static generateTokenPairFromKeyPair = (userInfo, keyPair) => {
        const payload = this.createTokenPayloadForUser(userInfo);
        return generateTokenPair(payload, keyPair);
    };

    static createTokenPayloadForUser = (user) => selectFieldsFromObject(user, ['_id', 'email']);

    static storeAuthTokenKey = async (userId, keyPair, refreshToken) => {
        const { publicKey, privateKey } = keyPair;
        await AuthTokenKeyService.createAuthTokenKey({ userId, publicKey, privateKey, refreshToken });
    };

    static logIn = async ({ email, password }) => {
        const userInfo = await this.authenticateCredentials(email, password);
        const tokenPair = await this.refreshTokenPairByUserInfo(userInfo);
        return { user: userInfo, tokens: tokenPair };
    };

    static authenticateCredentials = async (email, password) => {
        const user = await UserService.getUserByEmailOrThrow(email);
        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
            throw new AuthFailureError('Invalid password');
        }
        return this.extractUserInfo(user);
    };

    static refreshTokenPairByUserInfo = async (userInfo) => {
        const tokens = await this.generateTokenPairFromExistingUser(userInfo);
        await AuthTokenKeyService.updateActiveRefreshTokenForUser(userInfo._id, tokens.refreshToken);
        return tokens;
    };

    static generateTokenPairFromExistingUser = async (user) => {
        const payload = this.createTokenPayloadForUser(user);
        const keyPair = await AuthTokenKeyService.getAuthKeyPairByUserId(user._id);
        return generateTokenPair(payload, keyPair);
    };

    static logInAndRecordRefreshToken = async ({ email, password }, refreshToken) => {
        const userInfo = await this.authenticateCredentials(email, password);
        const tokenPair = await this.refreshTokenPairWithTrackingByUserInfo(userInfo, refreshToken);
        return { user: userInfo, tokens: tokenPair };
    };

    static refreshTokenPairWithTrackingByUserInfo = async (userInfo, usedRefreshToken) => {
        const tokenPair = await this.generateTokenPairFromExistingUser(userInfo);
        await this.updateAndRecordRefreshTokens(userInfo._id, tokenPair.refreshToken, usedRefreshToken);
        return tokenPair;
    };

    static updateAndRecordRefreshTokens = async (userId, refreshToken, usedRefreshToken) => {
        await AuthTokenKeyService.updateActiveRefreshTokenForUser(userId, refreshToken);
        await AuthTokenKeyService.recordUsedRefreshTokenForUser(userId, usedRefreshToken);
    };

    static handleRefreshToken = async ({ userId }, refreshToken) => {
        await this.verifyUserRefreshToken(refreshToken, userId);
        const userInfo = await this.getUserInfoById(userId);
        const tokens = await this.refreshTokenPairWithTrackingByUserInfo(userInfo, refreshToken);
        return { user: userInfo, tokens };
    };

    static verifyUserRefreshToken = async (refreshToken, userId) => {
        const authTokenKey = await AuthTokenKeyService.getAuthTokenKeyByUserIdOrFail(userId);
        await this.verifyTokenIntegrity(refreshToken, authTokenKey);
    };

    static verifyTokenIntegrity = async (refreshToken, authTokenKey) => {
        if (authTokenKey.refreshToken === refreshToken) {
            return verifyToken(refreshToken, authTokenKey.privateKey);
        }
        await this.preventReusedRefreshToken(authTokenKey, refreshToken);
        throw new AuthFailureError('Invalid refresh token');
    };

    static preventReusedRefreshToken = async (authTokenKey, refreshToken) => {
        if (authTokenKey.usedRefreshTokens.includes(refreshToken)) {
            await this.revokeReusedRefreshToken(authTokenKey.userId, refreshToken);
            throw new ForbiddenError('Refresh token has been reused. Please log in again!');
        }
    };

    static revokeReusedRefreshToken = async (userId, refreshToken) => {
        const [userInfo] = await Promise.all([
            this.getUserInfoById(userId),
            AuthTokenKeyService.invalidateAuthTokenKeyForUser(userId),
        ]);
        await this.createAuthTokenKeyByUserInfo(userInfo);
        await AuthTokenKeyService.recordUsedRefreshTokenForUser(userId, refreshToken);
    };

    static getUserInfoById = async (userId) => {
        const user = await UserService.getUserById(userId);
        return this.extractUserInfo(user);
    };

    static logOutAndRecordRefreshToken = async (userId, refreshToken) => {
        await this.revokeReusedRefreshToken(userId, refreshToken);
    };
}
