import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true }, publicId: { type: String, required: true },
  width: Number, height: Number, format: String,
}, { _id: false });
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 160 },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  description: { type: String, trim: true, maxlength: 5000, default: '' },
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: { type: Number, min: 0, default: null },
  images: { type: [imageSchema], validate: [v => v.length > 0 && v.length <= 10, 'Add between 1 and 10 product images'] },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  collection: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection', default: null, index: true },
  sizes: [{ type: String, trim: true, maxlength: 40 }],
  colors: [{ type: String, trim: true, maxlength: 40 }],
  stock: { type: Number, min: 0, default: 0 },
  isActive: { type: Boolean, default: true, index: true },
  isNewArrival: { type: Boolean, default: true, index: true },
  isFeatured: { type: Boolean, default: false, index: true },
}, { timestamps: true, suppressReservedKeysWarning: true });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ isActive: 1, createdAt: -1 });
productSchema.index({ isActive: 1, price: 1 });
productSchema.index({ isActive: 1, isFeatured: -1, createdAt: -1 });
productSchema.index({ isActive: 1, isNewArrival: -1, createdAt: -1 });
productSchema.index({ category: 1, isActive: 1, price: 1 });
productSchema.index({ collection: 1, isActive: 1 });
export default mongoose.model('Product', productSchema);
