import jwt from 'jsonwebtoken';
import crypto from 'crypto';
const { TokenExpiredError } = jwt;
import { AuthFailureError } from '../responses/index.js';

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
