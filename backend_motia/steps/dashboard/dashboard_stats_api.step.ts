import type { ApiRouteConfig, ApiMiddleware } from 'motia';
import { z } from 'zod';
import { connectDB } from '../../database/connection';
import { Order, Notification, Product } from '../../database/models';

const authMiddleware: ApiMiddleware = async (req, { logger }, next) => {
  const storeIdRaw = req.headers['x-store-id'];
  const storeId = Array.isArray(storeIdRaw) ? storeIdRaw[0] : storeIdRaw;
  if (!storeId || !['X', 'Y', 'Z'].includes(storeId)) {
    logger.error('Missing or invalid X-Store-ID header');
    return { status: 400, body: { message: 'Invalid X-Store-ID', status: 'error' } };
  }

  (req as any).context = { ...(req as any).context, storeId };
  logger.info(`Dashboard stats request for store: ${storeId}`);
  return next();
};

export const config: ApiRouteConfig = {
  name: 'dashboardStatsAPI',
  type: 'api',
  path: '/api/dashboard/stats',
  method: 'GET',
  middleware: [authMiddleware],
  description: 'Returns dashboard statistics for the store',
  emits: [],
  flows: [],
  responseSchema: {
    200: z.object({
      totalOrders: z.number(),
      revenue: z.number(),
      activeAlerts: z.number(),
      fulfillmentRate: z.number(),
      recentOrders: z.array(z.object({
        id: z.string(),
        customer: z.string(),
        amount: z.number(),
        status: z.string(),
        time: z.string()
      }))
    })
  }
};

export const handler = async (req: any, { logger, state }: any) => {
  try {
    const storeIdRaw = req.headers['x-store-id'];
    const storeId = Array.isArray(storeIdRaw) ? storeIdRaw[0] : storeIdRaw;
    
    if (!storeId || !['X', 'Y', 'Z'].includes(storeId)) {
      return {
        status: 400,
        body: { message: 'Missing or invalid X-Store-ID header', status: 'error' }
      };
    }

    // Check cache first (10 second TTL for dashboard stats)
    const cacheKey = `dashboard_stats_cache_${storeId}`;
    const cached = await state.get(cacheKey);
    if (cached && cached.timestamp && (Date.now() - cached.timestamp < 10000)) {
      logger.info('Dashboard stats fetched from cache', { storeId });
      return {
        status: 200,
        body: cached.data
      };
    }

    await connectDB();

    // Calculate stats for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Total orders (last 7 days)
    const totalOrders = await Order.countDocuments({
      storeId,
      timestamp: { $gte: sevenDaysAgo }
    });

    // Total revenue (last 7 days) - only paid/fulfilled orders
    const revenueResult = await Order.aggregate([
      {
        $match: {
          storeId,
          status: { $in: ['paid', 'fulfilled', 'shipped', 'delivered'] },
          timestamp: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    const revenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Active alerts (unread notifications)
    const activeAlerts = await Notification.countDocuments({
      storeId,
      read: false
    });

    // Fulfillment rate (last 7 days)
    const fulfilledOrders = await Order.countDocuments({
      storeId,
      status: { $in: ['fulfilled', 'shipped', 'delivered'] },
      timestamp: { $gte: sevenDaysAgo }
    });

    const fulfillmentRate = totalOrders > 0 
      ? Math.round((fulfilledOrders / totalOrders) * 100 * 10) / 10 
      : 100;

    // Fetch ALL orders (no limit) for the dashboard
    const allOrdersData = await Order.find({ storeId })
      .sort({ timestamp: -1 })
      .select('orderId customerName totalAmount status timestamp')
      .lean();

    const recentOrders = allOrdersData.map(order => {
      const timeDiff = Date.now() - new Date(order.timestamp).getTime();
      const minutes = Math.floor(timeDiff / 60000);
      const hours = Math.floor(minutes / 60);
      
      let timeStr = '';
      if (minutes < 1) {
        timeStr = 'Just now';
      } else if (minutes < 60) {
        timeStr = `${minutes} ${minutes === 1 ? 'min' : 'mins'} ago`;
      } else if (hours < 24) {
        timeStr = `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
      } else {
        const days = Math.floor(hours / 24);
        timeStr = `${days} ${days === 1 ? 'day' : 'days'} ago`;
      }

      return {
        id: order.orderId.substring(0, 8).toUpperCase(),
        customer: order.customerName,
        amount: order.totalAmount,
        status: order.status === 'delivered' ? 'completed' : 
                order.status === 'failed' ? 'failed' : 
                order.status === 'pending' ? 'pending' : 'processing',
        time: timeStr
      };
    });

    const statsData = {
      totalOrders,
      revenue: Math.round(revenue * 100) / 100,
      activeAlerts,
      fulfillmentRate,
      recentOrders
    };

    // Cache the results
    await state.set(cacheKey, {
      data: statsData,
      timestamp: Date.now()
    }, { ttl: 15 });

    logger.info('Dashboard stats calculated', { storeId, totalOrders, revenue, activeAlerts, fulfillmentRate });

    return {
      status: 200,
      body: statsData
    };
  } catch (error: any) {
    logger.error('Error calculating dashboard stats', { error: error.message });
    return {
      status: 500,
      body: {
        message: 'Internal server error',
        status: 'error'
      }
    };
  }
};



