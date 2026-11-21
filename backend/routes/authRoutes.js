import { Router } from 'express';
import { adminLogin, adminMe } from '../controllers/authController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { rateLimit } from 'express-rate-limit';

const router = Router();
const loginLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: true, legacyHeaders: false, message: { message: 'Too many sign-in attempts. Please try again later.' } });
router.post('/admin/login', loginLimit, asyncHandler(adminLogin));
router.get('/admin/me', requireAdmin, adminMe);
export default router;
