import { Router } from 'express';
import AccessRouter from './accessRoute.js';

const router = Router();

router.use('/api/v1/user', AccessRouter);

export default router;
