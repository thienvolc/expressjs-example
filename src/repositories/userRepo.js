import userModel from '../models/userModel.js';

export default class UserRepository {
    static async create(user) {
        return await userModel.create(user);
    }

    static async findByEmail(email) {
        return await userModel.findOne({ email }).lean();
    }
}
