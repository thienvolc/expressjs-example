import { RefreshTokenKeyRepository } from '../repositories/index.js';
import { generateRandomKeyPair, signToken, verifyToken } from '../utils/auth.js';
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from '../config/index.js';
import { selectFieldsFromObject } from '../utils/index.js';
import { AuthFailureError, ForbiddenError } from '../utils/responses/index.js';

export default class RefreshTokenKeyService {
    static createTokenPairForUser = async (user) => {
        const payload = this.#createTokenPayload(user);
        const keyPair = this.#generateRandomKeyPair();
        const tokenPair = this.#generateTokenPairFromKeyPair(payload, keyPair);
        await RefreshTokenKeyRepository.create({ userId: user._id, ...keyPair, refreshToken: tokenPair.refreshToken });
        return tokenPair;
    };

    static #createTokenPayload = (user) => selectFieldsFromObject(user, ['_id', 'email']);

    static #generateRandomKeyPair = () => generateRandomKeyPair();

    static #generateTokenPairFromKeyPair = (payload, keyPair) => {
        const { privateKey, publicKey } = keyPair;
        const refreshToken = this.#signToken(payload, privateKey, { expiresIn: REFRESH_TOKEN_EXPIRY });
        const accessToken = this.#signToken(payload, publicKey, { expiresIn: ACCESS_TOKEN_EXPIRY });
        return { accessToken, refreshToken };
    };

    static #signToken = (payload, key, options) => {
        if (!payload._id) {
            throw new Error("Missing required field '_id' in payload.");
        }
        return signToken(payload, key, options);
    };

    static verifyUserRefreshToken = async (refreshToken, userId) => {
        const tokenKey = await this.#requireTokenKeyByUserId(userId);
        await this.#verifyTokenIntegrity(refreshToken, tokenKey);
    };

    static #requireTokenKeyByUserId = async (userId) => {
        const tokenKey = await RefreshTokenKeyRepository.findByUserId(userId);
        if (!tokenKey) {
            throw new AuthFailureError('User does not exist');
        }
        return tokenKey;
    };

    static #verifyTokenIntegrity = async (refreshToken, tokenKey) => {
        if (tokenKey.refreshToken === refreshToken) {
            return this.#verifyTokenAndExtractPayload(refreshToken, tokenKey.privateKey);
        }
        await this.#preventReusedRefreshToken(tokenKey, refreshToken);
        throw new AuthFailureError('Invalid refresh token');
    };

    static #verifyTokenAndExtractPayload = (token, key) => verifyToken(token, key);

    static #preventReusedRefreshToken = async (tokenKey, refreshToken) => {
        if (this.#refreshTokenWasUsed(refreshToken, tokenKey)) {
            await this.#revokeReusedRefreshToken(tokenKey.userId, refreshToken);
            throw new ForbiddenError('Refresh token has been reused. Please log in again!');
        }
    };

    static #refreshTokenWasUsed = (refreshToken, tokenKey) => tokenKey.usedRefreshTokens.includes(refreshToken);

    static #revokeReusedRefreshToken = async (userId, refreshToken) => {
        await this.invalidateTokenKeyOfUser(userId);
        await this.recordUsedRefreshTokenForUser(userId, refreshToken);
    };

    static recordUsedRefreshTokenForUser = async (userId, usedRefreshToken) => {
        const update = { $addToSet: { usedRefreshTokens: usedRefreshToken } };
        await RefreshTokenKeyRepository.findByUserIdAndUpdate(userId, update);
    };

    static invalidateTokenKeyOfUser = async (userId) => {
        const keyPair = this.#generateRandomKeyPair();
        const update = { $set: { ...keyPair, refreshToken: null } };
        await RefreshTokenKeyRepository.findByUserIdAndUpdate(userId, update);
    };

    static refreshTokenPairForUser = async (user) => {
        const payload = this.#createTokenPayload(user);
        const keyPair = await this.#getKeyPairByUserId(user._id);
        const tokenPair = this.#generateTokenPairFromKeyPair(payload, keyPair);
        await this.#updateActiveRefreshTokenByUserId(user._id, tokenPair.refreshToken);
        return tokenPair;
    };

    static #getKeyPairByUserId = async (userId) => {
        const tokenKey = await RefreshTokenKeyRepository.findByUserId(userId);
        return this.#extractKeyPair(tokenKey);
    };

    static #extractKeyPair = (tokenKey) => {
        const { privateKey, publicKey } = tokenKey;
        return { privateKey, publicKey };
    };

    static #updateActiveRefreshTokenByUserId = async (userId, refreshToken) => {
        const update = { $set: { refreshToken } };
        await RefreshTokenKeyRepository.findByUserIdAndUpdate(userId, update);
    };
}
