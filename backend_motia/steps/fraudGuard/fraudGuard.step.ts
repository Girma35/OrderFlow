import { EventConfig } from "motia";
import { connectDB } from '../../database/connection';
import { Order } from '../../database/models';

export const config: EventConfig = {
  name: 'fraudGuard',
  type: 'event',
  subscribes: ['payment.failed', 'fraud.check.requested', 'order.created'],
  emits: [
    'order.cleared',
    'order.flagged'
  ],
  flows: ['order-saga'],
};

interface FraudCheckData {
  orderId: string;
  customerName?: string;
  totalAmount?: number;
  items?: Array<{ productName: string; quantity: number }>;
  storeId?: string;
  timestamp?: string;
}

export const handler = async (event: any, { emit, logger, state }: any) => {
  const data: FraudCheckData = event.data || event;
  const { orderId, totalAmount = 0, customerName, items = [] } = data;

  logger.info('Fraud guard checking order', { orderId, totalAmount });

  await connectDB();

  // Fraud detection rules
  const fraudIndicators: string[] = [];

  // Rule 1: Check for unusually high order amount (> $10,000)
  if (totalAmount > 10000) {
    fraudIndicators.push('High order amount');
    logger.warn('High order amount detected', { orderId, totalAmount });
  }

  // Rule 2: Check for multiple failed payments for same customer
  if (event.topic === 'payment.failed') {
    const recentFailedOrders = await Order.countDocuments({
      customerName,
      status: 'failed',
      timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    });

    if (recentFailedOrders >= 3) {
      fraudIndicators.push('Multiple failed payments');
      logger.warn('Multiple failed payments detected', { orderId, customerName, recentFailedOrders });
    }
  }

  // Rule 3: Check for suspicious item quantities (bulk orders)
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  if (totalQuantity > 100) {
    fraudIndicators.push('Unusually high quantity');
    logger.warn('High quantity detected', { orderId, totalQuantity });
  }

  // Rule 4: Check for rapid successive orders from same customer
  if (customerName) {
    const recentOrders = await Order.countDocuments({
      customerName,
      timestamp: { $gte: new Date(Date.now() - 60 * 60 * 1000) } // Last hour
    });

    if (recentOrders >= 5) {
      fraudIndicators.push('Rapid successive orders');
      logger.warn('Rapid orders detected', { orderId, customerName, recentOrders });
    }
  }

  // Rule 5: Check order pattern (if payment failed, flag for review)
  if (event.topic === 'payment.failed' && totalAmount > 5000) {
    fraudIndicators.push('Failed high-value payment');
  }

  // Decision: Flag order if 2+ fraud indicators
  if (fraudIndicators.length >= 2) {
    logger.error('Order flagged for fraud', { orderId, fraudIndicators });

    await Order.findOneAndUpdate(
      { orderId },
      { status: 'flagged' },
      { upsert: false }
    );

    await emit({
      topic: 'order.flagged',
      data: {
        orderId,
        reason: fraudIndicators.join(', '),
        indicators: fraudIndicators,
        timestamp: new Date().toISOString()
      }
    });

    return {
      orderId,
      status: 'flagged',
      reason: fraudIndicators.join(', '),
      indicators: fraudIndicators
    };
  } else {
    logger.info('Order cleared by fraud guard', { orderId });

    await emit({
      topic: 'order.cleared',
      data: {
        orderId,
        timestamp: new Date().toISOString()
      }
    });

    return {
      orderId,
      status: 'cleared',
      indicators: fraudIndicators
    };
  }
};