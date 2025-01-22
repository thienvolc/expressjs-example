import AuthController from '../controllers/authController.js';
import { Router } from 'express';

const router = Router();

router.post('/signup', AuthController.signUp);
router.post('/login', AuthController.logIn);
router.post('/refresh-token', AuthController.handleRefreshToken);

export default router;
