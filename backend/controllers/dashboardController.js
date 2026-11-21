import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Collection from '../models/Collection.js';

export async function dashboardStats(req, res) {
  const [totalProducts, activeProducts, totalCategories, totalCollections] = await Promise.all([
    Product.countDocuments(), Product.countDocuments({ isActive: true }), Category.countDocuments(), Collection.countDocuments(),
  ]);
  res.json({ stats: { totalProducts, activeProducts, totalCategories, totalCollections } });
}
export async function recentProducts(req, res) {
  const products = await Product.find().sort({ createdAt: -1 }).limit(8).populate('category', 'name').select('name price images category isActive createdAt').lean();
  res.json({ products });
}
