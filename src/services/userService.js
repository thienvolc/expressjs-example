import UserRepository from '../repositories/userRepo.js';
import { hashPassword } from '../auth/index.js';
import { InternalServerError, BadRequestError } from '../utils/responses/response-error.js';

export default class UserService {
    static createUser = async ({ name, email, password }) => {
        try {
            const hashedPassword = await hashPassword(password);
            const user = { name, email, password: hashedPassword };
            return await UserRepository.create(user);
        } catch (error) {
            throw new InternalServerError('User not created');
        }
    };

    static assureEmailNotExist = async (email) => {
        const isExist = await this.isExistEmail(email);
        if (isExist) {
            throw new BadRequestError('Email already exists');
        }
    };

    static isExistEmail = async (email) => {
        const user = await this.getUserByEmail(email);
        return !!user;
    };

    static getUserByEmail = async (email) => await UserRepository.findByEmail(email);
}
