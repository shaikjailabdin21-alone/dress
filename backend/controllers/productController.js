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
  const conditions = [
    { $or: [{ isActive: true }, { isActive: { $exists: false } }] },
    { name: { $exists: true, $type: 'string', $ne: '' } },
  ];
  if (req.query.category) {
    const term = String(req.query.category).trim();
    const category = await Category.findOne(mongoose.isValidObjectId(term) ? { _id: term, isActive: true } : { slug: term.toLowerCase(), isActive: true }).select('_id').lean();
    conditions.push(category ? { category: category._id } : { _id: null });
  }
  if (req.query.collection) {
    const term = String(req.query.collection).trim();
    const collection = await Collection.findOne(mongoose.isValidObjectId(term) ? { _id: term, isActive: true } : { slug: term.toLowerCase(), isActive: true }).select('_id products').lean();
    conditions.push(collection ? { $or: [{ collection: collection._id }, { _id: { $in: collection.products || [] } }] } : { _id: null });
  }
  if (req.query.featured === 'true') conditions.push({ isFeatured: true });
  if (req.query.newArrivals === 'true') conditions.push({ $or: [{ isNewArrival: true }, { isNewArrival: { $exists: false } }] });
  const query = String(req.query.q || '').trim().slice(0, 80);
  if (query) {
    const safeTerm = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = new RegExp(safeTerm, 'i');
    const [categories, collections] = await Promise.all([
      Category.find({ name: match, isActive: true }).select('_id').lean(),
      Collection.find({ name: match, isActive: true }).select('_id products').lean(),
    ]);
    const categoryIds = categories.map(item => item._id);
    const collectionIds = collections.map(item => item._id);
    const relatedProductIds = collections.flatMap(item => item.products || []);
    conditions.push({ $or: [
      { name: match }, { description: match }, { sizes: match }, { colors: match },
      ...(categoryIds.length ? [{ category: { $in: categoryIds } }] : []),
      ...(collectionIds.length ? [{ collection: { $in: collectionIds } }] : []),
      ...(relatedProductIds.length ? [{ _id: { $in: relatedProductIds } }] : []),
    ] });
  }
  const filter = { $and: conditions };
  const minPrice = req.query.minPrice === undefined ? undefined : Number(req.query.minPrice);
  const maxPrice = req.query.maxPrice === undefined ? undefined : Number(req.query.maxPrice);
  if ((minPrice !== undefined && (!Number.isFinite(minPrice) || minPrice < 0)) || (maxPrice !== undefined && (!Number.isFinite(maxPrice) || maxPrice < 0)) || (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice)) {
    return res.status(400).json({ message: 'Enter a valid price range.' });
  }
  if (minPrice !== undefined || maxPrice !== undefined) filter.price = { ...(minPrice !== undefined ? { $gte: minPrice } : {}), ...(maxPrice !== undefined ? { $lte: maxPrice } : {}) };
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
  const isObjectId = mongoose.isValidObjectId(id);
  const product = await Product.findOne({
    ...(isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id }),
    $or: [{ isActive: true }, { isActive: { $exists: false } }],
  }).select(fields).populate('category', 'name slug').populate('collection', 'name slug').lean();
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  const relatedFilter = { _id: { $ne: product._id }, $or: [{ isActive: true }, { isActive: { $exists: false } }] };
  if (product.category?._id || product.category) relatedFilter.category = product.category?._id || product.category;
  const related = product.category ? await Product.find(relatedFilter).select(fields).populate('category', 'name slug').populate('collection', 'name slug').limit(4).sort({ isFeatured: -1, createdAt: -1 }).lean() : [];
  res.json({ product, related });
}
export async function adminListProducts(req, res) {
  const products = await Product.find().select(fields).populate('category', 'name slug').populate('collection', 'name slug').sort({ createdAt: -1 }).lean();
  const relatedCollections = products.length ? await Collection.find({ products: { $in: products.map(product => product._id) } }).select('name slug isActive products').lean() : [];
  const productCollections = new Map(products.map(product => [String(product._id), []]));
  for (const collection of relatedCollections) for (const productId of collection.products) productCollections.get(String(productId))?.push({ _id: collection._id, name: collection.name, slug: collection.slug, isActive: collection.isActive });
  for (const product of products) {
    if (product.collection && !productCollections.get(String(product._id)).some(item => String(item._id) === String(product.collection._id))) productCollections.get(String(product._id)).push(product.collection);
    product.collections = productCollections.get(String(product._id));
  }
  res.json({ products });
}
export async function createProduct(req, res) {
  const { collections, ...data } = await normalizeProduct(req.body);
  const product = await Product.create(data);
  if (collections.length) await Collection.updateMany({ _id: { $in: collections } }, { $addToSet: { products: product._id } });
  const populated = await product.populate('category collection');
  res.status(201).json({ product: populated });
}
export async function updateProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  const previousPublicIds = product.images.map(i => i.publicId);
  const previousCollectionIds = await Collection.find({ products: product._id }).select('_id').lean();
  if (product.collection && !previousCollectionIds.some(item => String(item._id) === String(product.collection))) previousCollectionIds.push({ _id: product.collection });
  const { collections, ...data } = await normalizeProduct(req.body, { ...product.toObject(), collections: previousCollectionIds.map(item => item._id) });
  Object.assign(product, data);
  await product.save();
  const nextCollectionIds = new Set(collections.map(String));
  await Promise.all(previousCollectionIds.filter(item => !nextCollectionIds.has(String(item._id))).map(item => Collection.updateOne({ _id: item._id }, { $pull: { products: product._id } })));
  if (collections.length) await Collection.updateMany({ _id: { $in: collections } }, { $addToSet: { products: product._id } });
  const kept = new Set(product.images.map(i => i.publicId));
  const cleanup = await Promise.allSettled(previousPublicIds.filter(id => !kept.has(id)).map(deleteCloudinaryImage));
  const cleanupFailures = cleanup.flatMap((result, index) => result.status === 'rejected' ? [previousPublicIds.filter(id => !kept.has(id))[index]] : []);
  await product.populate('category collection');
  res.json({ product, ...(cleanupFailures.length ? { imageCleanupFailures: cleanupFailures } : {}) });
}
export async function deleteProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  await Collection.updateMany({ products: product._id }, { $pull: { products: product._id } });
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
