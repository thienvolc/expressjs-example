import keyTokenModel from '../models/keyTokenModel.js';

export default class KeyTokenRepository {
    static create = async (keyToken) => await keyTokenModel.create(keyToken);
}
