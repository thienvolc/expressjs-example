import authTokenKeyModel from '../models/authTokenKeyModel.js';
import { toMongooseObjectId } from '../utils/index.js';

export default class AuthTokenKeyRepository {
    static create = async (tokenKey) => await authTokenKeyModel.create(tokenKey);

    static findByUserId = async (userId) => {
        const filter = { userId: toMongooseObjectId(userId) };
        return await authTokenKeyModel.findOne(filter).lean();
    };

    static findByUserIdAndUpdate = async (userId, update, options) => {
        const filter = { userId: toMongooseObjectId(userId) };
        return await authTokenKeyModel.findOneAndUpdate(filter, update, options).lean();
    };

    static deleteByUserId = async (userId) => {
        const filter = { userId: toMongooseObjectId(userId) };
        return await authTokenKeyModel.deleteOne(filter).lean();
    };
}
