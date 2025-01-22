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
            ? await AuthService.loginWithRefreshToken(req.body, refreshToken)
            : await AuthService.loginWithoutRefreshToken(req.body);
        const response = new OK({ message: 'User logged in successfully', metadata });
        ResponseSender.send(res, response);
    };
}

const accessController = {
    signUp: asyncErrorWrapper(AuthController.signUp),
    logIn: asyncErrorWrapper(AuthController.logIn),
};

export default accessController;
