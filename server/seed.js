import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const products = [
  {
    nm: 'Rift Overshirt',
    ct: 'Outerwear',
    pr: 185,
    img: 'https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/p-overshirt.webp',
    desc: 'A premium heavy-weight overshirt designed for transitional weather.',
    material: '100% Heavyweight Cotton',
    sizes: ['S', 'M', 'L']
  },
  {
    nm: 'Heavy Tee',
    ct: 'Essentials',
    pr: 58,
    img: 'https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/p-tee.webp',
    desc: 'Our signature heavy tee with a relaxed fit and dropped shoulders.',
    material: '100% Organic Cotton',
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    nm: 'Gauge Cardigan',
    ct: 'Knitwear',
    pr: 210,
    img: 'https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/p-cardigan.webp',
    desc: 'Chunky knit cardigan made from ultra-soft wool blend.',
    material: '80% Wool, 20% Alpaca',
    sizes: ['M', 'L', 'XL']
  },
  {
    nm: 'Cable Crew',
    ct: 'Knitwear',
    pr: 240,
    img: 'https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/p-knit.webp',
    desc: 'Classic cable-knit crewneck sweater, perfect for layering.',
    material: '100% Merino Wool',
    sizes: ['S', 'M', 'L']
  }
];

mongoose.connect('mongodb://127.0.0.1:27017/sable', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log("Database seeded successfully!");
  process.exit();
}).catch(err => {
  console.log(err);
  process.exit(1);
});
