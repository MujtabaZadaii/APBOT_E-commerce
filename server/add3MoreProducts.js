import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
dotenv.config();
const newProducts = [
  {
    nm: 'Raw Selvedge Denim',
    ct: 'Tailoring',
    pr: 165.00,
    img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000',
    desc: 'Crafted from 14.5oz Japanese selvedge denim woven on vintage shuttle looms in Kojima, Japan. Designed with a medium rise and a clean straight leg that ages uniquely with every wear.',
    material: '100% Kurabo Japanese Selvedge Cotton (14.5oz)',
    sizes: ['30W', '32W', '34W', '36W'],
    colour: 'Raw Indigo',
    features: [
      '14.5oz Japanese shuttle loom selvedge denim',
      'Red selvedge ID line along side seams',
      'Custom debossed leather waistband patch',
      'Hidden back pocket rivets and chain-stitched hem',
      'Model is 185cm wearing size 32W'
    ],
    tags: ['denim', 'jeans', 'selvedge', 'indigo', 'raw'],
    inStock: true
  },
  {
    nm: 'Merino Mockneck Knit',
    ct: 'Knitwear',
    pr: 195.00,
    img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1000',
    desc: 'A sophisticated mid-weight knit with a high double-layer mockneck collar. Spun from ultra-soft Italian merino yarn for exceptional thermal efficiency and a refined, seamless finish.',
    material: '100% Extrafine Italian Merino Wool',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colour: 'Slate Grey',
    features: [
      '100% Extrafine Italian spun merino wool',
      'Double-layer mock collar for structure and warmth',
      'Ribbed cuffs and lower hemline',
      'Naturally breathable and temperature-regulating',
      'Model is 187cm wearing size Medium'
    ],
    tags: ['knitwear', 'mockneck', 'merino', 'grey', 'sweater'],
    inStock: true
  },
  {
    nm: 'Suede Utility Overshirt',
    ct: 'Outerwear',
    pr: 410.00,
    img: 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?q=80&w=1000',
    desc: 'An opulent shirt jacket crafted from velvety Italian calfskin suede. Unlined for an unconstructed feel that molds effortlessly to your form over time. Features horn buttons and dual chest patch pockets.',
    material: '100% Italian Calfskin Suede',
    sizes: ['S', 'M', 'L', 'XL'],
    colour: 'Tobacco Brown',
    features: [
      'Ultra-soft Italian calfskin suede',
      'Unlined construction for lightweight layering',
      'Genuine matte horn button closure',
      'Dual chest patch pockets with flap closure',
      'Model is 189cm wearing size Large'
    ],
    tags: ['outerwear', 'suede', 'overshirt', 'brown', 'jacket'],
    inStock: true
  }
];
mongoose.connect('mongodb://127.0.0.1:27017/sable', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  try {
    console.log("Adding 3 more luxury products to SABLE DB...");
    const inserted = await Product.insertMany(newProducts);
    const allProducts = await Product.find({});
    for (let p of allProducts) {
      const related = allProducts
        .filter(other => other._id.toString() !== p._id.toString())
        .slice(0, 3)
        .map(other => other._id);
      await Product.findByIdAndUpdate(p._id, {
        $set: { relatedProducts: related }
      });
    }
    console.log(`Successfully added 3 products! Total products now: ${allProducts.length}`);
    process.exit(0);
  } catch (err) {
    console.error("Error adding 3 products:", err);
    process.exit(1);
  }
});
