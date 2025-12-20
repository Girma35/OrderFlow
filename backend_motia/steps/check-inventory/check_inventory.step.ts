import { connectDB } from '../../database/connection';
import { Product } from '../../database/models';
import type { CronConfig } from 'motia';

export const config: CronConfig = {
  name: 'checkInventoryStep',
  type: 'cron',
  description: 'Periodically checks inventory levels',
  cron: '* * * * *', // every minute
  emits: ['inventory.threshold_reached'],
  flows: ['inventory-management-flow']
};

export const handler = async ({ logger, emit }: any) => {
  await connectDB();

  const stores = ['X', 'Y', 'Z'];

  for (const storeId of stores) {
    try {
      logger.info(`Checking inventory for Store: ${storeId}`);

      const products = await Product.find({ storeId }).exec();

      if (!products.length) {
        logger.info(`No inventory found for Store: ${storeId}`);
        continue;
      }

      for (const product of products) {
        const threshold = typeof product.threshold === 'number' ? product.threshold : 10;

        if (product.stock <= threshold) {
          logger.warn(`Inventory threshold reached for ${product.productName} in Store ${storeId}`, {
            productId: product.productId,
            currentStock: product.stock,
            threshold
          });

          await emit({
            topic: 'inventory.threshold_reached',
            data: {
              storeId,
              productId: product.productId,
              productName: product.productName,
              currentStock: product.stock,
              threshold,
              timestamp: new Date().toISOString()
            }
          });
        }

        if (product.status === 'stale') {
          product.status = 'active';
          await product.save();
        }
      }
    } catch (error) {
      logger.error(`Failed inventory update for Store ${storeId}`, { error });
    }
  }

  logger.info('Global inventory check completed.');
};