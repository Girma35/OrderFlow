import { EventConfig,ApiRouteConfig } from 'motia'


export const config: EventConfig = {
    name: 'paymentProcessingStep',
    type: 'event',
    description: 'Processes payment for received orders',
    subscribes: ['order.created'],
    emits: ['payment.processed', 'payment.failed'],
    flows: ['payment-processing-flow']
};


export const reqSchema = {
    type: 'object',
    properties: {
        orderId: { type: 'integer' },
        status: { type: 'string' },
        amount: { type: 'number' },
        transactionId: { type: 'string', format: 'date-time' }
    },
    required: ['orderId', 'status', 'amount', 'timestamp']
};

export const paymentResultSchema = {
  type: 'object',
  properties: {
    order_id: { type: 'number' },
    status: { type: 'string', enum: ['success', 'failed'] },
    amount: { type: 'number' },
    transaction_id: { type: 'string' },
    reason: { type: 'string' }, 
    timestamp: { type: 'string', format: 'date-time' }, 
  },
  required: ['order_id', 'status', 'amount', 'transaction_id'],
};


interface PaymentResult {
  orderId: number;
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
      const orderId = input.data.orderId;
      logger.info('Processing payment for order', { orderId });


    const response = await fetch(apiConfig.path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ req:reqSchema }),
    });
     const data = await response.json();
    logger.info('Payment API response', { data });


    const { status, transaction_id, order_id, amount: paidAmount, reason } = data;

let paymentResult: PaymentResult;

    if (status === 'success') {
        paymentResult = {
            orderId: order_id,
            status: 'paid',
            amount: paidAmount,
            transactionId: transaction_id,
            timestamp: new Date().toISOString()
        };
    } else {
        paymentResult = {
            orderId: order_id,
            status: 'failed',
            amount: paidAmount,
            transactionId: transaction_id,
            reason: reason,
            timestamp: new Date().toISOString()
        };
    }



    if (paymentResult.status !== 'paid') {
        logger.error('Payment failed', { orderId: input.data.orderId });
        await emit({
        topic: 'payment.failed',
        data: paymentResult
    });

    logger.info('Payment failed', { paymentResult });

    throw new Error('Payment processing failed');

    }   


    if (paymentResult.status === 'paid') {
    logger.info('Payment successful', { orderId: input.data.orderId });

  await emit({
        topic: 'payment.completed',
        data: paymentResult
    });       

    logger.info('Payment completed event emitted', { paymentResult });
}

state.paymentStatus = paymentResult.status;

 return paymentResult;
};


