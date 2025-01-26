import AuthController from '../controllers/AuthController.js';
import { Router } from 'express';

const router = Router();

// Start with api/v1/user/
router.post('/signup', AuthController.signUp);
router.post('/login', AuthController.logIn);
router.post('/refresh-token', AuthController.handleRefreshToken);
router.post('/logout', AuthController.logOut);

export default router;
