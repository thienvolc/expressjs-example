import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const generateRandomKeyPair = () => {
    const privateKey = Buffer.from(crypto.randomBytes(64)).toString('base64');
    const publicKey = Buffer.from(crypto.randomBytes(64)).toString('base64');
    return { privateKey, publicKey };
};

export const generateTokenPair = (payload, keyPair) => {
    const accessToken = jwt.sign(payload, keyPair.publicKey, { expiresIn: '2 days' });
    const refreshToken = jwt.sign(payload, keyPair.privateKey, { expiresIn: '7 days' });
    return { accessToken, refreshToken };
};
