import User from '../User.js';

export default class UserRepository {
    static create = async (user) => await User.create(user);

    static findByEmail = async (email) => await User.findOne({ email }).lean();

    static findById = async (userId) => await User.findById(userId).lean();
}
