import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const imageMapping = {
  'Brushed Cashmere Hoodie': '/Brushed Cashmere Hoodie.png',
  'Classic Leather Moto': '/Classic Leather Moto.png',
  'Merino Mockneck Knit': '/Merino Mockneck Knit.png',
  'Minimalist Trench Coat': '/Minimalist Trench Coat.png',
  'Premium Bomber Jacket': '/Premium Bomber Jacket.png',
  'Raw Selvedge Denim': '/Raw Selvedge Denim.png',
  'Structured Wool Blazer': '/Structured Wool Blazer.png',
  'Suede Utility Overshirt': '/Suede Utility Overshirt.png'
};

mongoose.connect('mongodb://127.0.0.1:27017/sable', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  try {
    console.log("Updating product image URLs in MongoDB...");

    for (const [productName, imagePath] of Object.entries(imageMapping)) {
      const res = await Product.updateMany(
        { nm: productName },
        { $set: { img: imagePath } }
      );
      console.log(`Updated ${productName}: ${res.modifiedCount} document(s) updated.`);
    }

    console.log("Database update complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error updating database:", err);
    process.exit(1);
  }
});
