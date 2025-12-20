import { useState, useEffect, type CSSProperties } from 'react';
import { Clock, Box, CheckCircle, Truck, Package } from 'lucide-react';
import { fetchOrderTracking } from '../utils/api';
import { getBrand } from '../utils/branding';

interface OrderTrackingProps {
    orderId: string;
    formData: any;
    onReset: () => void;
}

const OrderTrackingPage: React.FC<OrderTrackingProps> = ({ orderId, formData, onReset }) => {
    const [trackingData, setTrackingData] = useState<any>(null);
    const storeId = formData.storeId || 'X';
    const brand = getBrand(storeId);

    useEffect(() => {
        const pollTracking = async () => {
            const data = await fetchOrderTracking(orderId, storeId);
            if (data) {
                setTrackingData(data);
            }
        };

        const interval = setInterval(pollTracking, 3000);
        pollTracking();
        return () => clearInterval(interval);
    }, [orderId, storeId]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'SHIPPED': return <Truck size={14} />;
            case 'DELIVERED': return <CheckCircle size={14} />;
            case 'INVENTORY_RESERVED': return <Box size={14} />;
            default: return <Package size={14} />;
        }
    };

    const history = trackingData?.history || [
        { status: 'ORDER_CREATED', timestamp: new Date().toISOString() }
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div
                className="p-5 rounded-3xl border neon-border"
                style={{
                    background: brand.secondaryColor,
                    borderColor: brand.primaryColor + '33'
                }}
            >
                <div className="flex justify-between items-start">
                    <div>
                        <h3
                            className="text-xl font-black font-outfit uppercase tracking-tighter"
                            style={{ color: brand.textOnPrimary }}
                        >
                            {brand.name}
                        </h3>
                        <p
                            className="text-[10px] font-mono mt-1 opacity-70"
                            style={{ color: brand.textOnPrimary }}
                        >
                            TRACKING ID: {orderId}
                        </p>
                    </div>
                    {trackingData?.status === 'delivered' && (
                        <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">
                            Delivered
                        </div>
                    )}
                </div>
            </div>

            <div className="text-gray-600 dark:text-gray-400 text-sm">
                <span className="font-bold text-gray-900 dark:text-white uppercase tracking-tight">{formData.customerName}</span>'s order for{' '}
                <span className="font-bold text-gray-900 dark:text-white">{formData.items?.[0]?.quantity || 0}</span> x{' '}
                <span className="font-bold text-gray-900 dark:text-white">{formData.items?.[0]?.productName || 'Item'}</span> is being processed by <span className="font-bold" style={{ color: brand.primaryColor }}>{brand.name}</span>.
            </div>

            <div className="glass-panel rounded-2xl bg-gray-50/50 dark:bg-black/20 p-5 h-72 overflow-y-auto shadow-inner custom-scrollbar relative">
                <div className="absolute left-7 top-5 bottom-5 w-0.5 bg-gray-200 dark:bg-gray-800"></div>

                <div className="space-y-6 relative">
                    {history.map((e: any, i: number) => (
                        <div key={i} className="flex gap-4 group">
                            <div
                                className={`relative z-10 w-4 h-4 rounded-full mt-1 flex items-center justify-center ${i === history.length - 1 ? 'shadow-lg' : ''}`}
                                style={{
                                    background: i === history.length - 1 ? brand.primaryColor : 'rgba(148, 163, 184, 0.6)',
                                    boxShadow: i === history.length - 1 ? `0 10px 30px ${brand.glow}` : undefined
                                }}
                            >
                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            </div>
                            <div className={`flex-1 ${i === history.length - 1 ? 'opacity-100' : 'opacity-60'}`}>
                                <div className="flex justify-between items-start">
                                    <span className="font-black text-[11px] uppercase tracking-widest text-gray-900 dark:text-white flex items-center gap-2">
                                        {getStatusIcon(e.status)}
                                        {e.status.replace(/_/g, ' ')}
                                    </span>
                                    <span className="text-[10px] font-mono text-gray-400">
                                        {new Date(e.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                                {i === history.length - 1 && trackingData?.trackingNumber && (
                                    <div
                                        className="mt-2 text-[10px] font-bold px-2 py-1 rounded-md inline-block"
                                        style={{
                                            color: brand.primaryColor,
                                            background: brand.secondaryColor
                                        }}
                                    >
                                        ID: {trackingData.trackingNumber}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {!trackingData && (
                        <div className="flex items-center gap-3 text-gray-400 font-mono text-[10px] animate-pulse pl-8">
                            <Clock size={12} className="animate-spin" />
                            CONNECTING TO REAL-TIME PIPE...
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={onReset}
                className="w-full py-4 rounded-2xl border-2 border-dashed font-black uppercase tracking-widest text-xs transition-all text-[color:var(--brand-color)] border-[color:var(--brand-border)] hover:bg-[var(--brand-secondary)]"
                style={{
                    '--brand-color': brand.primaryColor,
                    '--brand-border': `${brand.primaryColor}4d`,
                    '--brand-secondary': brand.secondaryColor
                } as CSSProperties}
            >
                New Submission
            </button>
        </div>
    );
};

export default OrderTrackingPage;
