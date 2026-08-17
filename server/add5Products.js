import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
dotenv.config();
const newProducts = [
  {
    nm: 'Premium Bomber Jacket',
    ct: 'Outerwear',
    pr: 189.00,
    img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000',
    desc: 'A modern interpretation of a timeless silhouette. Crafted from premium materials with a refined finish for everyday elegance. Features a ribbed collar, cuffs, and hem. Two-way zip closure and hidden snap fasteners.',
    material: '100% Premium Matte Polyester',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colour: 'Black',
    features: [
      'Premium matte finish',
      'Lightweight and breathable',
      'Regular fit',
      'Water-resistant coating',
      'Model is 188cm and wears size M'
    ],
    tags: ['outerwear', 'jacket', 'black', 'bomber'],
    inStock: true
  },
  {
    nm: 'Minimalist Trench Coat',
    ct: 'Outerwear',
    pr: 345.00,
    img: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?q=80&w=1000',
    desc: 'The essential trench coat, stripped down to its pure architectural form. Double-breasted closure with a removable self-tie belt. Dropped shoulders for a relaxed drape.',
    material: '100% Gabardine Cotton',
    sizes: ['S', 'M', 'L'],
    colour: 'Beige',
    features: [
      'Water-repellent gabardine',
      'Oversized relaxed fit',
      'Horn button closures',
      'Adjustable cuff tabs',
      'Fully lined interior'
    ],
    tags: ['outerwear', 'trench', 'coat', 'beige', 'autumn'],
    inStock: true
  },
  {
    nm: 'Brushed Cashmere Hoodie',
    ct: 'Knitwear',
    pr: 285.00,
    img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000',
    desc: 'Elevated loungewear. This hoodie is spun from exceptionally soft brushed cashmere. Features a clean, hardware-free design with a subtle kangaroo pocket.',
    material: '100% Pure Cashmere',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colour: 'Heather Grey',
    features: [
      'Ultra-soft brushed texture',
      'Double-layered hood',
      'Ribbed trims',
      'Slouchy, comfortable fit',
      'Responsibly sourced yarn'
    ],
    tags: ['knitwear', 'hoodie', 'cashmere', 'grey', 'lounge'],
    inStock: true
  },
  {
    nm: 'Structured Wool Blazer',
    ct: 'Tailoring',
    pr: 420.00,
    img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1000',
    desc: 'Impeccable tailoring meets modern sensibility. A sharp, single-breasted blazer cut from Italian wool hopsack. Features structured shoulders and a subtly nipped waist.',
    material: '100% Italian Wool Hopsack',
    sizes: ['38', '40', '42', '44'],
    colour: 'Navy',
    features: [
      'Single-breasted 2-button closure',
      'Notch lapels',
      'Flap pockets',
      'Double back vent',
      'Cupro lining'
    ],
    tags: ['tailoring', 'blazer', 'suit', 'navy', 'formal'],
    inStock: true
  },
  {
    nm: 'Classic Leather Moto',
    ct: 'Outerwear',
    pr: 590.00,
    img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000',
    desc: 'An iconic silhouette. Crafted from supple full-grain lambskin leather that will patina beautifully over time. Features asymmetrical zip closure and silver-tone hardware.',
    material: '100% Full-Grain Lambskin Leather',
    sizes: ['S', 'M', 'L', 'XL'],
    colour: 'Black',
    features: [
      'Asymmetrical zip fastening',
      'Three exterior zip pockets',
      'Snap-fastening epaulets',
      'Zippered cuffs',
      'Premium hardware'
    ],
    tags: ['outerwear', 'jacket', 'leather', 'black', 'moto'],
    inStock: true
  }
];
mongoose.connect('mongodb://127.0.0.1:27017/sable', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  try {
    console.log("Adding 5 luxury products to SABLE...");
    const inserted = await Product.insertMany(newProducts);
    console.log(`Successfully added ${inserted.length} products.`);
    const bomberId = inserted[0]._id;
    const relatedIds = [inserted[1]._id, inserted[2]._id, inserted[3]._id];
    await Product.findByIdAndUpdate(bomberId, {
      $set: { relatedProducts: relatedIds }
    });
    console.log("Successfully linked related products for the Bomber Jacket.");
    process.exit(0);
  } catch (err) {
    console.error("Error inserting products:", err);
    process.exit(1);
  }
});
