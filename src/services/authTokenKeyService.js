import AuthTokenKeyRepository from '../repositories/authTokenKeyRepo.js';

export default class AuthTokenKeyService {
    static createAuthKey = async ({ userId, privateKey, publicKey, refreshToken }) => {
        const tokenKey = { userId, privateKey, publicKey, refreshToken };
        return await AuthTokenKeyRepository.create(tokenKey);
    };

    static getAuthKeysByUserId = async (userId) => {
        const tokenKey = await AuthTokenKeyRepository.findByUserId(userId);
        return { privateKey: tokenKey.privateKey, publicKey: tokenKey.publicKey };
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

    static updateByUserId = async (userId, update, options = {}) => {
        await AuthTokenKeyRepository.findByUserIdAndUpdate(userId, update, options);
    };
}
