import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, default: 'customer' },
  avatar: { type: String, default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLzg71mkC9h8hkEEmJPzML1MOXvRDYpO2543Jlyc-moLlVV4kUtMmfdf8&s=10' },
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    country: { type: String, default: '' }
  },
  wishlist: [{ type: String }]
}, {
  timestamps: true
});
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
    return await bcrypt.compare(candidatePassword, this.password);
  }
  return candidatePassword === this.password;
};
export default mongoose.model('User', userSchema);
