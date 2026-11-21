import slugify from 'slugify';
import Category from '../models/Category.js';
import Collection from '../models/Collection.js';
import Product from '../models/Product.js';

const bool = (value, fallback) => value === undefined ? fallback : value === true || value === 'true';

export async function normalizeProduct(body, existing = {}) {
  const name = String(body.name ?? existing.name ?? '').trim();
  const price = Number(body.price ?? existing.price);
  const images = body.images ?? existing.images;
  if (!name || name.length > 160) throw Object.assign(new Error('Product name is required and must be under 160 characters.'), { statusCode: 400 });
  if (!Number.isFinite(price) || price < 0) throw Object.assign(new Error('A valid non-negative price is required.'), { statusCode: 400 });
  if (!Array.isArray(images) || images.length < 1 || images.length > 10 || images.some(i => !i?.url || !i?.publicId)) throw Object.assign(new Error('Add 1 to 10 valid Cloudinary images.'), { statusCode: 400 });
  const cloudinaryOrigin = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/`;
  if (!process.env.CLOUDINARY_CLOUD_NAME || images.some(image => !String(image.publicId).startsWith('al-nisa/products/') || !String(image.url).startsWith(cloudinaryOrigin))) throw Object.assign(new Error('Product photos must be confirmed images from this Cloudinary account.'), { statusCode: 400 });
  const category = await Category.findOne({ _id: body.category ?? existing.category, isActive: true });
  if (!category) throw Object.assign(new Error('Select an active category.'), { statusCode: 400 });
  const collectionId = body.collection === '' ? null : (body.collection ?? existing.collection);
  if (collectionId && !await Collection.exists({ _id: collectionId, isActive: true })) throw Object.assign(new Error('Select an active collection.'), { statusCode: 400 });
  const slugBase = slugify(String(body.slug || name), { lower: true, strict: true }) || 'product';
  let slug = slugBase, suffix = 2;
  while (await Product.exists({ slug, ...(existing._id ? { _id: { $ne: existing._id } } : {}) })) slug = `${slugBase}-${suffix++}`;
  const compareAtPrice = body.compareAtPrice === '' || body.compareAtPrice == null ? null : Number(body.compareAtPrice);
  const stock = Number(body.stock ?? existing.stock ?? 0);
  if (compareAtPrice !== null && (!Number.isFinite(compareAtPrice) || compareAtPrice < 0)) throw Object.assign(new Error('Compare at price must be a non-negative amount.'), { statusCode: 400 });
  if (!Number.isFinite(stock) || stock < 0) throw Object.assign(new Error('Stock must be a non-negative number.'), { statusCode: 400 });
  return {
    name, slug, description: String(body.description ?? existing.description ?? '').trim().slice(0, 5000),
    price, compareAtPrice,
    images, category: category._id, collection: collectionId || null,
    sizes: Array.isArray(body.sizes) ? body.sizes.map(String).map(x => x.trim()).filter(Boolean).slice(0, 30) : (existing.sizes || []),
    colors: Array.isArray(body.colors) ? body.colors.map(String).map(x => x.trim()).filter(Boolean).slice(0, 30) : (existing.colors || []),
    stock,
    isActive: bool(body.isActive, existing.isActive ?? true),
    isNewArrival: bool(body.isNewArrival, existing.isNewArrival ?? true),
    isFeatured: bool(body.isFeatured, existing.isFeatured ?? false),
  };
}
