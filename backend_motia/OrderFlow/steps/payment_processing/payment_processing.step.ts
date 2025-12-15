import { EventConfig } from 'motia'

export const config: EventConfig = {
    name: 'paymentProcessingStep',
    type: 'event',
    description: 'Processes payment for received orders',
    subscribes: ['order.created'],
    emits: ['payment.processed'],
    flows: ['payment-processing-flow']
};


export const handler = async (input: any, { emit, logger, state }: any) => {
    logger.info('Processing payment for order', { orderId: input.data.orderId });
    // Simulate payment processing logic
    const paymentResult = {
        orderId: input.data.orderId,
        status: 'paid',
        amount: input.data.totalAmount,
        timestamp: new Date().toISOString()
    };

    await emit({
        topic: 'payment.processed',
        data: paymentResult
    });

    logger.info('Payment processed', { paymentResult });
};


