import slugify from 'slugify';
import Collection from '../models/Collection.js';
import Product from '../models/Product.js';
import { isName } from '../utils/validators.js';

const makeSlug = name => slugify(name, { lower: true, strict: true });
async function uniqueSlug(name, id) {
  const base = makeSlug(name); let slug = base, suffix = 2;
  while (await Collection.exists({ slug, ...(id ? { _id: { $ne: id } } : {}) })) slug = `${base}-${suffix++}`;
  return slug;
}
export async function listCollections(req, res) {
  const collections = await Collection.find(req.admin ? {} : { isActive: true }).sort({ createdAt: -1 }).lean();
  const products = collections.length ? await Product.find({ collection: { $in: collections.map(item => item._id) }, isActive: true }).select('name slug price images collection isNewArrival isFeatured').lean() : [];
  const grouped = new Map(collections.map(item => [String(item._id), []]));
  for (const product of products) grouped.get(String(product.collection))?.push(product);
  res.json({ collections: collections.map(item => ({ ...item, products: grouped.get(String(item._id)) || [] })) });
}
export async function createCollection(req, res) {
  if (!isName(req.body.name)) return res.status(400).json({ message: 'A collection name is required (up to 100 characters).' });
  const collection = await Collection.create({ name: req.body.name.trim(), slug: await uniqueSlug(req.body.name), description: req.body.description || '', bannerImage: req.body.bannerImage, isActive: !(req.body.isActive === false || req.body.isActive === 'false') });
  res.status(201).json({ collection });
}
export async function updateCollection(req, res) {
  const collection = await Collection.findById(req.params.id);
  if (!collection) return res.status(404).json({ message: 'Collection not found.' });
  if (req.body.name !== undefined) {
    if (!isName(req.body.name)) return res.status(400).json({ message: 'Collection name is invalid.' });
    collection.name = req.body.name.trim(); collection.slug = await uniqueSlug(collection.name, collection._id);
  }
  if (req.body.description !== undefined) collection.description = String(req.body.description).slice(0, 1500);
  if (req.body.bannerImage !== undefined) collection.bannerImage = req.body.bannerImage;
  if (req.body.isActive !== undefined) collection.isActive = req.body.isActive === true || req.body.isActive === 'true';
  await collection.save(); res.json({ collection });
}
export async function deleteCollection(req, res) {
  const collection = await Collection.findById(req.params.id);
  if (!collection) return res.status(404).json({ message: 'Collection not found.' });
  await Product.updateMany({ collection: req.params.id }, { $set: { collection: null } });
  await collection.deleteOne();
  res.json({ message: 'Collection deleted.' });
}
