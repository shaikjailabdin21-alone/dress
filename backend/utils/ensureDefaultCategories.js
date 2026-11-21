import slugify from 'slugify';
import Category from '../models/Category.js';

const defaultCategories = [
  'Burkha', 'Hijab', 'Niqab', 'Topi', 'Prayer Wear', 'Abaya', 'Khimar',
  'Hijab Sets', 'Accessories', 'New Arrivals', 'Featured Collections', 'Unclassified',
];

export default async function ensureDefaultCategories() {
  for (const name of defaultCategories) {
    const slug = slugify(name, { lower: true, strict: true });
    await Category.updateOne({ slug }, { $setOnInsert: { name, slug, isActive: true } }, { upsert: true });
  }
}
