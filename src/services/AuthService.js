import UserService from './UserService.js';
import RefreshTokenKeyService from './RefreshTokenKeyService.js';
import { selectFieldsFromObject } from '../utils/objectUtils.js';

export default class AuthService {
    static signup = async ({ name, email, password }) => {
        const user = await UserService.createUserWithHashPassword({ name, email, password });
        const tokenPair = await RefreshTokenKeyService.createTokenPairForUser(user);
        return this.#buildAuthResponse(user, tokenPair);
    };

    static login = async ({ email, password }) => {
        const user = await UserService.authenticateCredentials(email, password);
        const tokenPair = await RefreshTokenKeyService.refreshTokenPairForUser(user);
        return this.#buildAuthResponse(user, tokenPair);
    };

    static loginWithRefreshTokenTracking = async ({ email, password }, refreshToken) => {
        const authResponse = await this.login({ email, password });
        await this.#trackRefreshTokenUsage(authResponse.user._id, refreshToken);
        return authResponse;
    };

    static handleRefreshToken = async (userId, refreshToken) => {
        const user = await this.#fetchUserAndVerifyRefreshToken(userId, refreshToken);
        const tokenPair = await RefreshTokenKeyService.refreshTokenPairForUser(user);
        await this.#trackRefreshTokenUsage(user._id, refreshToken);
        return this.#buildAuthResponse(user, tokenPair);
    };

    static #fetchUserAndVerifyRefreshToken = async (userId, refreshToken) => {
        const [user] = await Promise.all([
            UserService.requireUserById(userId),
            RefreshTokenKeyService.verifyUserRefreshToken(refreshToken, userId),
        ]);
        return user;
    };

    static logoutAllUsersWithRefreshTokenTracking = async (userId, refreshToken) => {
        await this.logoutAllUsers(userId);
        await this.#trackRefreshTokenUsage(userId, refreshToken);
    };

    static logoutAllUsers = async (userId) => {
        await RefreshTokenKeyService.invalidateTokenKeyOfUser(userId);
        const user = await UserService.requireUserById(userId);
        await RefreshTokenKeyService.refreshTokenPairForUser(user);
    };

    static #extractUserInfo = (user) => selectFieldsFromObject(user, ['_id', 'name', 'email']);

    static #buildAuthResponse = (user, tokenPair) => ({
        user: this.#extractUserInfo(user),
        tokens: tokenPair,
    });

    static #trackRefreshTokenUsage = async (userId, refreshToken) => {
        await RefreshTokenKeyService.recordUsedRefreshTokenForUser(userId, refreshToken);
    };
}
