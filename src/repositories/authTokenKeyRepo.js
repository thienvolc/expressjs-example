import authTokenKeyModel from '../models/authTokenKeyModel.js';

export default class KeyTokenRepository {
    static create = async (tokenKey) => await authTokenKeyModel.create(tokenKey);
}
