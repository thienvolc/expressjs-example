import { RefreshTokenKey } from '../models/index.js';
import { castMongooseObjectId } from '../utils/index.js';

export default class RefreshTokenKeyRepository {
    static create = async (tokenKey) => await RefreshTokenKey.create(tokenKey);

    static findByUserId = async (userId) => {
        const filter = { userId: castMongooseObjectId(userId) };
        return await RefreshTokenKey.findOne(filter).lean();
    };

    static findByUserIdAndUpdate = async (userId, update, options = {}) => {
        const filter = { userId: castMongooseObjectId(userId) };
        return await RefreshTokenKey.findOneAndUpdate(filter, update, options).lean();
    };

    static deleteByUserId = async (userId) => {
        const filter = { userId: castMongooseObjectId(userId) };
        return await RefreshTokenKey.deleteOne(filter).lean();
    };
}
