import express from 'express';
import Subscriber from '../models/Subscriber.js';

const router = express.Router();

// POST subscribe email
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(200).json({ message: 'Already subscribed' });
    }

    const subscriber = new Subscriber({ email });
    await subscriber.save();
    res.status(201).json({ message: 'Successfully subscribed to SABLE mailing list' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
