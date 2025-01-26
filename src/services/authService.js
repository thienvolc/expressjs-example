import UserService from './UserService.js';
import RefreshTokenKeyService from './RefreshTokenKeyService.js';
import { selectFieldsFromObject } from '../utils/objectUtils.js';

export default class AuthService {
    static signup = async ({ name, email, password }) => {
        const user = await UserService.createUserWithHashPassword({ name, email, password });
        const tokenPair = await RefreshTokenKeyService.createTokenPairForUser(user);
        const userInfo = this.#extractUserInfo(user);
        return this.#buildAuthResponse(userInfo, tokenPair);
    };

    static #extractUserInfo = (user) => selectFieldsFromObject(user, ['_id', 'name', 'email']);

    static #buildAuthResponse = (user, tokenPair) => ({ user, tokens: tokenPair });

    static login = async ({ email, password }) => {
        const user = await UserService.authenticateCredentials(email, password);
        const tokenPair = await RefreshTokenKeyService.refreshTokenPairForUser(user);
        const userInfo = this.#extractUserInfo(user);
        return this.#buildAuthResponse(userInfo, tokenPair);
    };

    static loginWithRefreshTokenTracking = async ({ email, password }, refreshToken) => {
        const authResponse = await this.login({ email, password });
        await RefreshTokenKeyService.recordUsedRefreshTokenForUser(authResponse.user._id, refreshToken);
        return authResponse;
    };

    static handleRefreshToken = async (userId, refreshToken) => {
        await RefreshTokenKeyService.verifyUserRefreshToken(refreshToken, userId);
        const user = await UserService.requireUserById(userId);
        const tokenPair = await RefreshTokenKeyService.refreshTokenPairForUser(user);
        await RefreshTokenKeyService.recordUsedRefreshTokenForUser(userId, refreshToken);
        const userInfo = this.#extractUserInfo(user);
        return this.#buildAuthResponse(userInfo, tokenPair);
    };

    static logoutAllUsersWithRefreshTokenTracking = async (userId, refreshToken) => {
        await this.logoutAllUsers(userId);
        await RefreshTokenKeyService.recordUsedRefreshTokenForUser(userId, refreshToken);
    };

    static logoutAllUsers = async (userId) => {
        RefreshTokenKeyService.invalidateTokenKeyOfUser(userId);
        const user = await UserService.requireUserById(userId);
        await RefreshTokenKeyService.refreshTokenPairForUser(user);
    };
}
