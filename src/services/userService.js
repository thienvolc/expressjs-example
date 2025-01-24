import UserRepository from '../repositories/userRepo.js';
import { InternalServerError, BadRequestError, AuthFailureError } from '../utils/responses/response-error.js';

export default class UserService {
    static createUser = async ({ name, email, password }) => {
        try {
            const user = { name, email, password };
            return await UserRepository.create(user);
        } catch (error) {
            throw new InternalServerError('Failed to create user');
        }
    };

    static ensureEmailNotExist = async (email) => {
        const isExist = await this.#isEmailExisting(email);
        if (isExist) {
            throw new BadRequestError('Email already exists');
        }
    };

    static #isEmailExisting = async (email) => {
        const user = await UserRepository.findByEmail(email);
        return !!user;
    };

    static requireUserByEmail = async (email) => {
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            throw new BadRequestError('No user found with the provided email');
        }
        return user;
    };

    static requireUserById = async (userId) => {
        const user = await UserRepository.findById(userId);
        if (!user) {
            throw new AuthFailureError('User does not exist');
        }
        return user;
    };
}
