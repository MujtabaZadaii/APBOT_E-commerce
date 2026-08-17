import express from 'express';
import Order from '../models/Order.js';
import { verifyToken, optionalToken } from '../middleware/auth.js';

const router = express.Router();

// Create / Book New Order in Database
router.post('/create', optionalToken, async (req, res) => {
  try {
    const orderData = req.body;
    
    // Security Audit: If authenticated, bind order ownership to verified user identity
    if (req.user) {
      orderData.userId = req.user.email || req.user.id;
    }

    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();
    res.status(201).json({ message: 'Order created successfully', order: savedOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET Orders for User (Protected with ownership check)
router.get('/user/:userId', optionalToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Security check: If authenticated token exists, prevent User A from reading User B's orders
    if (req.user) {
      const userIdentities = [req.user.id, req.user.email.toLowerCase().trim()];
      if (!userIdentities.includes(userId.toLowerCase().trim())) {
        return res.status(403).json({ message: 'Forbidden: Cannot access order history of another user' });
      }
    }

    const orders = await Order.find({ 
      $or: [
        { userId: userId },
        { userId: userId.toLowerCase().trim() }
      ] 
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET Order by Tracking ID or Order ID (Public Lookup for single tracking code)
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

// PUT Update Order Tracking Status
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
