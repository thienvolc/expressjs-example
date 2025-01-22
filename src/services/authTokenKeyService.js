import AuthTokenKeyRepository from '../repositories/authTokenKeyRepo.js';

export default class AuthTokenKeyService {
    static createTokenKey = async ({ userId, privateKey, publicKey, refreshToken }) => {
        const tokenKey = { userId, privateKey, publicKey, refreshToken };
        return await AuthTokenKeyRepository.create(tokenKey);
    };
}
