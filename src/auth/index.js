import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
const { TokenExpiredError } = jwt;
import { AuthFailureError } from '../utils/responses/index.js';

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const generateRandomKeyPair = () => {
    const generateKey = () => Buffer.from(crypto.randomBytes(64)).toString('base64');
    return {
        privateKey: generateKey(),
        publicKey: generateKey(),
    };
};

export const signToken = (payload, key, options) => {
    return jwt.sign(payload, key, options);
};

export const verifyToken = (token, key) => {
    try {
        return jwt.verify(token, key);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw new TokenExpiredError('Token expired');
        }
        throw new AuthFailureError('Invalid token');
    }
};

export const Headers = {
    AUTHORIZATION: 'Authorization',
    REFRESH_TOKEN: 'x-refresh-token',
    ACCESS_TOKEN: 'x-access-token',
    API_KEY: 'x-api-key',
};

export const getRefreshTokenFromHeaders = (headers) => headers[Headers.REFRESH_TOKEN];
