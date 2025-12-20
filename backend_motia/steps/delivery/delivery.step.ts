import { z } from 'zod';
import type { EventConfig } from 'motia';
import { connectDB } from '../../database/connection';
import { Order } from '../../database/models';
export const config: EventConfig = {
    name: 'orderDeliveryStep',
    type: 'event',
    description: 'Triggers the delivery pipeline and tracks shipping',
    subscribes: ['delivery.shipped', 'delivery.delivered'],
    emits: [
        'delivery.shipped', 
        'delivery.delivered'
    ],
    flows: ['order-processing-flow']
};

const deliveryInputSchema = z.object({
    orderId: z.string().uuid(),
    storeId: z.string().optional()
});

export const handler = async (
    input: any,
    { emit, logger, state }: any
) => {
    const data = input.data || input;
    const { orderId } = deliveryInputSchema.parse(data);
    const storeId = data.storeId || 'X';

    logger.info('Order delivery pipeline triggered', { orderId, storeId });

    await connectDB();

    await new Promise(resolve => setTimeout(resolve, 2000));

    const shippingInfo = {
        status: 'shipped',
        trackingNumber: `MOT-${Math.random().toString(36).substring(7).toUpperCase()}`,
        shippedAt: new Date().toISOString(),
        carrier: 'Motia Express'
    };

    await Order.findOneAndUpdate(
        { orderId },
        {
            status: 'shipped',
            trackingNumber: shippingInfo.trackingNumber
        }
    );

    await state.set(`public/data/${storeId}/tracking/${orderId}`, {
        ...shippingInfo,
        history: [
            { status: 'PAYMENT_RECEIVED', timestamp: new Date(Date.now() - 5000).toISOString() },
            { status: 'INVENTORY_RESERVED', timestamp: new Date(Date.now() - 3000).toISOString() },
            { status: 'SHIPPED', timestamp: shippingInfo.shippedAt }
        ]
    }, { ttl: 3600 });

    await emit({
        topic: 'delivery.shipped',
        data: { orderId, storeId, ...shippingInfo }
    });

    logger.info('Order marked as shipped in DB', { orderId, trackingNumber: shippingInfo.trackingNumber });

    setTimeout(async () => {
        const deliveryTime = new Date().toISOString();

        await connectDB();
        await Order.findOneAndUpdate({ orderId }, { status: 'delivered' });

        const currentTracking = await state.get(`public/data/${storeId}/tracking/${orderId}`);

        if (currentTracking) {
            await state.set(`public/data/${storeId}/tracking/${orderId}`, {
                ...currentTracking,
                status: 'delivered',
                deliveredAt: deliveryTime,
                history: [
                    ...currentTracking.history,
                    { status: 'DELIVERED', timestamp: deliveryTime }
                ]
            }, { ttl: 3600 });

            await emit({
                topic: 'delivery.delivered',
                data: { orderId, storeId, status: 'delivered', timestamp: deliveryTime }
            });

            logger.info('Order marked as delivered in DB', { orderId });
        }
    }, 10000);

    return { orderId, status: 'pipeline_triggered' };
};
