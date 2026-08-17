import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
dotenv.config();
const migrations = {
  'Rift Overshirt': {
    colour: 'Ink Black',
    features: ['Double chest pockets', 'Corozo button closure', 'Heavyweight brushed finish', 'Relaxed boxy fit'],
    tags: ['overshirt', 'jacket', 'heavyweight', 'transitional']
  },
  'Heavy Tee': {
    colour: 'Bone',
    features: ['Dropped shoulders', 'Thick ribbed collar', 'Garment dyed', 'Preshrunk'],
    tags: ['tee', 'tshirt', 'essential', 'heavy']
  },
  'Gauge Cardigan': {
    colour: 'Charcoal',
    features: ['Chunky knit', 'V-neckline', 'Horn buttons', 'Ribbed cuffs and hem'],
    tags: ['cardigan', 'knit', 'wool', 'chunky']
  },
  'Cable Crew': {
    colour: 'Ivory',
    features: ['Traditional cable pattern', 'Set-in sleeves', 'Medium weight', 'Ribbed trims'],
    tags: ['sweater', 'crew', 'knit', 'merino']
  }
};
mongoose.connect('mongodb://127.0.0.1:27017/sable', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  const products = await Product.find({});
  for (const p of products) {
    const data = migrations[p.nm];
    if (data) {
      const related = products.filter(rp => rp._id.toString() !== p._id.toString()).map(rp => rp._id);
      await Product.updateOne({ _id: p._id }, {
        $set: {
          colour: data.colour,
          features: data.features,
          tags: data.tags,
          relatedProducts: related
        }
      });
      console.log(`Migrated: ${p.nm}`);
    }
  }
  console.log("Migration complete!");
  process.exit(0);
}).catch(err => {
  console.log("Migration error:", err);
  process.exit(1);
});
