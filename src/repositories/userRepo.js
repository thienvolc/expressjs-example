import userModel from '../models/userModel.js';

export default class UserRepository {
    static create = async (user) => await userModel.create(user);

    static findByEmail = async (email) => await userModel.findOne({ email }).lean();
}
