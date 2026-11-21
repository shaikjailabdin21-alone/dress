import { Router } from 'express';
import { confirmUpload, deleteUpload, uploadSignature } from '../controllers/uploadController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
const router = Router();
router.post('/signature', requireAdmin, uploadSignature);
router.post('/confirm', requireAdmin, asyncHandler(confirmUpload));
router.delete('/:publicId(*)', requireAdmin, asyncHandler(deleteUpload));
export default router;
