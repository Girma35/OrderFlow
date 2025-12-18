import { EventConfig, ApiRouteConfig } from 'motia'


export const config: EventConfig = {
  name: 'paymentProcessingStep',
  type: 'event',
  description: 'Processes payment for received orders',
  subscribes: ['order.created'],
  emits: ['payment.processed', 'payment.failed'],
  flows: ['order-processing-flow']
};


export const reqSchema = {
  type: 'object',
  properties: {
    orderId: { type: 'string' },
    status: { type: 'string' },
    amount: { type: 'number' },
    transactionId: { type: 'string', format: 'date-time' }
  },
  required: ['orderId', 'status', 'amount', 'timestamp']
};

export const paymentResultSchema = {
  type: 'object',
  properties: {
    orderId: { type: 'string' },
    status: { type: 'string', enum: ['success', 'failed'] },
    amount: { type: 'number' },
    transactionId: { type: 'string' },
    reason: { type: 'string' },
    timestamp: { type: 'string', format: 'date-time' },
  },
  required: ['orderId', 'status', 'amount', 'transactionId'],
};


interface PaymentResult {
  orderId: string;
  status: 'paid' | 'failed';
  amount: number;
  transactionId: string;
  reason?: string;
  timestamp: string;
}



const apiConfig: ApiRouteConfig = {
  type: 'api',
  name: 'paymentProcessingApi',
  description: 'API endpoint for payment processing',
  path: 'http://localhost:4000/api/payment',
  method: 'GET',
  emits: ['payment.processed']
};



export const handler = async (input: any, { emit, logger, state }: any) => {
  const orderId = input.orderId;
  logger.info('Processing payment for order', { orderId });

  // Check if payment is already processed to prevent overcharging
  const paymentKey = `payment_${orderId}`;
  const existingPayment = await state.get(paymentKey);
  if (existingPayment && existingPayment.status === 'paid') {
    logger.info('Payment already processed, skipping', { orderId });
    return {
      orderId,
      status: 'already_paid',
      message: 'Payment was already successfully processed'
    };
  }

  const maxRetries = 3;
  let attempt = 0;
  let paymentResult: PaymentResult;

  // Retry logic for failed payments
  while (attempt < maxRetries) {
    attempt++;
    logger.info(`Payment attempt ${attempt}/${maxRetries} for order`, { orderId });

    // Simulate payment processing
    const status = Math.random() > 0.5 ? 'success' : 'failed';
    const transaction_id = Math.random().toString(36).substring(7);
    const orderId_sim = input.orderId;
    const paidAmount = input.totalAmount;
    const reason = status === 'failed' ? 'Insufficient funds' : undefined;

    logger.info('Simulated Payment API response', { status, transaction_id, orderId_sim, paidAmount, reason, attempt });

    if (status === 'success') {
      paymentResult = {
        orderId: orderId_sim,
        status: 'paid',
        amount: paidAmount,
        transactionId: transaction_id,
        timestamp: new Date().toISOString()
      };

      logger.info('Payment successful', { orderId: input.orderId });

      await emit({
        topic: 'payment.processed',
        data: {
          ...paymentResult,
          items: input.items
        }
      });

      logger.info('Payment completed event emitted', { paymentResult });
      await state.set(paymentKey, paymentResult, { ttl: 3600 }); // Store for 1 hour

      return paymentResult;
    } else {
      paymentResult = {
        orderId: orderId_sim,
        status: 'failed',
        amount: paidAmount,
        transactionId: transaction_id,
        reason: reason,
        timestamp: new Date().toISOString()
      };

      if (attempt < maxRetries) {
        logger.warn(`Payment attempt ${attempt} failed, retrying in 2 seconds`, { orderId, reason });
        // Wait 2 seconds before retry
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        logger.error(`Payment failed after ${maxRetries} attempts`, { orderId: input.orderId });
        await emit({
          topic: 'payment.failed',
          data: paymentResult
        });

        logger.info('Payment failed after all retries', { paymentResult });

        await state.set(paymentKey, paymentResult, { ttl: 3600 }); // Store for 1 hour
        throw new Error('Payment processing failed after all retries');
      }
    }
  }
};


