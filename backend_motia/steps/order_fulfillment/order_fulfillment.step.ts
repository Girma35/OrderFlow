import { z } from 'zod';
import { EventConfig } from 'motia';

export const config: EventConfig = {
  name: 'orderFulfillmentStep',
  type: 'event',
  description: 'Fulfills orders after inventory update',
  subscribes: ['inventory.updated'],
  emits: ['order.completed', 'order.failed'],
  flows: ['order-processing-flow']
};

const fulfillmentInputSchema = z.object({
  orderId: z.string().uuid()
});

export const handler = async (
  input: any,
  { emit, logger, state }: any
) => {
  const data = input.data || input;
  const { orderId } = fulfillmentInputSchema.parse(data);

  if (!orderId) {
    logger.error('Order ID missing in fulfillment', { input });
    throw new Error('Order ID is required for fulfillment');
  }

  // Idempotency check
  const fulfillmentKey = `fulfillment_${orderId}`;
  const existingFulfillment = await state.get(fulfillmentKey);
  if (existingFulfillment && existingFulfillment.status === 'fulfilled') {
    logger.warn('Order already fulfilled, skipping', { orderId });
    return { orderId, status: 'already_fulfilled' };
  }

  const inventoryData = data.items || state.inventory?.updatedItems;

  logger.info('Starting order fulfillment process', { orderId });

  if (!inventoryData || inventoryData.length === 0) {
    logger.warn('Order fulfillment blocked: no inventory data found', { orderId });
    throw new Error('Inventory data missing');
  }

  logger.info('Inventory verified, proceeding with order fulfillment', { orderId });



  try {
    const fulfillmentData = {
      status: 'fulfilled',
      fulfilledAt: new Date().toISOString()
    };

    // Mark as fulfilled (idempotency)
    await state.set(fulfillmentKey, fulfillmentData, { ttl: 3600 });
   
    await emit({
      topic: 'order.completed',
      data: {
        orderId,
        status: 'fulfilled',
        timestamp: fulfillmentData.fulfilledAt,
        items: inventoryData,
        storeId: data.storeId
      }
    });

    logger.info('Order fulfillment completed', { orderId });

    return { orderId, status: 'fulfilled' };
  } catch (error: any) {
    logger.error('Order fulfillment failed', { orderId, error: error.message });
    await emit({
      topic: 'order.failed',
      data: { orderId, reason: error.message }
    });
    throw error;
  }
};