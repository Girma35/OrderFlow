import { useState } from 'react';
import { X } from 'lucide-react';
import { Order, BoxSize, Carrier, FulfillmentFormData } from '../../types/order';

interface FulfillmentModalProps {
  order: Order;
  onClose: () => void;
  onSubmit: (orderId: string, fulfillmentData: FulfillmentFormData) => void;
}

interface FormErrors {
  weight?: string;
  trackingNumber?: string;
}

export function FulfillmentModal({ order, onClose, onSubmit }: FulfillmentModalProps) {
  const [formData, setFormData] = useState<FulfillmentFormData>({
    weight: '',
    boxSize: 'Medium',
    carrier: 'FedEx',
    trackingNumber: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'weight':
        if (value && (isNaN(Number(value)) || Number(value) <= 0)) {
          return 'Weight must be a positive number';
        }
        break;
      case 'trackingNumber':
        if (!value.trim()) {
          return 'Tracking number is required';
        }
        if (value.length < 10) {
          return 'Tracking number must be at least 10 characters';
        }
        break;
    }
    return undefined;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof FulfillmentFormData]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
      }
    });

    setErrors(newErrors);
    setTouched({
      weight: true,
      trackingNumber: true,
    });

    if (Object.keys(newErrors).length === 0) {
      onSubmit(order.id, formData);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
            Fulfill Order {order.orderNumber}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                Weight (lbs)
              </label>
              <input
                type="text"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors.weight && touched.weight
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                placeholder="e.g., 5.5"
              />
              {errors.weight && touched.weight && (
                <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
              )}
            </div>

            <div>
              <label htmlFor="boxSize" className="block text-sm font-medium text-gray-700 mb-2">
                Box Size
              </label>
              <select
                id="boxSize"
                name="boxSize"
                value={formData.boxSize}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
                <option value="Extra Large">Extra Large</option>
              </select>
            </div>

            <div>
              <label htmlFor="carrier" className="block text-sm font-medium text-gray-700 mb-2">
                Carrier
              </label>
              <select
                id="carrier"
                name="carrier"
                value={formData.carrier}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="FedEx">FedEx</option>
                <option value="UPS">UPS</option>
                <option value="USPS">USPS</option>
                <option value="DHL">DHL</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="trackingNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tracking Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="trackingNumber"
                name="trackingNumber"
                value={formData.trackingNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors.trackingNumber && touched.trackingNumber
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                placeholder="e.g., 1Z999AA10123456784"
              />
              {errors.trackingNumber && touched.trackingNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.trackingNumber}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Submit & Ship Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
