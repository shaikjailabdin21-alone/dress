import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  description: { type: String, trim: true, maxlength: 1500, default: '' },
  bannerImage: { url: String, publicId: String },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  isActive: { type: Boolean, default: true },
}, { timestamps: { createdAt: true, updatedAt: false } });
export default mongoose.model('Collection', collectionSchema);
