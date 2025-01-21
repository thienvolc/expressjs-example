import AccessController from '../controllers/accessController.js';
import { Router } from 'express';

const router = Router();

router.post('/signup', AccessController.signUp);

export default router;
