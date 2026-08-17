import express from 'express';
import Cart from '../models/Cart.js';
import { optionalToken } from '../middleware/auth.js';
const router = express.Router();
router.get('/:userId', optionalToken, async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user) {
      const userIdentities = [req.user.id, req.user.email.toLowerCase().trim()];
      if (!userIdentities.includes(userId.toLowerCase().trim())) {
        return res.status(403).json({ message: 'Forbidden: Cannot access cart of another user' });
      }
    }
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/save', optionalToken, async (req, res) => {
  try {
    let { userId, items } = req.body;
    if (req.user) {
      userId = req.user.email || req.user.id;
    }
    if (!userId) {
      return res.status(400).json({ message: 'UserId is required' });
    }
    let cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = items;
      await cart.save();
    } else {
      cart = new Cart({ userId, items });
      await cart.save();
    }
    res.json({ message: 'Cart saved successfully', cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete('/clear/:userId', optionalToken, async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user) {
      const userIdentities = [req.user.id, req.user.email.toLowerCase().trim()];
      if (!userIdentities.includes(userId.toLowerCase().trim())) {
        return res.status(403).json({ message: 'Forbidden: Cannot modify cart of another user' });
      }
    }
    await Cart.findOneAndUpdate({ userId }, { items: [] });
    res.json({ message: 'Cart cleared successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
export default router;
