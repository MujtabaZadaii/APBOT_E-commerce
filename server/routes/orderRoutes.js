import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// Create / Book New Order in Database
router.post('/create', async (req, res) => {
  try {
    const orderData = req.body;
    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();
    res.status(201).json({ message: 'Order created successfully', order: savedOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET Orders for User
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET Order by Tracking ID or Order ID (Real Database Lookup)
router.get('/track/:code', async (req, res) => {
  try {
    const { code } = req.params;
    if (!code || !code.trim()) {
      return res.status(400).json({ message: 'Tracking code is required' });
    }

    const searchRegex = new RegExp(`^${code.trim()}$`, 'i');
    const order = await Order.findOne({
      $or: [
        { orderId: searchRegex },
        { trackingNumber: searchRegex }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: 'No order found with this tracking code' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT Update Order Tracking Status (10-minute auto-update)
router.put('/update-status', async (req, res) => {
  try {
    const { orderId, trackingStatus } = req.body;
    if (!orderId || !trackingStatus) {
      return res.status(400).json({ message: 'orderId and trackingStatus required' });
    }

    const order = await Order.findOneAndUpdate(
      { orderId },
      { trackingStatus },
      { new: true }
    );

    res.json({ message: 'Status updated successfully', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
