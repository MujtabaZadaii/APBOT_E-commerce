import mongoose from 'mongoose';
export const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sable');
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};
