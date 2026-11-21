import { cloudinaryConfigured, confirmCloudinaryUpload, createUploadAuthorization, deleteCloudinaryImage } from '../services/cloudinaryService.js';

export function uploadSignature(req, res) {
  if (!cloudinaryConfigured()) return res.status(503).json({ message: 'Cloudinary is not configured.' });
  res.json(createUploadAuthorization());
}
export async function confirmUpload(req, res) { res.json({ image: await confirmCloudinaryUpload(req.body) }); }
export async function deleteUpload(req, res) {
  const publicId = decodeURIComponent(req.params.publicId);
  if (!publicId.startsWith('al-nisa/products/')) return res.status(400).json({ message: 'Invalid image path.' });
  const result = await deleteCloudinaryImage(publicId);
  res.json({ result: result.result });
}
