import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, default: 'customer' },
  avatar: { type: String, default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLzg71mkC9h8hkEEmJPzML1MOXvRDYpO2543Jlyc-moLlVV4kUtMmfdf8&s=10' },
  wishlist: [{ type: String }]
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
