import { Router } from 'express';
import { redirectController } from '../controllers/link.controller.js';
import { redirectLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/:shortCode', redirectLimiter, redirectController);

export default router;
