import { Order } from '../../types/order';

interface ItemsTabProps {
  order: Order;
}

export function ItemsTab({ order }: ItemsTabProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Item Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              SKU
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Unit Price
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {order.items.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-4 text-sm text-gray-900">{item.name}</td>
              <td className="px-4 py-4 text-sm text-gray-600">{item.sku}</td>
              <td className="px-4 py-4 text-sm text-gray-900 text-right">{item.quantity}</td>
              <td className="px-4 py-4 text-sm text-gray-900 text-right">
                ${item.unitPrice.toFixed(2)}
              </td>
              <td className="px-4 py-4 text-sm font-medium text-gray-900 text-right">
                ${item.total.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
