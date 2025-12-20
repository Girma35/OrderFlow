import React, { useState } from 'react';
import { Send, Clock, LayoutDashboard } from 'lucide-react';
import { generateUUID } from '../utils/api';

interface OrderFormProps {
    onOrderSubmitted: (data: any) => void;
    isLoading: boolean;
    onNavigateToDashboard: () => void;
}

const OrderFormPage: React.FC<OrderFormProps> = ({ onOrderSubmitted, isLoading, onNavigateToDashboard }) => {
    const [formData, setFormData] = useState({
        customerName: 'Motia Demo User',
        item: 'Motia Smartwatch V2',
        quantity: 1,
        storeId: 'X'
    });

    const [error, setError] = useState('');

    const stores = [
        { id: 'X', name: 'Motia Prime (Blue)' },
        { id: 'Y', name: 'Nexus Shop (Emerald)' },
        { id: 'Z', name: 'Aura Luxe (Rose)' },
    ];

    const availableItems = [
        'Motia Smartwatch V2',
        'Motia IoT Sensor Kit',
        'Motia Pro Headset',
        'Motia AI Dev Board',
    ];

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantity' ? Math.max(1, Number(value) || 1) : value,
        }));
        setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.customerName || formData.quantity < 1) {
            setError('Customer name and quantity are required.');
            return;
        }

        const orderTotal = formData.quantity * 99;
        const payload = {
            orderId: generateUUID(),
            customerName: formData.customerName,
            items: [
                {
                    productName: formData.item,
                    quantity: formData.quantity,
                },
            ],
            totalAmount: orderTotal,
            storeId: formData.storeId
        };

        onOrderSubmitted(payload);
    };

    const unitPrice = 99;
    const totalDue = formData.quantity * unitPrice;

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Submit</p>
                <h3 className="text-3xl font-bold dark:text-white pro-heading">Order Intake</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Instantly create a synthetic order that flows through the Motia orchestration stack.</p>
            </div>

            <div className="grid gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[{
                        label: 'Merchant Store',
                        value: stores.find(s => s.id === formData.storeId)?.name || 'Motia Prime'
                    }, {
                        label: 'Order Value',
                        value: `$${totalDue.toFixed(2)}`
                    }].map((info) => (
                        <div key={info.label} className="glass-panel rounded-2xl p-4 card-sheen">
                            <p className="text-xs uppercase tracking-[0.4em] text-gray-400">{info.label}</p>
                            <p className="text-xl font-black mt-2 text-gray-900 dark:text-white">
                                {info.value}
                            </p>
                        </div>
                    ))}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Merchant Store</label>
                    <select
                        name="storeId"
                        value={formData.storeId}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all dark:text-white focus:border-blue-500 appearance-none shadow-sm"
                    >
                        {stores.map(store => (
                            <option key={store.id} value={store.id} className="dark:bg-gray-900">{store.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Customer Name</label>
                    <input
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all dark:text-white focus:border-blue-500 font-medium"
                        placeholder="Customer Name"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Product</label>
                        <select
                            name="item"
                            value={formData.item}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all dark:text-white focus:border-blue-500 appearance-none shadow-sm text-sm"
                        >
                            {availableItems.map(item => (
                                <option key={item} value={item} className="dark:bg-gray-900">{item}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Qty</label>
                        <input
                            name="quantity"
                            type="number"
                            value={formData.quantity}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all dark:text-white focus:border-blue-500 font-bold"
                        />
                    </div>
                </div>

                {error && <div className="text-red-500 text-sm font-medium bg-red-50 dark:bg-red-900/20 p-2.5 rounded-lg border border-red-100 dark:border-red-900/50">{error}</div>}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg glow-ring ${isLoading ? 'bg-gray-500/60 cursor-wait text-white' : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white'}
                    `}
                >
                    {isLoading ? (
                        <>
                            <Clock className="animate-spin" size={24} />
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <Send size={24} />
                            <span>Submit Order</span>
                        </>
                    )}
                </button>
                <button
                    type="button"
                    onClick={onNavigateToDashboard}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold text-base transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </button>
            </div>
        </form>
    );
};

export default OrderFormPage;
