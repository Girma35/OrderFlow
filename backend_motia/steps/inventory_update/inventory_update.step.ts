import type { EventConfig } from 'motia';
import { z } from 'zod';
import { decreaseStock } from '../../invetory/inventory.service';


const inventoryUpdateSchema = z.object({
  productId: z.string(),
  productName: z.string(), 
  quantity: z.number().int().min(1)
});

export const config: EventConfig = {
  name: 'inventoryUpdateStep',
  type: 'event',
  description: 'Updates inventory after successful payment',
  subscribes: ['payment.completed'],
  emits: ['inventory.updated', 'inventory.failed'],
  flows: ['payment-processing-flow']
};

export const handler = async (
  input: any,
  { emit, logger, state }: any
) => {

  if (!state.payment || state.payment.status !== 'paid') {
    logger.warn('Inventory update blocked: payment not completed', {
      payment: state.payment
    });
    throw new Error('Payment not completed');
  }

  logger.info('Payment verified, proceeding with inventory update', {
    orderId: input.data.orderId
  });

  const items = z.array(inventoryUpdateSchema).parse(input.data.items);

  const updatedItems: {
    productId: string;
    productName: string;
    remainingStock: number;
  }[] = [];

  try {
    for (const item of items) {
      const remainingStock = await decreaseStock(
        item.productName,
        item.quantity
      );

      updatedItems.push({
        productId: item.productId,
        productName: item.productName,
        remainingStock
      });
    }
  } catch (error: any) {
    logger.error('Inventory update failed', {
      error: error.message
    });

    await emit({
      topic: 'inventory.failed',
      data: {
        orderId: input.data.orderId,
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
      orderId: input.data.orderId,
      items: updatedItems
    }
  });

  logger.info('Order fulfilled successfully', {
    orderId: input.data.orderId
  });

  return {
    status: 'fulfilled',
    inventory: updatedItems
  };
};
