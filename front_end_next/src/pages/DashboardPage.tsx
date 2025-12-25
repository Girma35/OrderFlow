import { useState, useEffect } from 'react';
import {
    TrendingUp,
    Users,
    AlertTriangle,
    CheckCircle2,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCcw,
    Clock,
    Package
} from 'lucide-react';
import { fetchDashboardStats } from '../utils/api';

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [storeId] = useState('X'); // Default store, can be made dynamic later

    useEffect(() => {
        const loadStats = async () => {
            setLoading(true);
            try {
                const data = await fetchDashboardStats(storeId);
                setStats(data);
            } catch (error) {
                console.error('Failed to load dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();

        // Refresh stats every 30 seconds (less frequent)
        const interval = setInterval(loadStats, 30000);
        return () => clearInterval(interval);
    }, [storeId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <RefreshCcw className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    const cards = [
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            Icon: TrendingUp,
            accent: '#2563eb',
            glow: 'rgba(37, 99, 235, 0.2)',
            trend: '+12.5%',
            isUp: true,
            sublabel: 'vs last 7 days'
        },
        {
            title: 'Revenue',
            value: `$${stats.revenue.toLocaleString()}`,
            Icon: Users,
            accent: '#7c3aed',
            glow: 'rgba(124, 58, 237, 0.25)',
            trend: '+8.2%',
            isUp: true,
            sublabel: 'net receipts'
        },
        {
            title: 'Active Alerts',
            value: stats.activeAlerts,
            Icon: AlertTriangle,
            accent: '#f97316',
            glow: 'rgba(249, 115, 22, 0.25)',
            trend: '-2',
            isUp: false,
            sublabel: 'open investigations'
        },
        {
            title: 'Fulfillment',
            value: `${stats.fulfillmentRate}%`,
            Icon: CheckCircle2,
            accent: '#10b981',
            glow: 'rgba(16, 185, 129, 0.25)',
            trend: '+0.5%',
            isUp: true,
            sublabel: 'order SLA hit'
        },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col gap-2">
                <p className="text-xs uppercase font-semibold tracking-[0.3em] text-slate-400">
                    Operational Pulse
                </p>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white pro-heading">
                    System Overview
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
                    Real-time performance metrics across orders, alerts, and fulfillment health.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <article
                        key={card.title}
                        className="glass-panel p-6 rounded-3xl relative overflow-hidden group hover:translate-y-[-4px] transition-all duration-300"
                    >
                        <div
                            className="absolute inset-y-0 right-0 w-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ background: `radial-gradient(circle at 20% 20%, ${card.glow}, transparent 55%)` }}
                        />
                        <div className="flex justify-between items-start relative z-10">
                            <span
                                className="inline-flex items-center justify-center w-12 h-12 rounded-2xl shadow-inner"
                                style={{ backgroundColor: card.glow, color: card.accent }}
                            >
                                <card.Icon size={22} />
                            </span>
                            <div className={`flex items-center gap-1 text-xs font-bold ${card.isUp ? 'text-emerald-500' : 'text-amber-500'}`}>
                                {card.trend}
                                {card.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            </div>
                        </div>
                        <div className="mt-6 relative z-10 space-y-1">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                                {card.value}
                            </h3>
                            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">{card.sublabel}</p>
                        </div>
                    </article>
                ))}
            </div>

            <section className="glass-panel rounded-[2rem] overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Recent Flow</p>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white pro-heading">Order Timeline</h3>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">
                            <ArrowUpRight size={12} /> SLA met
                        </span>
                        <button className="text-sm font-semibold text-blue-600 hover:text-blue-400 transition-colors">
                            View All
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/70 dark:bg-gray-800/50 sticky top-0 z-10">
                            <tr>
                                <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.3em]">Order ID</th>
                                <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.3em]">Customer</th>
                                <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.3em]">Amount</th>
                                <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.3em]">Status</th>
                                <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.3em]">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {stats.recentOrders && stats.recentOrders.length > 0 ? (
                                stats.recentOrders.map((order: any) => {
                                    const statusClasses = order.status === 'completed'
                                        ? {
                                            bg: 'rgba(16, 185, 129, 0.15)',
                                            text: '#10b981'
                                        }
                                        : order.status === 'failed'
                                            ? { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' }
                                            : { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6' };

                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/30 transition-colors group cursor-pointer">
                                            <td className="px-8 py-5 text-sm font-bold text-blue-600 dark:text-blue-400">{order.id}</td>
                                            <td className="px-8 py-5 text-sm font-medium text-gray-900 dark:text-white">{order.customer}</td>
                                            <td className="px-8 py-5 text-sm font-bold text-gray-900 dark:text-white">${order.amount.toFixed(2)}</td>
                                            <td className="px-8 py-5">
                                                <span
                                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                                                    style={{ backgroundColor: statusClasses.bg, color: statusClasses.text }}
                                                >
                                                    <span
                                                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                                                        style={{ backgroundColor: statusClasses.text }}
                                                    />
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-sm text-gray-500 dark:text-gray-400">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={14} />
                                                    {order.time}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-gray-400 dark:text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <Package size={32} className="opacity-50" />
                                            <p className="text-sm font-medium">No orders yet</p>
                                            <p className="text-xs">Submit an order to see it here</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {stats.recentOrders && stats.recentOrders.length > 0 && (
                    <div className="px-8 py-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 text-center">
                        Showing {stats.recentOrders.length} {stats.recentOrders.length === 1 ? 'order' : 'orders'}
                    </div>
                )}
            </section>
        </div>
    );
}
