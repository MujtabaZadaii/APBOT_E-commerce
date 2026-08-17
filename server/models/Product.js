import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
  nm: { type: String, required: true },
  ct: { type: String, required: true },
  pr: { type: Number, required: true },
  img: { type: String, required: true },
  desc: { type: String, default: '' },
  material: { type: String, default: 'Cotton' },
  sizes: { type: [String], default: ['S', 'M', 'L', 'XL'] },
  colour: { type: String, default: 'Black' },
  features: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  inStock: { type: Boolean, default: true }
}, {
  timestamps: true
});
export default mongoose.model('Product', productSchema);
