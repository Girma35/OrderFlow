import { z } from 'zod';
import type { EventConfig } from 'motia';
import { connectDB } from '../../database/connection';
import { Order, Product } from '../../database/models';

const inventoryUpdateSchema = z.object({
  productName: z.string(),
  quantity: z.number().int().min(1)
});

const inventoryUpdateEventSchema = z.object({
  orderId: z.string().uuid(),
  items: z.array(inventoryUpdateSchema)
});

export const config: EventConfig = {
  name: 'inventoryUpdateStep',
  type: 'event',
  description: 'Updates inventory after successful payment',
  subscribes: ['payment.processed', 'payment.completed'],
  emits: ['inventory.updated', 'inventory.failed'],
  flows: ['order-processing-flow']
};

export const handler = async (
  input: any,
  { emit, logger, state }: any
) => {
  const data = input.data || input;

  // Validate and parse input data
  const { orderId, items } = inventoryUpdateEventSchema.parse(data);

  if (!orderId) {
    logger.error('Order ID missing in inventory update', { input });
    throw new Error('Order ID is required for inventory update');
  }

  // Idempotency check - prevent duplicate inventory updates
  const inventoryKey = `inventory_updated_${orderId}`;
  const alreadyUpdated = await state.get(inventoryKey);
  if (alreadyUpdated) {
    logger.info('Inventory already updated for this order, skipping', { orderId });
    return {
      status: 'already_updated',
      inventory: alreadyUpdated.items
    };
  }

  // Check payment status from the event data, not global state
  if (!(data.status === 'paid')) {
    logger.warn('Inventory update blocked: payment not completed', {
      paymentStatus: data.status,
      orderId: orderId
    });
    throw new Error('Payment not completed');
  }

  // Validate items exist
  if (!items || items.length === 0) {
    logger.error('Inventory update failed: No items found in event data');
    throw new Error('Missing items in payment event');
  }

  logger.info('Payment verified, proceeding with inventory update', {
    orderId
  });

  await connectDB();

  const updatedItems: {
    productName: string;
    remainingStock: number;
  }[] = [];


  try {
    for (const item of items) {
      const product = await Product.findOneAndUpdate(
        { productName: item.productName, storeId: data.storeId },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );

      if (!product) {
        throw new Error(`Product ${item.productName} not found in store ${data.storeId}`);
      }

      if (product.stock < 0) {
        // Rollback (simple)
        await Product.findOneAndUpdate(
          { productName: item.productName, storeId: data.storeId },
          { $inc: { stock: item.quantity } }
        );
        throw new Error(`Insufficient stock for ${item.productName}`);
      }

      updatedItems.push({
        productName: item.productName,
        remainingStock: product.stock
      });
    }

    // Update Order Status to show inventory is cleared
    await Order.findOneAndUpdate({ orderId }, { status: 'fulfilled' });

    // Mark inventory as updated (idempotency)
    await state.set(inventoryKey, {
      orderId,
      items: updatedItems,
      updatedAt: new Date().toISOString()
    }, { ttl: 3600 });

    // Update tracking state
    const trackingKey = `public/data/${data.storeId}/tracking/${orderId}`;
    const currentTracking = await state.get(trackingKey) || {
      orderId,
      status: 'pending',
      history: []
    };
    
    await state.set(trackingKey, {
      ...currentTracking,
      status: 'fulfilled',
      history: [
        ...(currentTracking.history || []),
        { status: 'INVENTORY_RESERVED', timestamp: new Date().toISOString() }
      ]
    }, { ttl: 3600 });

  } catch (error: any) {
    logger.error('Inventory update failed', {
      error: error.message
    });

    await emit({
      topic: 'inventory.failed',
      data: {
        orderId,
        reason: error.message
      }
    });

    throw error;
  }

  state.inventory = {
    updatedItems,
    updatedAt: new Date().toISOString()
  };

  await emit({
    topic: 'inventory.updated',
    data: {
      orderId,
      status: 'inventory_success',
      items: updatedItems,
      storeId: data.storeId
    }
  });

  logger.info('Inventory updated successfully', {
    orderId
  });

  return {
    status: 'fulfilled',
    inventory: updatedItems
  };
};
