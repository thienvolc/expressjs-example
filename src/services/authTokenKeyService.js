import { set } from 'mongoose';
import AuthTokenKeyRepository from '../repositories/authTokenKeyRepo.js';
import { ForbiddenError } from '../utils/responses/response-error.js';

export default class AuthTokenKeyService {
    static createAuthTokenKey = async ({ userId, privateKey, publicKey, refreshToken }) => {
        const tokenKey = { userId, privateKey, publicKey, refreshToken };
        return await AuthTokenKeyRepository.create(tokenKey);
    };

    static getAuthKeyPairByUserId = async (userId) => {
        const tokenKey = await AuthTokenKeyRepository.findByUserId(userId);
        return this.#extractKeyPair(tokenKey);
    };

    static #extractKeyPair = (tokenKey) => {
        const { privateKey, publicKey } = tokenKey;
        return { privateKey, publicKey };
    };

    static getAuthTokenKeyByUserIdOrThrow = async (userId) => {
        const tokenKey = await AuthTokenKeyRepository.findByUserId(userId);
        if (!tokenKey) {
            throw new ForbiddenError('User did not registered');
        }
        return tokenKey;
    };

    static updateActiveRefreshTokenForUser = async (userId, refreshToken) => {
        const update = { $set: { refreshToken } };
        await this.#updateByUserId(userId, update);
    };

    static recordUsedRefreshTokenForUser = async (userId, usedRefreshToken) => {
        const update = { $addToSet: { usedRefreshTokens: usedRefreshToken } };
        await this.#updateByUserId(userId, update);
    };

    static #updateByUserId = async (userId, update, options = {}) => {
        await AuthTokenKeyRepository.findByUserIdAndUpdate(userId, update, options);
    };

    static invalidateAuthTokenKeyForUser = async (userId) => {
        await AuthTokenKeyRepository.deleteByUserId(userId);
    };
}
