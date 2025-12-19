import React, { useState, useCallback, useEffect } from 'react';
import { ShoppingCart, Clock, Send } from 'lucide-react';
import axios from 'axios';
import DarkModeToggle from './components/DarkModeToggle';
import Footer from './components/Footer';
/* ------------------ Utils ------------------ */
const generateUUID = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

/* ------------------ API ------------------ */
const submitOrder = async (payload: any) => {
  try {
    const response = await axios.post(
      'http://localhost:3000/api/order',
      payload,
      { headers: { 'Content-Type': 'application/json', 'x-store-id': 'X' } }
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

/* ------------------ Order Form ------------------ */
const OrderSubmissionForm = ({
  onOrderSubmitted,
  isLoading,
}: {
  onOrderSubmitted: (data: any) => void;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState({
    customerName: 'Motia Demo User',
    item: 'Motia Smartwatch V2',
    quantity: 1,
  });

  const [error, setError] = useState('');

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

    /**
     * ✅ FIXED FOR ZOD: 
     * The backend expects 'productName' as a string inside the items array.
     */
    const payload = {
      orderId: generateUUID(),
      customerName: formData.customerName,
      items: [
        {
          productName: formData.item, // Matches backend Zod schema
          quantity: formData.quantity,
        },
      ],
      totalAmount: formData.quantity * 99,
    };

    onOrderSubmitted(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-2xl font-bold dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">Order Details</h3>

      <div>
        <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Customer Name</label>
        <input
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all dark:text-white focus:border-blue-500"
          placeholder="Customer Name"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Select Product</label>
        <select
          name="item"
          value={formData.item}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all dark:text-white focus:border-blue-500 appearance-none shadow-sm"
        >
          {availableItems.map(item => (
            <option key={item} value={item} className="dark:bg-gray-900">{item}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Quantity</label>
        <input
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all dark:text-white focus:border-blue-500"
        />
      </div>

      {error && <div className="text-red-500 text-sm font-medium bg-red-50 dark:bg-red-900/20 p-2.5 rounded-lg border border-red-100 dark:border-red-900/50">{error}</div>}

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${isLoading ? 'bg-gray-400 dark:bg-gray-700 cursor-wait opacity-50' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/25'
          }`}
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
    </form>
  );
};

/* ------------------ Tracking View ------------------ */
const OrderTrackingView = ({
  orderId,
  formData,
  onReset,
}: {
  orderId: string;
  formData: any;
  onReset: () => void;
}) => {
  const [events, setEvents] = useState<any[]>([]);

  const startMockStream = useCallback(() => {
    const steps = [
      { status: 'PAYMENT_RECEIVED', label: 'Payment Successful', delay: 1000 },
      { status: 'INVENTORY_UPDATED', label: 'Stock Reserved', delay: 2500 },
      { status: 'SHIPPED', label: 'Package Dispatched', delay: 4000 },
    ];

    steps.forEach((step) => {
      setTimeout(() => {
        setEvents(prev => [
          ...prev,
          {
            timestamp: new Date().toLocaleTimeString(),
            ...step,
          },
        ]);
      }, step.delay);
    });
  }, []);

  useEffect(() => {
    startMockStream();
  }, [startMockStream]);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/50">
        <h3 className="text-xl font-black text-blue-900 dark:text-blue-400">Order Tracked Successfully</h3>
        <p className="text-xs text-blue-700 dark:text-blue-500/80 font-mono mt-1 opacity-70">REF: {orderId}</p>
      </div>

      <div className="text-gray-600 dark:text-gray-400 text-sm">
        <span className="font-bold text-gray-900 dark:text-white">{formData.customerName}</span> ordered{' '}
        <span className="font-bold text-gray-900 dark:text-white">{formData.items?.[0]?.quantity || 0}</span> x{' '}
        <span className="font-bold text-gray-900 dark:text-white">{formData.items?.[0]?.productName || 'Item'}</span>
      </div>

      <div className="border border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-black/50 p-5 h-64 overflow-y-auto shadow-inner custom-scrollbar">
        {events.length === 0 && <div className="text-gray-400 dark:text-gray-600 font-mono text-xs flex items-center gap-2"><Clock size={12} className="animate-spin" /> Waiting for system updates...</div>}
        {events.map((e, i) => (
          <div key={i} className="text-green-600 dark:text-green-400 font-mono text-xs mb-3 border-l-2 border-green-500/30 pl-3 py-0.5">
            <span className="text-gray-400 dark:text-gray-500 text-[10px]">[{e.timestamp}]</span><br />
            <span className="font-bold uppercase tracking-tighter">{e.status}</span> — <span className="opacity-80">{e.label}</span>
          </div>
        ))}
      </div>

      <button onClick={onReset} className="w-full py-3.5 text-blue-600 dark:text-blue-400 border-2 border-dashed border-blue-200 dark:border-blue-900/50 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all font-bold">
        New Submission
      </button>
    </div>
  );
};

/* ------------------ Main App ------------------ */
export default function App() {
  const [view, setView] = useState<'submission' | 'tracking'>('submission');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOrderSubmission = async (payload: any) => {
    setLoading(true);
    setError(null);

    const result = await submitOrder(payload);

    if (result.success) {
      setOrderData(payload); // Store payload for tracking view display
      setOrderId(payload.orderId);
      setView('tracking');
    } else {
      setError('Connection Error: The backend server is not responding.');
    }

    setLoading(false);
  };

  const reset = () => {
    setView('submission');
    setOrderId(null);
    setOrderData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen p-6 md:p-12 premium-gradient flex flex-col items-center justify-center dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-md w-full glass-panel p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 opacity-50"></div>

        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-500/30 transform group-hover:rotate-6 transition-transform">
              <ShoppingCart size={28} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter font-outfit uppercase">
              Motia<span className="text-blue-600">.</span>
            </h1>
          </div>
          <DarkModeToggle />
        </div>

        {view === 'submission' ? (
          <OrderSubmissionForm onOrderSubmitted={handleOrderSubmission} isLoading={loading} />
        ) : (
          <OrderTrackingView orderId={orderId!} formData={orderData} onReset={reset} />
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-xl text-center font-medium animate-bounce-subtle">
            {error}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}