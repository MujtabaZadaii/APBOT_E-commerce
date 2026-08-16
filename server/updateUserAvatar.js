import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const newAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLzg71mkC9h8hkEEmJPzML1MOXvRDYpO2543Jlyc-moLlVV4kUtMmfdf8&s=10';

mongoose.connect('mongodb://127.0.0.1:27017/sable', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  try {
    const res = await User.updateMany({}, { $set: { avatar: newAvatar } });
    console.log(`Updated ${res.modifiedCount} user avatar(s) to the requested URL.`);
    process.exit(0);
  } catch (err) {
    console.error("Failed to update user avatars:", err);
    process.exit(1);
  }
});
