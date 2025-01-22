import AuthService from '../services/authService.js';
import { ResponseSender, CREATED } from '../utils/responses/index.js';
import { asyncErrorWrapper } from '../helpers/async-error-wrapper.js';

class AuthController {
    static signUp = async (req, res, next) => {
        const response = new CREATED({
            message: 'User created successfully',
            metadata: await AuthService.signUp(req.body),
        });
        ResponseSender.send(res, response);
    };

    static logIn = async (req, res, next) => {
        // Log in implementation
    };
}

const accessController = {
    signUp: asyncErrorWrapper(AuthController.signUp),
    logIn: asyncErrorWrapper(AuthController.logIn),
};

export default accessController;
