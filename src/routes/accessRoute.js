import AuthController from '../controllers/authController.js';
import { Router } from 'express';

const router = Router();

router.post('/signup', AuthController.signUp);
router.post('/login', AuthController.logIn);

export default router;
