import crypto from 'node:crypto';
import cloudinary from '../config/cloudinary.js';

export function cloudinaryConfigured() { return ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'].every(key => process.env[key]); }
export function createUploadAuthorization() {
  if (!cloudinaryConfigured()) throw Object.assign(new Error('Cloudinary is not configured.'), { statusCode: 503 });
  const timestamp = Math.floor(Date.now() / 1000); const publicId = `al-nisa/products/${crypto.randomUUID()}`;
  const params = { public_id: publicId, overwrite: false, timestamp, allowed_formats: 'jpg,jpeg,png,webp,avif' };
  return { cloudName: process.env.CLOUDINARY_CLOUD_NAME, apiKey: process.env.CLOUDINARY_API_KEY, timestamp, publicId, params: { overwrite: false, allowed_formats: params.allowed_formats }, signature: cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET) };
}
export async function confirmCloudinaryUpload({ publicId, version, signature }) {
  if (!publicId || !version || !signature || !publicId.startsWith('al-nisa/products/')) throw Object.assign(new Error('Invalid upload confirmation.'), { statusCode: 400 });
  const expected = crypto.createHash('sha1').update(`public_id=${publicId}&version=${version}${process.env.CLOUDINARY_API_SECRET}`).digest('hex');
  const expectedBuffer = Buffer.from(expected), actualBuffer = Buffer.from(String(signature));
  if (expectedBuffer.length !== actualBuffer.length || !crypto.timingSafeEqual(expectedBuffer, actualBuffer)) throw Object.assign(new Error('Upload signature could not be verified.'), { statusCode: 400 });
  let resource;
  try { resource = await cloudinary.api.resource(publicId); } catch { throw Object.assign(new Error('Uploaded image was not found in Cloudinary.'), { statusCode: 404 }); }
  if (resource.bytes > 10 * 1024 * 1024) {
    try { await cloudinary.uploader.destroy(publicId); } catch (error) { console.error('Could not remove oversized Cloudinary upload:', error.message); }
    throw Object.assign(new Error('Image is larger than 10 MB.'), { statusCode: 413 });
  }
  return { url: cloudinary.url(resource.public_id, { secure: true, transformation: [{ quality: 'auto:good', fetch_format: 'auto' }] }), publicId: resource.public_id, width: resource.width, height: resource.height, format: resource.format };
}
export async function deleteCloudinaryImage(publicId) { return cloudinary.uploader.destroy(publicId); }
