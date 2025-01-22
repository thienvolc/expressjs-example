import AccessService from '../services/accessService.js';
import { ResponseSender, CREATED } from '../utils/responses/index.js';
import { asyncErrorWrapper } from '../helpers/async-error-wrapper.js';

class AccessController {
    static signUp = async (req, res, next) => {
        const response = new CREATED({
            message: 'User created successfully',
            metadata: await AccessService.signUp(req.body),
        });
        ResponseSender.send(res, response);
    };

    static logIn = async (req, res, next) => {
        // Log in implementation
    };
}

const accessController = {
    signUp: asyncErrorWrapper(AccessController.signUp),
    logIn: asyncErrorWrapper(AccessController.logIn),
};

export default accessController;
