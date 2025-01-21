import AccessService from '../services/accessService.js';
import { ResponseSender, CREATED } from '../utils/responses/index.js';
import { asyncErrorWrapper } from '../helpers/async-error-wrapper.js';

class AccessController {
    static async signUp(req, res, next) {
        const response = new CREATED({
            message: 'User created successfully',
            metadata: await AccessService.signUp(req.body),
        });
        ResponseSender.send(res, response);
    }
}

const accessController = {
    signUp: asyncErrorWrapper(AccessController.signUp),
}

export default accessController;
