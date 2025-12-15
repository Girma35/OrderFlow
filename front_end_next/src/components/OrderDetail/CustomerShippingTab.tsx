import { CheckCircle, AlertCircle } from 'lucide-react';
import { Order } from '../../types/order';

interface CustomerShippingTabProps {
  order: Order;
}

export function CustomerShippingTab({ order }: CustomerShippingTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-50 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
          Customer Information
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Name</p>
            <p className="text-sm font-medium text-gray-900">{order.customer.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Email</p>
            <p className="text-sm text-gray-900">{order.customer.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Phone</p>
            <p className="text-sm text-gray-900">{order.customer.phone}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Shipping Address
          </h3>
          {order.shippingValidated ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full border border-green-200">
              <CheckCircle className="w-3 h-3" />
              Valid
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full border border-gray-300">
              <AlertCircle className="w-3 h-3" />
              Unknown
            </span>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-900">{order.shippingAddress.street}</p>
          <p className="text-sm text-gray-900">
            {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
            {order.shippingAddress.zipCode}
          </p>
          <p className="text-sm text-gray-900">{order.shippingAddress.country}</p>
        </div>
      </div>
    </div>
  );
}
