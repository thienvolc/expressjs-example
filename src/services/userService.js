import UserRepository from '../repositories/userRepo.js';
import { hashPassword } from '../auth/index.js';
import { InternalServerError, BadRequestError } from '../utils/responses/response-error.js';

export default class UserService {
    static async createUserIfNotExist({ name, email, password }) {
        await this.assureEmailNotExist(email);
        const user = await this.createUser({ name, email, password });
        return user;
    }

    static async createUser({ name, email, password }) {
        try {
            const hashedPassword = await hashPassword(password);
            const user = { name, email, password: hashedPassword };
            return await UserRepository.create(user);
        } catch (error) {
            throw new InternalServerError('User not created');
        }
    }

    static async assureEmailNotExist(email) {
        const isExist = await this.isExistEmail(email);
        if (isExist) {
            throw new BadRequestError('Email already exists');
        }
    }

    static async isExistEmail(email) {
        const user = await this.getUserByEmail(email);
        return !!user;
    }

    static async getUserByEmail(email) {
        return await UserRepository.findByEmail(email);
    }
}
