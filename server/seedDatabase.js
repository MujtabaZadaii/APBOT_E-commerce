import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Product from './models/Product.js';
import User from './models/User.js';
import Order from './models/Order.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sable';

async function importCompleteDatabase() {
  try {
    console.log("Connecting to MongoDB at", MONGO_URI);
    await mongoose.connect(MONGO_URI);

    const rootDbPath = path.join(process.cwd(), 'database.json');
    const serverDbPath = path.join(process.cwd(), 'server', 'database.json');
    const dbDirDbPath = path.join(process.cwd(), '..', 'db', 'database.json');
    const dbDirRootPath = path.join(process.cwd(), 'db', 'database.json');
    let dbFilePath = [rootDbPath, serverDbPath, dbDirDbPath, dbDirRootPath].find(p => fs.existsSync(p));

    if (!dbFilePath) {
      throw new Error("❌ database.json file not found in root or server directory!");
    }

    console.log(`Reading complete database file from ${dbFilePath}...`);
    const rawData = fs.readFileSync(dbFilePath, 'utf-8');
    const dbDump = JSON.parse(rawData);

    const products = dbDump.collections?.products || [];
    const users = dbDump.collections?.users || [];
    const orders = dbDump.collections?.orders || [];

    console.log("Clearing existing database collections...");
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});

    if (products.length > 0) {
      await Product.insertMany(products);
      console.log(`  ✅ Imported ${products.length} Products`);
    }
    if (users.length > 0) {
      await User.insertMany(users);
      console.log(`  ✅ Imported ${users.length} Users`);
    }
    if (orders.length > 0) {
      await Order.insertMany(orders);
      console.log(`  ✅ Imported ${orders.length} Orders`);
    }

    console.log("🎉 Complete database imported successfully into MongoDB!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error importing database:", err);
    process.exit(1);
  }
}

importCompleteDatabase();
