import UserService from './userService.js';
import KeyTokenService from './keyTokenService.js';
import { generateRandomKeyPair, generateTokenPair } from '../auth/index.js';
import { selectFieldsFromObject } from '../utils/index.js';

export default class AccessService {
    static async signUp({ name, email, password }) {
        const user = await UserService.createUserIfNotExist({ name, email, password });
        const userInfo = this.getUserInfo(user);
        const payload = this.createTokenPayloadForUser(userInfo);
        const tokens = await this.generateAndStoreTokens(user._id, payload);
        return { user: userInfo, tokens };
    }

    static getUserInfo(user) {
        return selectFieldsFromObject(user, ['_id', 'name', 'email']);
    }

    static createTokenPayloadForUser(user) {
        return selectFieldsFromObject(user, ['_id', 'email']);
    }

    static async generateAndStoreTokens(userId, payload) {
        const keyPair = this.generateKeyPair();
        const tokens = this.generateTokenPair(payload, keyPair);
        await this.storeKeyToken(userId, keyPair, tokens.refreshToken);
        return tokens;
    }

    static generateKeyPair() {
        return generateRandomKeyPair();
    }

    static generateTokenPair(payload, keyPair) {
        return generateTokenPair(payload, keyPair);
    }

    static async storeKeyToken(userId, keyPair, refreshToken) {
        await KeyTokenService.createKeyToken({
            userId,
            publicKey: keyPair.publicKey,
            privateKey: keyPair.privateKey,
            refreshToken,
        });
    }

    static async logIn() {}

    static async logOut() {}
}
