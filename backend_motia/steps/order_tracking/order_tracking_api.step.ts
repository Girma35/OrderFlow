import type { ApiRouteConfig, ApiMiddleware } from 'motia';
import { z } from 'zod';
import { connectDB } from '../../database/connection';
import { Order } from '../../database/models';

const authMiddleware: ApiMiddleware = async (req, { logger }, next) => {
  const storeIdRaw = req.headers['x-store-id'];
  const storeId = Array.isArray(storeIdRaw) ? storeIdRaw[0] : storeIdRaw;
  if (!storeId || !['X', 'Y', 'Z'].includes(storeId)) {
    logger.error('Missing or invalid X-Store-ID header');
    return { status: 400, body: { message: 'Invalid X-Store-ID', status: 'error' } };
  }

  (req as any).context = { ...(req as any).context, storeId };
  logger.info(`Order tracking request for store: ${storeId}`);
  return next();
};

export const config: ApiRouteConfig = {
  name: 'orderTrackingAPI',
  type: 'api',
  path: '/api/order/tracking/:orderId',
  method: 'GET',
  middleware: [authMiddleware],
  description: 'Returns order tracking information',
  emits: [],
  flows: [],
  responseSchema: {
    200: z.object({
      orderId: z.string(),
      status: z.string(),
      trackingNumber: z.string().optional(),
      history: z.array(z.object({
        status: z.string(),
        timestamp: z.string()
      })).optional()
    }),
    404: z.object({
      message: z.string(),
      status: z.string()
    })
  }
};

export const handler = async (req: any, { logger, state }: any) => {
  try {
    const storeIdRaw = req.headers['x-store-id'];
    const storeId = Array.isArray(storeIdRaw) ? storeIdRaw[0] : storeIdRaw;
    
    // Extract orderId from pathParams (Motia API format)
    let orderId = req.pathParams?.orderId || req.params?.orderId;
    
    // Fallback: extract from URL if pathParams not available
    if (!orderId && req.url) {
      const match = req.url.match(/\/tracking\/([^\/\?]+)/);
      orderId = match ? match[1] : null;
    }
    
    logger.info('Order tracking request', { orderId, storeId, pathParams: req.pathParams, url: req.url });

    if (!storeId || !['X', 'Y', 'Z'].includes(storeId)) {
      return {
        status: 400,
        body: { message: 'Missing or invalid X-Store-ID header', status: 'error' }
      };
    }

    if (!orderId) {
      logger.error('Order ID not found in request', { url: req.url, params: req.params });
      return {
        status: 400,
        body: { message: 'Order ID is required', status: 'error' }
      };
    }

    // Try to get from Motia State first (faster, real-time) - no DB needed
    const stateKey = `public/data/${storeId}/tracking/${orderId}`;
    const stateData = await state.get(stateKey);

    if (stateData && stateData.history && stateData.history.length > 0) {
      logger.info('Order tracking found in state', { orderId, storeId });
      return {
        status: 200,
        body: {
          orderId,
          status: stateData.status || 'pending',
          trackingNumber: stateData.trackingNumber,
          history: stateData.history || []
        }
      };
    }

    // Fallback to MongoDB only if not in state
    await connectDB();
    const order = await Order.findOne({ orderId, storeId }).lean();

    if (!order) {
      logger.warn('Order not found', { orderId, storeId });
      return {
        status: 404,
        body: {
          message: 'Order not found',
          status: 'error'
        }
      };
    }

    // Build history from order status
    const history = [
      { status: 'ORDER_CREATED', timestamp: order.timestamp.toISOString() }
    ];

    if (order.status === 'paid' || order.status === 'fulfilled' || order.status === 'shipped' || order.status === 'delivered') {
      history.push({ status: 'PAYMENT_RECEIVED', timestamp: order.timestamp.toISOString() });
    }

    if (order.status === 'fulfilled' || order.status === 'shipped' || order.status === 'delivered') {
      history.push({ status: 'INVENTORY_RESERVED', timestamp: order.timestamp.toISOString() });
    }

    if (order.status === 'shipped' || order.status === 'delivered') {
      history.push({ status: 'SHIPPED', timestamp: order.timestamp.toISOString() });
    }

    if (order.status === 'delivered') {
      history.push({ status: 'DELIVERED', timestamp: order.timestamp.toISOString() });
    }

    logger.info('Order tracking fetched from DB', { orderId, storeId, status: order.status });

    return {
      status: 200,
      body: {
        orderId: order.orderId,
        status: order.status,
        trackingNumber: order.trackingNumber,
        history
      }
    };
  } catch (error: any) {
    logger.error('Error fetching order tracking', { error: error.message });
    return {
      status: 500,
      body: {
        message: 'Internal server error',
        status: 'error'
      }
    };
  }
};



