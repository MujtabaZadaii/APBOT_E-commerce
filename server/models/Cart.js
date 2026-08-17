import mongoose from 'mongoose';
const cartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  nm: { type: String, required: true },
  ct: { type: String, required: true },
  pr: { type: Number, required: true },
  img: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 }
});
const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  items: [cartItemSchema]
}, {
  timestamps: true
});
export default mongoose.model('Cart', cartSchema);
