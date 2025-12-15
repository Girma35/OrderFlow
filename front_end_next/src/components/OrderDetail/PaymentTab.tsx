import { Order } from '../../types/order';

interface PaymentTabProps {
  order: Order;
}

export function PaymentTab({ order }: PaymentTabProps) {
  return (
    <div className="max-w-md ml-auto">
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Subtotal</span>
          <span className="text-sm font-medium text-gray-900">${order.subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Tax</span>
          <span className="text-sm font-medium text-gray-900">${order.tax.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Shipping</span>
          <span className="text-sm font-medium text-gray-900">
            ${order.shippingCost.toFixed(2)}
          </span>
        </div>

        <div className="border-t border-gray-300 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold text-gray-900">Total</span>
            <span className="text-xl font-bold text-gray-900">${order.total.toFixed(2)}</span>
          </div>
        </div>

        {order.fulfillment && (
          <>
            <div className="border-t border-gray-300 pt-4 mt-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Fulfillment Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Weight</span>
                  <span className="text-sm font-medium text-gray-900">
                    {order.fulfillment.weight} lbs
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Box Size</span>
                  <span className="text-sm font-medium text-gray-900">
                    {order.fulfillment.boxSize}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Carrier</span>
                  <span className="text-sm font-medium text-gray-900">
                    {order.fulfillment.carrier}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tracking Number</span>
                  <span className="text-sm font-medium text-blue-600">
                    {order.fulfillment.trackingNumber}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
