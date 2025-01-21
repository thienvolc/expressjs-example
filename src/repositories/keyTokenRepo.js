import keyTokenModel from "../models/keyTokenModel.js";

export default class KeyTokenRepository {
    static async create(keyToken) {
        return await keyTokenModel.create(keyToken);
    }
}