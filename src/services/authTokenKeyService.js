import AuthTokenKeyRepository from '../repositories/authTokenKeyRepo.js';
import { ForbiddenError } from '../utils/responses/response-error.js';

export default class AuthTokenKeyService {
    static createAuthKey = async ({ userId, privateKey, publicKey, refreshToken }) => {
        const tokenKey = { userId, privateKey, publicKey, refreshToken };
        return await AuthTokenKeyRepository.create(tokenKey);
    };

    static getAuthKeysByUserId = async (userId) => {
        const tokenKey = await AuthTokenKeyRepository.findByUserId(userId);
        return { privateKey: tokenKey.privateKey, publicKey: tokenKey.publicKey };
    };

    static getAuthTokenKeyByUserIdOrFail = async (userId) => {
        const tokenKey = await AuthTokenKeyRepository.findByUserId(userId);
        if (!tokenKey) {
            throw new ForbiddenError('User did not registered');
        }
        return tokenKey;
    };

    static updateActiveRefreshToken = async (userId, refreshToken) => {
        const update = {
            $set: { refreshToken },
        };
        await this.updateByUserId(userId, update);
    };

    static updateRefreshTokenAndTrackUsage = async (userId, refreshTokenState) => {
        const update = {
            $set: { refreshToken: refreshTokenState.active },
            $addToSet: { usedRefreshTokens: refreshTokenState.used },
        };
        await this.updateByUserId(userId, update);
    };

    static recordUsedRefreshToken = async (userId, usedRefreshToken) => {
        const update = {
            $addToSet: { usedRefreshTokens: usedRefreshToken },
        };
        await this.updateByUserId(userId, update);
    };

    static updateByUserId = async (userId, update, options = {}) => {
        await AuthTokenKeyRepository.findByUserIdAndUpdate(userId, update, options);
    };

    static invalidateAllTokensForUser = async (userId) => {
        await AuthTokenKeyRepository.deleteByUserId(userId);
    }
}
