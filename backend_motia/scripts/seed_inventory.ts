import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Product } from '../database/models.ts';

dotenv.config();

const productCatalog = [
  { key: 'smartwatch', productName: 'Motia Smartwatch V2', threshold: 15 },
  { key: 'sensor', productName: 'Motia IoT Sensor Kit', threshold: 10 },
  { key: 'headset', productName: 'Motia Pro Headset', threshold: 20 },
  { key: 'devboard', productName: 'Motia AI Dev Board', threshold: 5 },
];

const storeStockLevels: Record<string, Record<string, number>> = {
  X: { smartwatch: 50, sensor: 30, headset: 25, devboard: 15 },
  Y: { smartwatch: 35, sensor: 18, headset: 12, devboard: 9 },
  Z: { smartwatch: 70, sensor: 45, headset: 33, devboard: 22 },
};

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI environment variable. Create a .env file or export the variable before running this script.');
  process.exit(1);
}

async function seedInventory() {
  await mongoose.connect(MONGODB_URI);

  const initialProducts = Object.entries(storeStockLevels).flatMap(([storeId, stockMap]) =>
    productCatalog.map((product, idx) => ({
      productId: `prod-${storeId.toLowerCase()}-${(idx + 1).toString().padStart(3, '0')}`,
      productName: product.productName,
      stock: stockMap[product.key],
      threshold: product.threshold,
      storeId,
      status: stockMap[product.key] > 0 ? 'active' : 'out_of_stock',
    }))
  );

  let createdCount = 0;

  for (const prodData of initialProducts) {
    const result = await Product.updateOne(
      { productName: prodData.productName, storeId: prodData.storeId },
      { $setOnInsert: prodData },
      { upsert: true }
    );

    if (result.upsertedCount && result.upsertedCount > 0) {
      createdCount += 1;
      console.log(`Inserted ${prodData.productName} for Store ${prodData.storeId}`);
    } else {
      console.log(`Skipped ${prodData.productName} for Store ${prodData.storeId} (already exists)`);
    }
  }

  console.log(`Seeding complete. Created ${createdCount} new inventory records.`);
}

seedInventory()
  .catch((err) => {
    console.error('Failed to seed inventory:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
