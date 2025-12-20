import { z } from 'zod';
import type { EventConfig } from 'motia';
import { connectDB } from '../../database/connection';
import { Product, Order } from '../../database/models';

export const config: EventConfig = {
  name: 'dbSyncInventoryStep',
  type: 'event',
  description: 'Connects to MongoDB and syncs product stock for a store whenever an order completes.',
  subscribes: ['order.completed'],
  emits: ["delivery.shipped", "delivery.delivered"],
  flows: ['order-processing-flow']
};

const payloadSchema = z.object({
  orderId: z.string().uuid(),
  storeId: z.string().min(1),
  items: z.array(
    z.object({
      productName: z.string().min(1),
      remainingStock: z.number().int().min(0)
    })
  )
});
export const handler = async (
  input: any,
  { emit, logger, state }: any
) => {  
  const data = input?.data ?? input;
  const { orderId, storeId, items } = payloadSchema.parse(data);

  logger.info('Syncing DB inventory using order fulfillment payload', { orderId, storeId });

  await connectDB();

  const results: Array<{ productName: string; before?: number | null; after: number }> = [];

  for (const item of items) {
    const product = await Product.findOne({ productName: item.productName, storeId });

    if (!product) {
      logger.warn('Inventory sync skipped missing product', {
        storeId,
        productName: item.productName
      });
      continue;
    }

    const before = product.stock;
    product.stock = item.remainingStock;
    await product.save();
    results.push({ productName: item.productName, before, after: item.remainingStock });
  }


  await Order.findOneAndUpdate(
    { orderId },
    {
      orderId,
      storeId,
      items: items.map(i => ({ productName: i.productName })),
      status: 'fulfilled',
      timestamp: new Date()
    },
    { upsert: true, new: true }
  );

  logger.info('Inventory sync and order history update completed for store', {
    storeId,
    orderId,
    productsUpdated: results.length
  });

  return {
    status: 'synced',
    orderId,
    storeId,
    productsUpdated: results
  };
};
