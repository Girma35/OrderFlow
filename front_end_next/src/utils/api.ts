import axios from 'axios';

export const generateUUID = () =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });

export const submitOrder = async (payload: any) => {
    try {
        const response = await axios.post(
            'http://localhost:3000/api/order',
            payload,
            { headers: { 'Content-Type': 'application/json', 'x-store-id': payload.storeId || 'X' } }
        );

        return {
            success: true,
            orderId: payload.orderId,
            data: response.data,
        };
    } catch (error) {
        console.error('Order submission failed:', error);
        return { success: false };
    }
};

export const fetchAlerts = async (storeId: string = 'X') => {
    try {
        const response = await axios.get('http://localhost:3000/api/alerts', {
            headers: { 'x-store-id': storeId }
        });
        return (response.data as any).alerts || [];
    } catch (error) {
        console.error('Failed to fetch alerts:', error);
        return [];
    }
};

export const fetchDashboardStats = async (storeId: string = 'X') => {
    try {
        const response = await axios.get('http://localhost:3000/api/dashboard/stats', {
            headers: { 'x-store-id': storeId }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        // Fallback to mock data if API fails (for demo purposes)
        return {
            totalOrders: 0,
            activeAlerts: 0,
            revenue: 0,
            fulfillmentRate: 100,
            recentOrders: []
        };
    }
};

export const fetchOrderTracking = async (orderId: string, storeId: string = 'X') => {
    try {
        // Ensure orderId is properly encoded in URL
        const encodedOrderId = encodeURIComponent(orderId);
        const response = await axios.get(`http://localhost:3000/api/order/tracking/${encodedOrderId}`, {
            headers: { 'x-store-id': storeId }
        });
        // Motia API returns { status, body } structure
        if (response.data && response.data.body) {
            return response.data.body;
        }
        return response.data;
    } catch (error: any) {
        console.error('Failed to fetch tracking:', error);
        // Return initial state if order not found yet
        if (error.response?.status === 404) {
            return {
                orderId,
                status: 'pending',
                history: [
                    { status: 'ORDER_CREATED', timestamp: new Date().toISOString() }
                ]
            };
        }
        return null;
    }
};
