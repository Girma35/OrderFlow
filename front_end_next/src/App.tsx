import React, { useState, useCallback, useEffect } from 'react';
import { ShoppingCart, Package, CheckCircle, Clock, Send } from 'lucide-react';
import axios from 'axios';

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
      { headers: { 'Content-Type': 'application/json' } }
    );

    return {
      success: true,
      orderId: payload.orderId, // async backend → track locally
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
    paymentMock: 'Credit Card (Mock)',
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
      [name]:
        name === 'quantity'
          ? Math.max(1, Number(value) || 1)
          : value,
    }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName || formData.quantity < 1) {
      setError('Customer name and quantity are required.');
      return;
    }

    // 🔑 Build payload exactly as backend expects
    const payload = {
      orderId: generateUUID(),
      customerName: formData.customerName,
      items: [
        {
          productId: generateUUID(),
          quantity: formData.quantity,
        },
      ],
      totalAmount: formData.quantity * 99, // mock pricing
    };

    onOrderSubmitted(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold border-b pb-2">
        Order Details
      </h3>

      <input
        name="customerName"
        value={formData.customerName}
        onChange={handleChange}
        disabled={isLoading}
        className="w-full border px-4 py-2 rounded"
        placeholder="Customer Name"
      />

      <select
        name="item"
        value={formData.item}
        onChange={handleChange}
        disabled={isLoading}
        className="w-full border px-4 py-2 rounded"
      >
        {availableItems.map(item => (
          <option key={item}>{item}</option>
        ))}
      </select>

      <input
        name="quantity"
        type="number"
        value={formData.quantity}
        onChange={handleChange}
        disabled={isLoading}
        className="w-full border px-4 py-2 rounded"
      />

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded font-bold ${isLoading
          ? 'bg-gray-400 cursor-wait'
          : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
      >
        {isLoading ? (
          <>
            <Clock className="animate-spin" />
            Sending Order...
          </>
        ) : (
          <>
            <Send />
            Submit Order
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
  const [status, setStatus] = useState('pending');
  const [events, setEvents] = useState<any[]>([]);

  const startMockStream = useCallback(() => {
    const steps = [
      { status: 'paid', label: 'Payment Complete', delay: 1500 },
      { status: 'inventory.reserved', label: 'Inventory Reserved', delay: 1500 },
      { status: 'shipped', label: 'Order Shipped', delay: 1500 },
    ];

    let index = 0;

    const run = () => {
      if (index >= steps.length) return;

      setTimeout(() => {
        const step = steps[index];
        setStatus(step.status);
        setEvents(prev => [
          ...prev,
          {
            timestamp: new Date().toLocaleTimeString(),
            ...step,
          },
        ]);
        index++;
        run();
      }, steps[index].delay);
    };

    run();
  }, []);

  useEffect(() => {
    startMockStream();
  }, [startMockStream]);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">
        Tracking Order: {orderId}
      </h3>

      <p>
        {formData.customerName} — {formData.items[0].quantity} item(s)
      </p>

      <div className="border rounded p-4 bg-gray-50 h-48 overflow-y-auto">
        {events.map((e, i) => (
          <div key={i} className="text-sm font-mono">
            [{e.timestamp}] → {e.status.toUpperCase()} ({e.label})
          </div>
        ))}
      </div>

      <button
        onClick={onReset}
        className="text-blue-600 hover:underline"
      >
        ← New Order
      </button>
    </div>
  );
};

/* ------------------ App ------------------ */
export default function App() {
  const [view, setView] = useState<'submission' | 'tracking'>('submission');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOrderSubmission = async (payload: any) => {
    setLoading(true);
    setError(null);
    setOrderData(payload);

    const result = await submitOrder(payload);

    if (result.success) {
      setOrderId(payload.orderId);
      setView('tracking');
    } else {
      setError('Order submission failed.');
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
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-6">
          <ShoppingCart /> Motia Unified Order Demo
        </h1>

        {view === 'submission' && (
          <OrderSubmissionForm
            onOrderSubmitted={handleOrderSubmission}
            isLoading={loading}
          />
        )}

        {view === 'tracking' && orderId && orderData && (
          <OrderTrackingView
            orderId={orderId}
            formData={orderData}
            onReset={reset}
          />
        )}

        {error && (
          <div className="mt-4 text-red-600">{error}</div>
        )}
      </div>
    </div>
  );
}
