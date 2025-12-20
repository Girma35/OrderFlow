import { connectDB } from '../../database/connection';
import { Notification } from '../../database/models';
import type { EventConfig } from 'motia';
import { z } from 'zod';

export const config: EventConfig = {
    name: 'alertListener',
    type: 'event',
    description: 'Listens for critical events and creates alerts: order creation, inventory threshold, payment failures',
    subscribes: [
        'order.created',           // Alert for new orders
        'inventory.threshold_reached',  // Alert for low inventory
        'payment.failed',          // Alert for payment failures
    ],
    emits: [],
    flows: ['order-processing-flow', 'inventory-management-flow']
};

const baseNotificationSchema = z.object({
    orderId: z.string().optional(),
    storeId: z.string().optional(),
    productId: z.string().optional(),
    productName: z.string().optional(),
    reason: z.string().optional(),
    currentStock: z.number().optional(),
    threshold: z.number().optional()
}).passthrough();

export const handler = async (event: any, { logger, state, topic }: any) => {
    const data = baseNotificationSchema.parse(event?.data ?? event ?? {});
    const resolvedTopic = topic || event?.topic;

    logger.info('Processing event for notification', { topic: resolvedTopic, data });

    let notification: any = null;

    // Only handle the 3 critical alert types
    switch (resolvedTopic) {
        case 'order.created':
            notification = {
                type: 'info',
                title: 'New Order Created',
                message: `Order ${data.orderId} has been placed${data.storeId ? ` in store ${data.storeId}` : ''}.`
            };
            break;
            
        case 'inventory.threshold_reached':
            notification = {
                type: 'warning',
                title: 'Low Inventory Alert',
                message: `${data.productName || data.productId || 'Product'} is below threshold (${data.currentStock || 'N/A'} remaining, threshold: ${data.threshold || 'N/A'}) in store ${data.storeId || 'Unknown'}`
            };
            break;
            
        case 'payment.failed':
            notification = {
                type: 'error',
                title: 'Payment Failed',
                message: `Payment for order ${data.orderId} failed${data.reason ? `: ${data.reason}` : ''}.`
            };
            break;
            
        default:
            // Ignore other events - we only want these 3 alert types
            logger.debug('Event not handled by alert listener', { topic: resolvedTopic });
            return null;
    }

    if (!notification) {
        return null;
    }

    notification.id = Math.random().toString(36).substring(7);
    notification.timestamp = new Date().toISOString();
    notification.read = false;
    notification.orderId = data.orderId;

    const storeId = data.storeId || 'X';

    await connectDB();

    await Notification.create({
        notificationId: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        storeId,
        orderId: notification.orderId,
        timestamp: new Date(notification.timestamp)
    });

    const notificationKey = `public/notifications/${storeId}`;
    const existing = await state.get(notificationKey) || [];
    const updated = [notification, ...existing].slice(0, 10);

    await state.set(notificationKey, updated, { ttl: 3600 });
    logger.info('Notification saved to MongoDB and state', { notification });

    return notification;
};
