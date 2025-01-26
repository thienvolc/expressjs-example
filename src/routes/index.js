import { Router } from 'express';
import AccessRouter from './AccessRoute.js';

const router = Router();

router.use('/api/v1/user', AccessRouter);

export default router;
