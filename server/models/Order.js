import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  items: Array,
  subtotal: Number,
  shippingCost: Number,
  totalAmount: { type: Number, required: true },
  shippingAddress: Object,
  paymentMethod: { type: String, default: 'Credit Card' },
  trackingNumber: { type: String, required: true },
  trackingStatus: { type: String, default: 'Order Placed' }
}, {
  timestamps: true
});

export default mongoose.model('Order', orderSchema);
