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
    const response = await axios.get('http://localhost:3000/api/alerts', {
        headers: { 'x-store-id': storeId }
    });
    return (response.data as any).alerts || [];
};

export const fetchDashboardStats = async () => {
    // This will eventually call a backend endpoint
    // For now returning mock data to build the UI
    return {
        totalOrders: 128,
        activeAlerts: 3,
        revenue: 45290.50,
        fulfillmentRate: 98.2,
        recentOrders: [
            { id: 'ORD-001', customer: 'John Doe', amount: 250.00, status: 'completed', time: '2 mins ago' },
            { id: 'ORD-002', customer: 'Jane Smith', amount: 120.50, status: 'pending', time: '15 mins ago' },
            { id: 'ORD-003', customer: 'Alice Brown', amount: 89.00, status: 'processing', time: '45 mins ago' },
            { id: 'ORD-004', customer: 'Bob Johnson', amount: 450.00, status: 'failed', time: '1 hour ago' },
        ]
    };
};
export const fetchOrderTracking = async (orderId: string, storeId: string = 'X') => {
    try {
        const response = await axios.get(`http://localhost:3000/api/state/public/data/${storeId}/tracking/${orderId}`, {
            headers: { 'x-store-id': storeId }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch tracking:', error);
        return null;
    }
};
