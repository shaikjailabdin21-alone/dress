import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  description: { type: String, trim: true, maxlength: 1000, default: '' },
  image: { url: String, publicId: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: { createdAt: true, updatedAt: false } });
export default mongoose.model('Category', categorySchema);
