import AuthService from '../services/authService.js';
import { ResponseSender, CREATED, OK } from '../utils/responses/index.js';
import { asyncErrorDecorator } from '../helpers/asyncErrorWrapper.js';
import { getRefreshTokenFromHeaders } from '../utils/auth.js';

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
            ? await AuthService.logInWithRefreshTokenTracking(req.body, refreshToken)
            : await AuthService.logIn(req.body);
        const response = new OK({ message: 'User logged in successfully', metadata });
        ResponseSender.send(res, response);
    };

    static handleRefreshToken = async (req, res, next) => {
        const refreshToken = getRefreshTokenFromHeaders(req.headers);
        const response = new OK({
            message: 'Token refreshed successfully',
            metadata: await AuthService.handleRefreshToken(req.body.userId, refreshToken),
        });
        ResponseSender.send(res, response);
    };

    static logOut = async (req, res, next) => {
        const refreshToken = getRefreshTokenFromHeaders(req.headers);
        refreshToken
            ? await AuthService.logOutAllUsersWithRefreshTokenTracking(req.body.userId, refreshToken)
            : await AuthService.logOutAllUsers(req.body.userId);
        const response = new OK({ message: 'All users logged out successfully' });
        ResponseSender.send(res, response);
    };
}

const authController = asyncErrorDecorator.decorateAllStaticMethods(AuthController);

export default authController;
