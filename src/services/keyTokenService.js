import { generateRandomKeyPair } from '../auth/index.js';
import KeyTokenRepository from '../repositories/keyTokenRepo.js';

export default class KeyTokenService {
    static async createKeyToken({ userId, privateKey, publicKey, refreshToken }) {
        const keyToken = { userId, privateKey, publicKey, refreshToken };
        return await KeyTokenRepository.create(keyToken);
    }
}
