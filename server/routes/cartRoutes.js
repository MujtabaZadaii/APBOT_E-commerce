import express from 'express';
import Cart from '../models/Cart.js';

const router = express.Router();

// GET user cart by userId (email or ID)
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
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

// POST save / update user cart
router.post('/save', async (req, res) => {
  try {
    const { userId, items } = req.body;
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

// DELETE clear cart
router.delete('/clear/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    await Cart.findOneAndUpdate({ userId }, { items: [] });
    res.json({ message: 'Cart cleared successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
