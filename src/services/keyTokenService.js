import KeyTokenRepository from '../repositories/keyTokenRepo.js';

export default class KeyTokenService {
    static createKeyToken = async ({ userId, privateKey, publicKey, refreshToken }) => {
        const keyToken = { userId, privateKey, publicKey, refreshToken };
        return await KeyTokenRepository.create(keyToken);
    };
}
