// Shared type definitions for the Motia frontend

export interface OrderWorkflowStep {
    id: string;
    label: string;
    status: 'completed' | 'current' | 'paused' | 'pending';
    description: string;
}

export interface WebhookLog {
    id: string;
    event: string;
    status: number;
    timestamp: string;
    duration: string;
}

export enum PluginStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SANDBOXED = 'sandboxed'
}

export interface Plugin {
    id: string;
    name: string;
    version: string;
    author: string;
    hooks: string[];
    status: PluginStatus;
    description: string;
}

export interface Store {
    id: string;
    name: string;
    status: 'Healthy' | 'Throttled' | 'Warning';
    activePlugins: number;
    dailyRevenue: number;
    throughput: number;
}

export interface DashboardStats {
    totalOrders: number;
    revenue: number;
    activeAlerts: number;
    fulfillmentRate: number;
    recentOrders: OrderRecord[];
}

export interface OrderRecord {
    id: string;
    customer: string;
    amount: number;
    status: 'completed' | 'processing' | 'failed';
    time: string;
}

export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: number;
}
