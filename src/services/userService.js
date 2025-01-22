import UserRepository from '../repositories/userRepo.js';
import { InternalServerError, BadRequestError } from '../utils/responses/response-error.js';

export default class UserService {
    static createUser = async ({ name, email, password }) => {
        try {
            const user = { name, email, password };
            return await UserRepository.create(user);
        } catch (error) {
            throw new InternalServerError('User not created');
        }
    };

    static getUserByEmailOrThrow = async (email) => {
        const user = await this.getUserByEmail(email);
        if (!user) {
            throw new BadRequestError('Email does not exist');
        }
        return user;
    }

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
