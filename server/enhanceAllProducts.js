import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const richProducts = [
  {
    nm: 'Rift Overshirt',
    ct: 'Outerwear',
    pr: 185.00,
    img: 'https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/p-overshirt.webp',
    desc: 'An architectural piece built for fluid seasonal transitions. The Rift Overshirt is cut from a heavy 400gsm organic cotton twill, offering structure without compromising motion. Features hidden front placket buttons, deep chest utility pockets, and reinforced flat-felled seams.',
    material: '100% Heavyweight Organic Cotton Twill (400gsm)',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colour: 'Charcoal',
    features: [
      'Heavyweight 400gsm cotton twill construction',
      'Concealed horn button front placket',
      'Dual chest flap pockets with concealed snaps',
      'Pre-washed for a soft hand-feel and pre-shrunk fit',
      'Model is 187cm wearing size Medium'
    ],
    tags: ['overshirt', 'outerwear', 'cotton', 'charcoal', 'layering'],
    inStock: true
  },
  {
    nm: 'Heavy Tee',
    ct: 'Essentials',
    pr: 58.00,
    img: 'https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/p-tee.webp',
    desc: 'The foundation of modern daily wear. Engineered with a custom 280gsm single jersey cotton, offering a structured, boxy drape that holds its shape through every wear. Features a tightly knit ribbed collar and clean blind-stitched hems.',
    material: '100% Long-Staple Combed Cotton (280gsm)',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colour: 'Off-White',
    features: [
      'Heavyweight 280gsm long-staple cotton',
      'Signature boxy fit with slightly dropped shoulders',
      '1x1 thick bound collar that maintains elasticity',
      'Garment-dyed for depth of color',
      'Model is 185cm wearing size Large'
    ],
    tags: ['tee', 't-shirt', 'essentials', 'white', 'basics'],
    inStock: true
  },
  {
    nm: 'Gauge Cardigan',
    ct: 'Knitwear',
    pr: 210.00,
    img: 'https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/p-cardigan.webp',
    desc: 'A heavy 5-gauge cardigan spun from a luxurious blend of extrafine merino wool and baby alpaca. Built with deep ribbing at the hem and cuffs, real mother-of-pearl buttons, and a tactile slub texture designed to keep warmth locked in.',
    material: '70% Extrafine Merino Wool, 30% Baby Alpaca',
    sizes: ['S', 'M', 'L', 'XL'],
    colour: 'Oatmeal',
    features: [
      'Tactile 5-gauge chunky knit weave',
      'Genuine mother-of-pearl button closure',
      'Naturally thermoregulating and odor-resistant fibers',
      'Relaxed silhouette with ribbed cuffs and hem',
      'Model is 189cm wearing size Medium'
    ],
    tags: ['cardigan', 'knitwear', 'wool', 'alpaca', 'winter'],
    inStock: true
  },
  {
    nm: 'Cable Crew',
    ct: 'Knitwear',
    pr: 240.00,
    img: 'https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/p-knit.webp',
    desc: 'A modern homage to maritime heritage knits. Sculpted with high-definition cable stitches using 100% untreated superfine merino yarn. Delivers unmatched comfort, exceptional insulation, and timeless sophistication.',
    material: '100% Superfine Merino Wool (19.5 Micron)',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colour: 'Ivory',
    features: [
      'Intricate 3D traditional cable pattern',
      'Superfine 19.5 micron merino wool for itch-free wear',
      'Seamless 3D knit technology for ergonomic comfort',
      'Ribbed crewneck collar, cuffs, and waist',
      'Model is 186cm wearing size Medium'
    ],
    tags: ['knitwear', 'crewneck', 'merino', 'cable', 'sweater'],
    inStock: true
  },
  {
    nm: 'Premium Bomber Jacket',
    ct: 'Outerwear',
    pr: 189.00,
    img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000',
    desc: 'A sleek, elevated take on classic flight jackets. Tailored from weather-proof matte nylon canvas with a satin cupro lining. Outfitted with custom gunmetal hardware, two interior media pockets, and lightweight thermal insulation.',
    material: 'Shell: 100% Weatherproof Matte Nylon | Lining: 100% Cupro',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colour: 'Obsidian Black',
    features: [
      'Water-repellent and windproof matte shell',
      'Heavy-duty two-way gunmetal Raccagni zipper',
      'Insulated with eco-friendly recycled fill',
      'Deep dual interior zip pockets for valuables',
      'Model is 188cm wearing size Large'
    ],
    tags: ['bomber', 'jacket', 'outerwear', 'black', 'waterproof'],
    inStock: true
  },
  {
    nm: 'Minimalist Trench Coat',
    ct: 'Outerwear',
    pr: 345.00,
    img: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?q=80&w=1000',
    desc: 'The definitive coat for rain or shine. Engineered with tight-weave cotton gabardine, boasting an elegant long silhouette with unlined seams for fluid movement. Includes an adjustable storm flap, waist sash, and horn buttons.',
    material: '100% High-Density Cotton Gabardine',
    sizes: ['S', 'M', 'L'],
    colour: 'Sand Khaki',
    features: [
      'Dense gabardine weave provides natural rain protection',
      'Unstructured shoulders for an effortless, graceful drape',
      'Removable waist belt with wrapped buckle',
      'Ventilated back storm flap',
      'Model is 185cm wearing size Medium'
    ],
    tags: ['trench', 'coat', 'outerwear', 'khaki', 'classic'],
    inStock: true
  },
  {
    nm: 'Brushed Cashmere Hoodie',
    ct: 'Knitwear',
    pr: 285.00,
    img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000',
    desc: 'The pinnacle of relaxed luxury. Hand-brushed grade-A Mongolian cashmere yields an extraordinarily cloud-like feel. Designed without cords or eyelets for a clean, minimalist silhouette.',
    material: '100% Grade-A Mongolian Cashmere',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colour: 'Heather Grey',
    features: [
      '100% 2-ply Grade-A Mongolian cashmere',
      'Hand-brushed finish for soft depth and texture',
      'Double-layer self-fabric hood for structured volume',
      'Seamless kangaroo pocket integration',
      'Model is 182cm wearing size Medium'
    ],
    tags: ['hoodie', 'cashmere', 'knitwear', 'grey', 'luxury'],
    inStock: true
  },
  {
    nm: 'Structured Wool Blazer',
    ct: 'Tailoring',
    pr: 420.00,
    img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1000',
    desc: 'Precision tailoring from the heart of Biella, Italy. Crafted from 100% virgin wool hopsack with half-canvas construction that contours to your body over time. Finished with genuine horn buttons and functional button cuffs.',
    material: '100% Italian Virgin Wool Hopsack',
    sizes: ['38R', '40R', '42R', '44R'],
    colour: 'Midnight Navy',
    features: [
      'Half-canvas internal chest construction',
      'Italian virgin wool with natural crease resistance',
      'Working sleeve cuffs with genuine horn buttons',
      'Double back vents for ease of movement',
      'Model is 188cm wearing size 40R'
    ],
    tags: ['blazer', 'suit', 'tailoring', 'navy', 'wool'],
    inStock: true
  },
  {
    nm: 'Classic Leather Moto',
    ct: 'Outerwear',
    pr: 590.00,
    img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000',
    desc: 'A rugged yet refined icon. Crafted from vegetable-tanned full-grain lambskin that breaks in beautifully to develop a personalized patina. Custom oxidized brass hardware, action-back shoulder gussets, and silky cupro lining.',
    material: '100% Full-Grain Vegetable-Tanned Lambskin',
    sizes: ['S', 'M', 'L', 'XL'],
    colour: 'Deep Onyx',
    features: [
      '1.1mm full-grain lambskin leather',
      'Custom oxidized brass zippers and snaps',
      'Bi-swing back shoulder gussets for maximum range of motion',
      'Quilted lower back lumbar panel',
      'Model is 186cm wearing size Medium'
    ],
    tags: ['leather', 'jacket', 'moto', 'outerwear', 'black'],
    inStock: true
  }
];

mongoose.connect('mongodb://127.0.0.1:27017/sable', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  try {
    console.log("Enriching all 9 products with luxury details in SABLE DB...");

    await Product.deleteMany({});
    const inserted = await Product.insertMany(richProducts);

    // Link related products dynamically for cross-sell across all products
    for (let i = 0; i < inserted.length; i++) {
      const current = inserted[i];
      // Pick 3 other products from the list as related items
      const related = inserted
        .filter((_, idx) => idx !== i)
        .slice(i % 5, (i % 5) + 3)
        .map(p => p._id);

      await Product.findByIdAndUpdate(current._id, {
        $set: { relatedProducts: related }
      });
    }

    console.log(`Successfully saved ${inserted.length} deeply detailed products with cross-product connections!`);
    process.exit(0);
  } catch (err) {
    console.error("Error populating database:", err);
    process.exit(1);
  }
});
