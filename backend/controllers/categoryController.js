import slugify from 'slugify';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { isName } from '../utils/validators.js';

const makeSlug = name => slugify(name, { lower: true, strict: true });
async function uniqueSlug(name, id) {
  const base = makeSlug(name); let slug = base, suffix = 2;
  while (await Category.exists({ slug, ...(id ? { _id: { $ne: id } } : {}) })) slug = `${base}-${suffix++}`;
  return slug;
}
export async function listCategories(req, res) {
  res.json({ categories: await Category.find(req.admin ? {} : { isActive: true }).sort({ name: 1 }).lean() });
}
export async function createCategory(req, res) {
  if (!isName(req.body.name, 80)) return res.status(400).json({ message: 'A category name is required (up to 80 characters).' });
  const name = req.body.name.trim();
  const slug = makeSlug(name);
  if (await Category.exists({ slug })) return res.status(409).json({ message: 'A category with this name already exists.' });
  const category = await Category.create({ name, slug: await uniqueSlug(name), description: req.body.description || '', image: req.body.image, isActive: !(req.body.isActive === false || req.body.isActive === 'false') });
  res.status(201).json({ category });
}
export async function updateCategory(req, res) {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found.' });
  if (req.body.name !== undefined) {
    if (!isName(req.body.name, 80)) return res.status(400).json({ message: 'Category name is invalid (up to 80 characters).' });
    category.name = req.body.name.trim(); category.slug = await uniqueSlug(category.name, category._id);
  }
  if (req.body.description !== undefined) category.description = String(req.body.description).slice(0, 1000);
  if (req.body.image !== undefined) category.image = req.body.image;
  if (req.body.isActive !== undefined) category.isActive = req.body.isActive === true || req.body.isActive === 'true';
  await category.save(); res.json({ category });
}
export async function deleteCategory(req, res) {
  if (await Product.exists({ category: req.params.id })) return res.status(409).json({ message: 'Move or delete this category’s products before removing it.' });
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found.' });
  res.json({ message: 'Category deleted.' });
}
