import AuthController from '../controllers/authController.js';
import { Router } from 'express';

const router = Router();

router.post('/signup', AuthController.signUp);

export default router;
