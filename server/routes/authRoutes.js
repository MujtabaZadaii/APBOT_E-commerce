import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'sable_super_secret_key_123';

// Real MongoDB Registration Endpoint
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: password
    });

    await user.save();

    const token = jwt.sign({ id: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLzg71mkC9h8hkEEmJPzML1MOXvRDYpO2543Jlyc-moLlVV4kUtMmfdf8&s=10',
        token
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Database registration error' });
  }
});

// Real MongoDB Login Endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Logged in successfully',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLzg71mkC9h8hkEEmJPzML1MOXvRDYpO2543Jlyc-moLlVV4kUtMmfdf8&s=10',
        token
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Database login error' });
  }
});

export default router;
