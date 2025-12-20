import type { ApiRouteConfig, ApiMiddleware } from 'motia';
import { z } from 'zod';
import { connectDB } from '../../database/connection';
import { Order } from '../../database/models';

const orderSubmissionSchema = z.object({
  orderId: z.string().uuid(),
  customerName: z.string().min(1),
  items: z.array(
    z.object({
      productName: z.string().min(1),
      quantity: z.number().min(1)
    })
  ),
  totalAmount: z.number().min(0)
});

const authMiddleware: ApiMiddleware = async (req, { logger }, next) => {
  const storeIdRaw = req.headers['x-store-id'];
  const storeId = Array.isArray(storeIdRaw) ? storeIdRaw[0] : storeIdRaw;
  if (!storeId || !['X', 'Y', 'Z'].includes(storeId)) {
    logger.error('Missing or invalid X-Store-ID header');
    return { status: 400, body: { message: 'Invalid X-Store-ID', status: 'error' } };
  }

  (req as any).context = { ...(req as any).context, storeId };
  logger.info(`Authenticated request for store: ${storeId}`);
  return next();
};


export const config: ApiRouteConfig = {
  name: 'orderSubmissionAPI',
  type: 'api',
  path: '/api/order',
  method: 'POST',
  middleware: [authMiddleware],
  description: 'Receives  request and emits event',
  emits: ['order.created'],
  flows: ['order-processing-flow'],
  responseSchema: {
    200: z.object({
      message: z.string(),
      status: z.string(),
      appName: z.string()
    })
  }
};


export const handler = async (req: any, { emit, logger, state, auth }: any) => {
  try {
    logger.info('Received order submission request', { body: req.body });

    const storeIdRaw = req.headers['x-store-id'];
    const storeId = Array.isArray(storeIdRaw) ? storeIdRaw[0] : storeIdRaw;
    if (!storeId || !['X', 'Y', 'Z'].includes(storeId)) {
      logger.error('Missing or invalid X-Store-ID header');
      return {
        status: 400,
        body: {
          message: 'Missing or invalid X-Store-ID header',
          status: 'error'
        }
      };
    }

    const jobId = Math.random().toString(36).substring(7);




    const result = orderSubmissionSchema.safeParse(req.body);
    if (!result.success) {
      logger.error('Invalid request body', { errors: result.error });
      return {
        status: 400,
        body: {
          message: 'Invalid request body',
          status: 'error'
        }
      };
    }


    const appName = state?.appName || 'UnknownApp';
    const timestamp = new Date().toISOString();
    const order = result.data;

    // Check if order already exists (idempotency check)
    await connectDB();
    const existingOrder = await Order.findOne({ orderId: order.orderId, storeId });
    
    if (existingOrder) {
      logger.warn('Order already exists, returning existing order', { orderId: order.orderId });
      return {
        status: 200,
        body: {
          success: true,
          message: 'Order already exists',
          status: 'success',
          appName: "Order already processed",
        }
      };
    }

    // Save to MongoDB
    await Order.create({
      orderId: order.orderId,
      customerName: order.customerName,
      items: order.items,
      totalAmount: order.totalAmount,
      status: 'pending',
      storeId,
      timestamp: new Date()
    });

    // Also save to Motia State for quick access
    await state.set(
      `public/data/${storeId}/orders/${order.orderId}`,
      {
        status: 'pending',
        ...order,
        timestamp: new Date().toISOString()
      },
      { ttl: 60 }
    );

    // Initialize tracking state for immediate access
    await state.set(
      `public/data/${storeId}/tracking/${order.orderId}`,
      {
        orderId: order.orderId,
        status: 'pending',
        history: [
          { status: 'ORDER_CREATED', timestamp: new Date().toISOString() }
        ]
      },
      { ttl: 3600 }
    );

    logger.info('Order saved to MongoDB and state updated', { orderId: order.orderId });

    await emit({
      topic: 'order.created',
      data: {
        orderId: order.orderId,
        customerName: order.customerName,
        items: order.items,
        totalAmount: order.totalAmount,
        timestamp,
        appName,
        storeId,
        requestId: Math.random().toString(36).substring(7)
      }
    });

    return {
      status: 200,
      body: {
        success: true,
        message: 'Order received successfully',
        status: 'success',
        appName: " event emitted",
      }
    };
  } catch (error) {
    logger.error('Error processing order submission', { error });
    return {
      status: 500,
      body: {
        message: 'Internal server error',
        status: 'error'
      }
    };
  }

};
