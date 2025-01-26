import AuthController from '../controllers/AuthController.js';
import { validateUserSignup, validateUserLogin } from '../validators/index.js';
import { Router } from 'express';

const router = Router();

// Start with api/v1/user/
router.post('/signup', validateUserSignup, AuthController.signup);
router.post('/login', validateUserLogin, AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/refresh-token', AuthController.handleRefreshToken);

export default router;
