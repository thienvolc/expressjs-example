import UserService from './userService.js';
import KeyTokenService from './keyTokenService.js';
import { generateRandomKeyPair, generateTokenPair } from '../auth/index.js';
import { selectFieldsFromObject } from '../utils/index.js';

export default class AccessService {
    static signUp = async ({ name, email, password }) => {
        await UserService.assureEmailNotExist(email);
        const userInfo = await this.createAndGetUserInfo({ name, email, password });
        const payload = this.createTokenPayloadForUser(userInfo);
        const tokens = await this.generateAndStoreTokens(userInfo._id, payload);
        return { user: userInfo, tokens };
    };

    static createAndGetUserInfo = async ({ name, email, password }) => {
        const user = await UserService.createUser({ name, email, password });
        return this.getUserInfo(user);
    };

    static getUserInfo = (user) => selectFieldsFromObject(user, ['_id', 'name', 'email']);

    static createTokenPayloadForUser = (user) => selectFieldsFromObject(user, ['_id', 'email']);

    static generateAndStoreTokens = async (userId, payload) => {
        const keyPair = this.generateKeyPair();
        const tokens = this.generateTokenPair(payload, keyPair);
        await this.storeKeyToken(userId, keyPair, tokens.refreshToken);
        return tokens;
    };

    static generateKeyPair = () => generateRandomKeyPair();

    static generateTokenPair = (payload, keyPair) => generateTokenPair(payload, keyPair);

    static storeKeyToken = async (userId, keyPair, refreshToken) => {
        await KeyTokenService.createKeyToken({
            userId,
            publicKey: keyPair.publicKey,
            privateKey: keyPair.privateKey,
            refreshToken,
        });
    };

    static logIn = async () => {};

    static logOut = async () => {};
}
