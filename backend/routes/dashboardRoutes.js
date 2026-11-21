import { Router } from 'express';
import { dashboardStats, recentProducts } from '../controllers/dashboardController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
const router = Router();
router.get('/stats', requireAdmin, asyncHandler(dashboardStats));
router.get('/recent-products', requireAdmin, asyncHandler(recentProducts));
export default router;
