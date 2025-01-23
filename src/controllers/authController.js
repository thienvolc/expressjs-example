import AuthService from '../services/authService.js';
import { ResponseSender, CREATED, OK } from '../utils/responses/index.js';
import { asyncErrorWrapper } from '../helpers/async-error-wrapper.js';
import { getRefreshTokenFromHeaders } from '../auth/index.js';

class AuthController {
    static signUp = async (req, res, next) => {
        const response = new CREATED({
            message: 'User created successfully',
            metadata: await AuthService.signUp(req.body),
        });
        ResponseSender.send(res, response);
    };

    static logIn = async (req, res, next) => {
        const refreshToken = getRefreshTokenFromHeaders(req.headers);
        const metadata = refreshToken
            ? await AuthService.logInAndRecordRefreshToken(req.body, refreshToken)
            : await AuthService.logIn(req.body);
        const response = new OK({ message: 'User logged in successfully', metadata });
        ResponseSender.send(res, response);
    };

    static handleRefreshToken = async (req, res, next) => {
        const refreshToken = getRefreshTokenFromHeaders(req.headers);
        const response = new OK({
            message: 'Token refreshed successfully',
            metadata: await AuthService.handleRefreshToken(req.body, refreshToken),
        });
        ResponseSender.send(res, response);
    };

    static logOut = async (req, res, next) => {
        const refreshToken = getRefreshTokenFromHeaders(req.headers);
        if (refreshToken) {
            await AuthService.logOutAndRecordRefreshToken(req.body.userId, refreshToken);
        }
        const response = new OK({ message: 'User logged out successfully' });
        ResponseSender.send(res, response);
    };
}

const accessController = {
    signUp: asyncErrorWrapper(AuthController.signUp),
    logIn: asyncErrorWrapper(AuthController.logIn),
    handleRefreshToken: asyncErrorWrapper(AuthController.handleRefreshToken),
    logOut: asyncErrorWrapper(AuthController.logOut),
};

export default accessController;
