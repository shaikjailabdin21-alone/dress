import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Collection from '../models/Collection.js';
import { deleteCloudinaryImage } from '../services/cloudinaryService.js';
import { normalizeProduct } from '../services/productService.js';

const fields = 'name slug description price compareAtPrice images category collection sizes colors stock isActive isNewArrival isFeatured createdAt updatedAt';
export async function listProducts(req, res) {
  res.set('Cache-Control', 'no-store');
  const page = Math.max(1, parseInt(req.query.page, 10) || 1), limit = Math.min(48, Math.max(1, parseInt(req.query.limit, 10) || 12));
  const filter = { isActive: true };
  const unclassifiedCategory = await Category.findOne({ slug: 'unclassified' }).select('_id').lean();
  const publicConditions = [
    { name: { $exists: true, $type: 'string', $ne: '' } },
    { category: { $exists: true, $ne: null } },
    { 'images.0.url': { $exists: true, $ne: '' } },
  ];
  if (unclassifiedCategory) publicConditions.push({ category: { $ne: unclassifiedCategory._id } });
  filter.$and = publicConditions;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.collection) filter.collection = req.query.collection;
  if (req.query.featured === 'true') filter.isFeatured = true;
  if (req.query.newArrivals === 'true') filter.isNewArrival = true;
  if (req.query.q) filter.$text = { $search: String(req.query.q).slice(0, 80) };
  if (req.query.minPrice || req.query.maxPrice) filter.price = { ...(req.query.minPrice ? { $gte: Math.max(0, Number(req.query.minPrice)) } : {}), ...(req.query.maxPrice ? { $lte: Math.max(0, Number(req.query.maxPrice)) } : {}) };
  const sortMap = { newest: { createdAt: -1 }, oldest: { createdAt: 1 }, priceLow: { price: 1 }, priceHigh: { price: -1 } };
  const [items, total] = await Promise.all([
    Product.find(filter).select(fields).populate('category', 'name slug').populate('collection', 'name slug').sort(sortMap[req.query.sort] || { isFeatured: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);
  res.json({ products: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}
export async function getProduct(req, res) {
  res.set('Cache-Control', 'no-store');
  const id = req.params.id;
  const product = await Product.findOne({ ...(mongoose.isValidObjectId(id) ? { _id: id } : { slug: id }), isActive: true }).select(fields).populate('category', 'name slug').populate('collection', 'name slug').lean();
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  const related = await Product.find({ _id: { $ne: product._id }, category: product.category._id, isActive: true }).select(fields).limit(4).sort({ isFeatured: -1, createdAt: -1 }).lean();
  res.json({ product, related });
}
export async function adminListProducts(req, res) {
  const products = await Product.find().select(fields).populate('category', 'name slug').populate('collection', 'name slug').sort({ createdAt: -1 }).lean();
  res.json({ products });
}
export async function createProduct(req, res) {
  const data = await normalizeProduct(req.body);
  const product = await Product.create(data);
  if (product.collection) await Collection.updateOne({ _id: product.collection }, { $addToSet: { products: product._id } });
  const populated = await product.populate('category collection');
  res.status(201).json({ product: populated });
}
export async function updateProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  const previousPublicIds = product.images.map(i => i.publicId);
  const previousCollection = String(product.collection || '');
  const data = await normalizeProduct(req.body, product.toObject());
  Object.assign(product, data);
  await product.save();
  const nextCollection = String(product.collection || '');
  if (previousCollection !== nextCollection) {
    if (previousCollection) await Collection.updateOne({ _id: previousCollection }, { $pull: { products: product._id } });
    if (nextCollection) await Collection.updateOne({ _id: nextCollection }, { $addToSet: { products: product._id } });
  }
  const kept = new Set(product.images.map(i => i.publicId));
  const cleanup = await Promise.allSettled(previousPublicIds.filter(id => !kept.has(id)).map(deleteCloudinaryImage));
  const cleanupFailures = cleanup.flatMap((result, index) => result.status === 'rejected' ? [previousPublicIds.filter(id => !kept.has(id))[index]] : []);
  await product.populate('category collection');
  res.json({ product, ...(cleanupFailures.length ? { imageCleanupFailures: cleanupFailures } : {}) });
}
export async function deleteProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  if (product.collection) await Collection.updateOne({ _id: product.collection }, { $pull: { products: product._id } });
  await product.deleteOne();
  const deleted = await Promise.allSettled(product.images.map(i => deleteCloudinaryImage(i.publicId)));
  const imageCleanupFailures = deleted.flatMap((result, index) => result.status === 'rejected' ? [product.images[index].publicId] : []);
  res.json({ message: imageCleanupFailures.length ? 'Product deleted, but some Cloudinary images could not be removed.' : 'Product and its Cloudinary images were deleted.', imageCleanupFailures });
}
export async function toggleProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  product.isActive = Boolean(req.body.isActive);
  await product.save();
  res.json({ product });
}
