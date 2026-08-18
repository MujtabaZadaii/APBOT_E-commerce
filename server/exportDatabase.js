import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Product from './models/Product.js';
import User from './models/User.js';
import Order from './models/Order.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sable';

async function exportCompleteDatabase() {
  try {
    console.log("Connecting to MongoDB at", MONGO_URI);
    await mongoose.connect(MONGO_URI);

    console.log("Fetching all products, users, and orders from database...");
    const products = await Product.find({}).lean();
    const users = await User.find({}).lean();
    const orders = await Order.find({}).lean();

    const fullDatabaseDump = {
      exportedAt: new Date().toISOString(),
      databaseName: "sable",
      collections: {
        products: products,
        users: users,
        orders: orders
      }
    };

    const targetPath = path.join(process.cwd(), 'database.json');
    fs.writeFileSync(targetPath, JSON.stringify(fullDatabaseDump, null, 2), 'utf-8');

    console.log(`✅ Complete database exported successfully to ${targetPath}!`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Orders: ${orders.length}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error exporting database:", err);
    process.exit(1);
  }
}

exportCompleteDatabase();
