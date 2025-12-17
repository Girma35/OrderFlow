import type { EventConfig } from 'motia';
import { z } from 'zod';

export const config: EventConfig = {
  name: 'orderFulfillmentStep',
  type: 'event',
  description: 'Fulfills orders after inventory update',
  subscribes: ['inventory.updated'],
  emits: ['order.completed', 'order.failed'],
  flows: ['order-fulfillment-flow']
};

const fulfillmentInputSchema = z.object({
  orderId: z.string()
});

export const handler = async (
  input: any,
  { emit, logger, state }: any
) => {
  const { orderId } = fulfillmentInputSchema.parse(input.data);

  logger.info('Starting order fulfillment process', { orderId });

  if (state.fulfillment?.status === 'fulfilled') {
    logger.warn('Order already fulfilled, skipping', { orderId });
    return {
      orderId,
      status: 'already_fulfilled'
    };
  }

  if (!state.inventory?.updatedItems?.length) {
    logger.warn('Order fulfillment blocked: inventory not updated', {
      inventory: state.inventory
    });
    throw new Error('Inventory not updated');
  }

  logger.info('Inventory verified, proceeding with order fulfillment', {
    orderId
  });

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
        timestamp: state.fulfillment.fulfilledAt
      }
    });

    logger.info('Order fulfillment completed', { orderId });

    return {
      orderId,
      status: 'fulfilled'
    };

  } catch (error: any) {
    logger.error('Order fulfillment failed', {
      orderId,
      error: error.message
    });

    await emit({
      topic: 'order.failed',
      data: {
        orderId,
        reason: error.message
      }
    });

    throw error;
  }
};
