import mongoose, { Schema, Document } from 'mongoose';

// --- Order Schema ---
export interface IOrder extends Document {
    orderId: string;
    customerName: string;
    items: Array<{
        productName: string;
        quantity: number;
        price?: number;
    }>;
    totalAmount: number;
    status: 'pending' | 'paid' | 'failed' | 'fulfilled' | 'shipped' | 'delivered';
    storeId: string;
    timestamp: Date;
    trackingNumber?: string;
}

const OrderSchema = new Schema<IOrder>({
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    items: [{
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number }
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paid', 'failed', 'fulfilled', 'shipped', 'delivered'], default: 'pending' },
    storeId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    trackingNumber: { type: String }
}, { timestamps: true });

// --- Product/Inventory Schema ---
export interface IProduct extends Document {
    productId: string;
    productName: string;
    stock: number;
    threshold: number;
    storeId: string;
    status: 'active' | 'out_of_stock' | 'stale';
}

const ProductSchema = new Schema<IProduct>({
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
    threshold: { type: Number, default: 10 },
    storeId: { type: String, required: true },
    status: { type: String, enum: ['active', 'out_of_stock', 'stale'], default: 'active' }
}, { timestamps: true });

// Ensure unique combination of store and product
ProductSchema.index({ storeId: 1, productName: 1 }, { unique: true });

// --- Notification Schema ---
export interface INotification extends Document {
    notificationId: string;
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    storeId: string;
    orderId?: string;
    read: boolean;
    timestamp: Date;
}

const NotificationSchema = new Schema<INotification>({
    notificationId: { type: String, required: true, unique: true },
    type: { type: String, enum: ['info', 'warning', 'error', 'success'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    storeId: { type: String, required: true },
    orderId: { type: String },
    read: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
export const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
