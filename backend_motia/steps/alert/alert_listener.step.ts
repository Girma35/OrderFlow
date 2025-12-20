import { connectDB } from '../../database/connection';
import { Notification } from '../../database/models';
import type { EventConfig } from 'motia';
import { z } from 'zod';

export const config: EventConfig = {
    name: 'alertListener',
    type: 'event',
    description: 'Listens for system events and creates notifications',
    subscribes: [
        'inventory.threshold_reached',
        'order.completed',
        'payment.failed',
        'inventory.failed',
    ],
    emits: [],
    flows: ['order-processing-flow', 'order-saga']
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

    switch (resolvedTopic) {
        case 'payment.failed':
            notification = {
                type: 'error',
                title: 'Payment Failed',
                message: `Payment for order ${data.orderId} failed. ${data.reason || ''}`
            };
            break;
        case 'payment.processed':
            notification = {
                type: 'success',
                title: 'Payment Received',
                message: `Payment for order ${data.orderId} was successful.`
            };
            break;
        case 'inventory.failed':
            notification = {
                type: 'error',
                title: 'Inventory Error',
                message: `Could not update inventory for order ${data.orderId}.`
            };
            break;
        case 'inventory.threshold_reached':
            notification = {
                type: 'warning',
                title: 'Low Inventory',
                message: `${data.productName || data.productId || 'Product'} is below threshold in store ${data.storeId}`
            };
            break;
        case 'order.created':
            notification = {
                type: 'info',
                title: 'Order Created',
                message: `New order ${data.orderId} has been placed.`
            };
            break;
        case 'order.completed':
            notification = {
                type: 'success',
                title: 'Order Fulfilled',
                message: `Order ${data.orderId} has been fulfilled successfully.`
            };
            break;
        default:
            if (logger.debug) {
                logger.debug('No notification template for topic', { topic: resolvedTopic });
            }
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
