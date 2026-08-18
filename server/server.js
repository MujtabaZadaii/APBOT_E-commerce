import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import subscriberRoutes from './routes/subscriberRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import apbotRoutes from './routes/apbotRoutes.js';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/user', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/apbot', apbotRoutes);
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SABLE MERN API server active' });
});
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`SABLE backend server listening on port ${PORT}`);
  });
}).catch(err => {
  console.error(`MongoDB Connection Error: ${err.message}`);
  console.error('Failed to start server. MongoDB must be running on mongodb://localhost:27017/sable');
  process.exit(1);
});
