import authTokenKeyModel from '../models/authTokenKeyModel.js';
import { castMongooseObjectId } from '../utils/index.js';

export default class AuthTokenKeyRepository {
    static create = async (tokenKey) => await authTokenKeyModel.create(tokenKey);

    static findByUserId = async (userId) => {
        const filter = { userId: castMongooseObjectId(userId) };
        return await authTokenKeyModel.findOne(filter).lean();
        console.log("🚀 ~ AuthTokenKeyRepository ~ findByUserId= ~ userId:", userId)
    };

    static findByUserIdAndUpdate = async (userId, update, options) => {
        const filter = { userId: castMongooseObjectId(userId) };
        return await authTokenKeyModel.findOneAndUpdate(filter, update, options).lean();
    };

    static deleteByUserId = async (userId) => {
        const filter = { userId: castMongooseObjectId(userId) };
        return await authTokenKeyModel.deleteOne(filter).lean();
    };
}
