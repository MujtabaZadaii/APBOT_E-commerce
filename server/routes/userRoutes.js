import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Save or Update User Shipping Address
router.post('/address', async (req, res) => {
  try {
    const { email, address } = req.body;
    if (!email || !address) {
      return res.status(400).json({ message: 'Email and address are required' });
    }

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { address },
      { new: true }
    );

    res.json({ message: 'Address updated successfully', address: user?.address || address });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET user wishlist
router.get('/wishlist', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    res.json({ wishlist: user?.wishlist || [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle wishlist item for user
router.post('/wishlist/toggle', async (req, res) => {
  try {
    const { email, productId } = req.body;
    if (!email || !productId) return res.status(400).json({ message: 'Email and productId required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const exists = user.wishlist.includes(productId);
    if (exists) {
      user.wishlist = user.wishlist.filter(id => id !== productId);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    res.json({ message: 'Wishlist updated', wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
