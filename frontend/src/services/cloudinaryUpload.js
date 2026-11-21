import { confirmUpload, getUploadSignature } from './productService.js';

async function compress(file) {
  if (!file.type.startsWith('image/')) throw new Error(`${file.name} is not an image.`);
  const bitmap = await createImageBitmap(file); const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height)); const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale)); canvas.height = Math.max(1, Math.round(bitmap.height * scale)); canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height); bitmap.close();
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', 0.86));
  if (!blob) throw new Error(`${file.name} could not be converted to WebP by this browser.`);
  const optimized = new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.webp`, { type: 'image/webp' });
  if (optimized.size > 10 * 1024 * 1024) throw new Error(`${file.name} is larger than 10 MB after optimization.`);
  return optimized;
}
function sendToCloudinary(url, form, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest(); xhr.open('POST', url);
    xhr.upload.onprogress = event => { if (event.lengthComputable) onProgress(Math.round(event.loaded / event.total * 100)); };
    xhr.onerror = () => reject(new Error('Could not connect to Cloudinary.'));
    xhr.onload = () => { let data; try { data = JSON.parse(xhr.responseText); } catch { return reject(new Error('Cloudinary returned an invalid response.')); } xhr.status >= 200 && xhr.status < 300 ? resolve(data) : reject(new Error(data.error?.message || 'Cloudinary upload failed.')); };
    xhr.send(form);
  });
}
export async function uploadProductImages(files, existing, report) {
  if (files.length + existing.length > 10) throw new Error('A product can have up to 10 photos.');
  const uploaded = [];
  try {
    for (const [index, original] of files.entries()) {
      report(index, `Optimizing ${original.name}…`); const file = await compress(original);
      const signed = await getUploadSignature(); const form = new FormData();
      form.append('file', file); form.append('api_key', signed.apiKey); form.append('timestamp', signed.timestamp); form.append('public_id', signed.publicId); form.append('overwrite', String(signed.params.overwrite)); form.append('allowed_formats', signed.params.allowed_formats); form.append('signature', signed.signature);
      const data = await sendToCloudinary(`https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`, form, percent => report(index, `Uploading ${original.name} · ${percent}%`));
      const image = await confirmUpload({ publicId: data.public_id, version: data.version, signature: data.signature });
      uploaded.push(image); report(index, `Uploaded ${original.name}`);
    }
    return [...existing, ...uploaded];
  } catch (error) { error.uploadedImages = uploaded; throw error; }
}
