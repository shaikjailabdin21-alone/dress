import { Router } from 'express';
import { adminListProducts, createProduct, deleteProduct, getProduct, listProducts, toggleProduct, updateProduct } from '../controllers/productController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();
router.get('/', asyncHandler(listProducts));
router.get('/admin/all', requireAdmin, asyncHandler(adminListProducts));
router.get('/:id', asyncHandler(getProduct));
router.post('/', requireAdmin, asyncHandler(createProduct));
router.put('/:id', requireAdmin, asyncHandler(updateProduct));
router.patch('/:id/status', requireAdmin, asyncHandler(toggleProduct));
router.delete('/:id', requireAdmin, asyncHandler(deleteProduct));
export default router;
