import type { EventConfig } from 'motia';
import { z } from 'zod';

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

  // 1. Get data from Event (fast) or State (backup)
  const inventoryData = data.items || state.inventory?.updatedItems;

  logger.info('Starting order fulfillment process', { orderId });

  // 2. Check for double-fulfillment
  if (state.fulfillment?.status === 'fulfilled') {
    logger.warn('Order already fulfilled, skipping', { orderId });
    return { orderId, status: 'already_fulfilled' };
  }

  // 3. Use inventoryData (DO NOT check state.inventory separately)
  if (!inventoryData || inventoryData.length === 0) {
    logger.warn('Order fulfillment blocked: no inventory data found', { orderId });
    throw new Error('Inventory data missing');
  }

  logger.info('Inventory verified, proceeding with order fulfillment', { orderId });

  try {
    state.fulfillment = {
      status: 'fulfilled',
      fulfilledAt: new Date().toISOString()
    };

    await emit({
      topic: 'order.completed',
      data: {
        orderId,
        status: 'fulfilled',
        timestamp: state.fulfillment.fulfilledAt,
        items: inventoryData
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