export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped';

export type Carrier = 'FedEx' | 'UPS' | 'USPS' | 'DHL';

export type BoxSize = 'Small' | 'Medium' | 'Large' | 'Extra Large';

export interface OrderItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
}

export interface Note {
  id: string;
  text: string;
  timestamp: Date;
  author: string;
}

export interface TimelineEvent {
  id: string;
  status: OrderStatus;
  timestamp: Date;
  note?: string;
}

export interface FulfillmentInfo {
  weight?: number;
  boxSize?: BoxSize;
  carrier?: Carrier;
  trackingNumber?: string;
  shippedDate?: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  timeline: TimelineEvent[];
  notes: Note[];
  fulfillment?: FulfillmentInfo;
  shippingValidated: boolean;
}

export interface OrderFilters {
  status: OrderStatus | 'All';
  dateFrom: string;
  dateTo: string;
}

export interface FulfillmentFormData {
  weight: string;
  boxSize: BoxSize;
  carrier: Carrier;
  trackingNumber: string;
}
