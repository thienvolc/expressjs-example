import UserService from './UserService.js';
import RefreshTokenKeyService from './RefreshTokenKeyService.js';
import { selectFieldsFromObject } from '../utils/objectUtils.js';

export default class AuthService {
    static signUp = async ({ name, email, password }) => {
        const user = await UserService.createUserWithHashPassword({ name, email, password });
        const tokenPair = await RefreshTokenKeyService.createTokenPairForUser(user);
        const userInfo = this.#extractUserInfo(user);
        return this.#buildAuthResponse(userInfo, tokenPair);
    };

    static #extractUserInfo = (user) => selectFieldsFromObject(user, ['_id', 'name', 'email']);

    static #buildAuthResponse = (user, tokenPair) => ({ user, tokens: tokenPair });

    static logIn = async ({ email, password }) => {
        const user = await UserService.authenticateCredentials(email, password);
        const tokenPair = await RefreshTokenKeyService.refreshTokenPairForUser(user);
        const userInfo = this.#extractUserInfo(user);
        return this.#buildAuthResponse(userInfo, tokenPair);
    };

    static logInWithRefreshTokenTracking = async ({ email, password }, refreshToken) => {
        const authResponse = await this.logIn({ email, password });
        await RefreshTokenKeyService.recordUsedRefreshTokenForUser(authResponse.user._id, refreshToken);
        return authResponse;
    };

    static handleRefreshToken = async (userId, refreshToken) => {
        await RefreshTokenKeyService.verifyUserRefreshToken(refreshToken, userId);
        const user = await UserService.requireUserById(userId);
        const tokenPair = RefreshTokenKeyService.refreshTokenPairForUser(user);
        await RefreshTokenKeyService.recordUsedRefreshTokenForUser(userId, refreshToken);
        const userInfo = this.#extractUserInfo(user);
        return this.#buildAuthResponse(userInfo, tokenPair);
    };

    static logOutAllUsersWithRefreshTokenTracking = async (userId, refreshToken) => {
        await this.logOutAllUsers(userId);
        await RefreshTokenKeyService.recordUsedRefreshTokenForUser(userId, refreshToken);
    };

    static logOutAllUsers = async (userId) => {
        RefreshTokenKeyService.invalidateTokenKeyOfUser(userId);
        const user = await UserService.requireUserById(userId);
        await RefreshTokenKeyService.refreshTokenPairForUser(user);
    };
}
