import express from 'express';
import User from '../models/User.js';
import { verifyToken, optionalToken } from '../middleware/auth.js';
const router = express.Router();
router.post('/address', verifyToken, async (req, res) => {
  try {
    const userEmail = req.user.email.toLowerCase().trim();
    const { address } = req.body;
    if (!address) {
      return res.status(400).json({ message: 'Address is required' });
    }
    const user = await User.findOneAndUpdate(
      { email: userEmail },
      { address },
      { new: true }
    );
    res.json({ message: 'Address updated successfully', address: user?.address || address });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/wishlist', verifyToken, async (req, res) => {
  try {
    const userEmail = req.user.email.toLowerCase().trim();
    const user = await User.findOne({ email: userEmail });
    res.json({ wishlist: user?.wishlist || [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/wishlist/toggle', verifyToken, async (req, res) => {
  try {
    const userEmail = req.user.email.toLowerCase().trim();
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId required' });
    const user = await User.findOne({ email: userEmail });
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
