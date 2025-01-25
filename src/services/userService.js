import UserRepository from '../models/repositories/userRepo.js';
import { comparePassword, hashPassword } from '../auth/index.js';
import { InternalServerError, BadRequestError, AuthFailureError } from '../utils/responses/response-error.js';

export default class UserService {
    static createUserWithHashPassword = async ({ name, email, password }) => {
        await UserService.ensureEmailNotExist(email);
        const hashedPassword = await hashPassword(password);
        return await UserService.createUser({ name, email, password: hashedPassword });
    };

    static createUser = async ({ name, email, password }) => {
        try {
            return await UserRepository.create({ name, email, password });
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

    static authenticateCredentials = async (email, password) => {
        const user = await this.#requireUserByEmail(email);
        const isValidPassword = await this.#comparePassword(password, user.password);
        if (!isValidPassword) {
            throw new AuthFailureError('Invalid password');
        }
        return user;
    };

    static #requireUserByEmail = async (email) => {
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            throw new BadRequestError('No user found with the provided email');
        }
        return user;
    };

    static #comparePassword = async (password, hashedPassword) => {
        return await comparePassword(password, hashedPassword);
    };

    static requireUserById = async (userId) => {
        const user = await UserRepository.findById(userId);
        if (!user) {
            throw new AuthFailureError('User does not exist');
        }
        return user;
    };
}
