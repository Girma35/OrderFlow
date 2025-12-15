import { useState } from 'react';
import { ArrowLeft, Package } from 'lucide-react';
import { Order } from '../../types/order';
import { StatusStepper } from './StatusStepper';
import { CustomerShippingTab } from './CustomerShippingTab';
import { ItemsTab } from './ItemsTab';
import { PaymentTab } from './PaymentTab';
import { TimelineTab } from './TimelineTab';

interface OrderDetailProps {
  order: Order;
  onBack: () => void;
  onFulfillOrder: (order: Order) => void;
  onAddNote: (orderId: string, noteText: string) => void;
}

type TabType = 'customer' | 'items' | 'payment' | 'timeline';

export function OrderDetail({ order, onBack, onFulfillOrder, onAddNote }: OrderDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>('customer');

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'customer', label: 'Customer & Shipping' },
    { id: 'items', label: 'Items' },
    { id: 'payment', label: 'Payment Summary' },
    { id: 'timeline', label: 'Timeline & Notes' },
  ];

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back to Dashboard</span>
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h2>
            </div>
            <p className="text-sm text-gray-600">Placed on {formatDate(order.createdAt)}</p>
          </div>
          {order.status !== 'Shipped' && (
            <button
              onClick={() => onFulfillOrder(order)}
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Fulfill Order
            </button>
          )}
        </div>

        <StatusStepper currentStatus={order.status} />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
                role="tab"
                aria-selected={activeTab === tab.id}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'customer' && <CustomerShippingTab order={order} />}
          {activeTab === 'items' && <ItemsTab order={order} />}
          {activeTab === 'payment' && <PaymentTab order={order} />}
          {activeTab === 'timeline' && <TimelineTab order={order} onAddNote={onAddNote} />}
        </div>
      </div>
    </div>
  );
}
