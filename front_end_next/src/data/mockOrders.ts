import { Order } from '../types/order';

const now = new Date();

const threeDaysAgo = new Date(now);
threeDaysAgo.setDate(now.getDate() - 3);

const twoDaysAgo = new Date(now);
twoDaysAgo.setDate(now.getDate() - 2);

const oneDayAgo = new Date(now);
oneDayAgo.setDate(now.getDate() - 1);

const fiveHoursAgo = new Date(now);
fiveHoursAgo.setHours(now.getHours() - 5);

const oneWeekAgo = new Date(now);
oneWeekAgo.setDate(now.getDate() - 7);

const twoWeeksAgo = new Date(now);
twoWeeksAgo.setDate(now.getDate() - 14);

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-10245',
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '(555) 123-4567',
    },
    shippingAddress: {
      street: '123 Maple Street',
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      country: 'USA',
    },
    items: [
      {
        id: 'item-1',
        name: 'Wireless Bluetooth Headphones',
        sku: 'WBH-001',
        quantity: 2,
        unitPrice: 89.99,
        total: 179.98,
      },
      {
        id: 'item-2',
        name: 'USB-C Cable 6ft',
        sku: 'USBC-006',
        quantity: 3,
        unitPrice: 12.99,
        total: 38.97,
      },
    ],
    subtotal: 218.95,
    tax: 19.71,
    shippingCost: 8.99,
    total: 247.65,
    status: 'Pending',
    createdAt: threeDaysAgo,
    updatedAt: threeDaysAgo,
    timeline: [
      {
        id: 'timeline-1',
        status: 'Pending',
        timestamp: threeDaysAgo,
        note: 'Order placed',
      },
    ],
    notes: [
      {
        id: 'note-1',
        text: 'Customer requested gift wrapping',
        timestamp: threeDaysAgo,
        author: 'System',
      },
    ],
    shippingValidated: true,
  },
  {
    id: '2',
    orderNumber: 'ORD-10246',
    customer: {
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '(555) 234-5678',
    },
    shippingAddress: {
      street: '456 Oak Avenue',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA',
    },
    items: [
      {
        id: 'item-3',
        name: 'Mechanical Keyboard',
        sku: 'KB-MEC-101',
        quantity: 1,
        unitPrice: 149.99,
        total: 149.99,
      },
      {
        id: 'item-4',
        name: 'Gaming Mouse',
        sku: 'MOUSE-G-200',
        quantity: 1,
        unitPrice: 79.99,
        total: 79.99,
      },
      {
        id: 'item-5',
        name: 'Mouse Pad XL',
        sku: 'PAD-XL-01',
        quantity: 1,
        unitPrice: 24.99,
        total: 24.99,
      },
    ],
    subtotal: 254.97,
    tax: 22.95,
    shippingCost: 12.99,
    total: 290.91,
    status: 'Confirmed',
    createdAt: twoDaysAgo,
    updatedAt: oneDayAgo,
    timeline: [
      {
        id: 'timeline-2',
        status: 'Pending',
        timestamp: twoDaysAgo,
        note: 'Order placed',
      },
      {
        id: 'timeline-3',
        status: 'Confirmed',
        timestamp: oneDayAgo,
        note: 'Payment verified',
      },
    ],
    notes: [],
    shippingValidated: true,
  },
  {
    id: '3',
    orderNumber: 'ORD-10247',
    customer: {
      name: 'Emily Rodriguez',
      email: 'emily.r@email.com',
      phone: '(555) 345-6789',
    },
    shippingAddress: {
      street: '789 Pine Road',
      city: 'Austin',
      state: 'TX',
      zipCode: '73301',
      country: 'USA',
    },
    items: [
      {
        id: 'item-6',
        name: 'Laptop Stand Aluminum',
        sku: 'STAND-AL-001',
        quantity: 1,
        unitPrice: 59.99,
        total: 59.99,
      },
    ],
    subtotal: 59.99,
    tax: 5.40,
    shippingCost: 6.99,
    total: 72.38,
    status: 'Shipped',
    createdAt: oneWeekAgo,
    updatedAt: new Date(oneWeekAgo.getTime() + 24 * 60 * 60 * 1000),
    timeline: [
      {
        id: 'timeline-4',
        status: 'Pending',
        timestamp: oneWeekAgo,
        note: 'Order placed',
      },
      {
        id: 'timeline-5',
        status: 'Confirmed',
        timestamp: new Date(oneWeekAgo.getTime() + 2 * 60 * 60 * 1000),
        note: 'Payment verified',
      },
      {
        id: 'timeline-6',
        status: 'Shipped',
        timestamp: new Date(oneWeekAgo.getTime() + 24 * 60 * 60 * 1000),
        note: 'Package shipped via FedEx',
      },
    ],
    notes: [
      {
        id: 'note-2',
        text: 'Confirmed delivery address with customer',
        timestamp: oneWeekAgo,
        author: 'Support Team',
      },
    ],
    fulfillment: {
      weight: 2.5,
      boxSize: 'Small',
      carrier: 'FedEx',
      trackingNumber: '1Z999AA10123456784',
      shippedDate: new Date(oneWeekAgo.getTime() + 24 * 60 * 60 * 1000),
    },
    shippingValidated: true,
  },
  {
    id: '4',
    orderNumber: 'ORD-10248',
    customer: {
      name: 'David Thompson',
      email: 'david.t@email.com',
      phone: '(555) 456-7890',
    },
    shippingAddress: {
      street: '321 Elm Street',
      city: 'Denver',
      state: 'CO',
      zipCode: '80201',
      country: 'USA',
    },
    items: [
      {
        id: 'item-7',
        name: '4K Webcam',
        sku: 'CAM-4K-001',
        quantity: 1,
        unitPrice: 129.99,
        total: 129.99,
      },
      {
        id: 'item-8',
        name: 'Ring Light',
        sku: 'LIGHT-RING-01',
        quantity: 1,
        unitPrice: 49.99,
        total: 49.99,
      },
    ],
    subtotal: 179.98,
    tax: 16.20,
    shippingCost: 9.99,
    total: 206.17,
    status: 'Pending',
    createdAt: fiveHoursAgo,
    updatedAt: fiveHoursAgo,
    timeline: [
      {
        id: 'timeline-7',
        status: 'Pending',
        timestamp: fiveHoursAgo,
        note: 'Order placed',
      },
    ],
    notes: [],
    shippingValidated: false,
  },
  {
    id: '5',
    orderNumber: 'ORD-10249',
    customer: {
      name: 'Jessica Martinez',
      email: 'jessica.m@email.com',
      phone: '(555) 567-8901',
    },
    shippingAddress: {
      street: '654 Birch Lane',
      city: 'Boston',
      state: 'MA',
      zipCode: '02101',
      country: 'USA',
    },
    items: [
      {
        id: 'item-9',
        name: 'Portable SSD 1TB',
        sku: 'SSD-1TB-001',
        quantity: 2,
        unitPrice: 119.99,
        total: 239.98,
      },
    ],
    subtotal: 239.98,
    tax: 21.60,
    shippingCost: 10.99,
    total: 272.57,
    status: 'Confirmed',
    createdAt: oneDayAgo,
    updatedAt: fiveHoursAgo,
    timeline: [
      {
        id: 'timeline-8',
        status: 'Pending',
        timestamp: oneDayAgo,
        note: 'Order placed',
      },
      {
        id: 'timeline-9',
        status: 'Confirmed',
        timestamp: fiveHoursAgo,
        note: 'Payment verified',
      },
    ],
    notes: [
      {
        id: 'note-3',
        text: 'Express shipping requested',
        timestamp: oneDayAgo,
        author: 'Customer Service',
      },
    ],
    shippingValidated: true,
  },
  {
    id: '6',
    orderNumber: 'ORD-10250',
    customer: {
      name: 'Robert Lee',
      email: 'robert.lee@email.com',
      phone: '(555) 678-9012',
    },
    shippingAddress: {
      street: '987 Cedar Court',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94101',
      country: 'USA',
    },
    items: [
      {
        id: 'item-10',
        name: 'Monitor 27" 4K',
        sku: 'MON-27-4K',
        quantity: 1,
        unitPrice: 399.99,
        total: 399.99,
      },
      {
        id: 'item-11',
        name: 'HDMI Cable 10ft',
        sku: 'HDMI-010',
        quantity: 2,
        unitPrice: 15.99,
        total: 31.98,
      },
    ],
    subtotal: 431.97,
    tax: 38.88,
    shippingCost: 15.99,
    total: 486.84,
    status: 'Shipped',
    createdAt: twoWeeksAgo,
    updatedAt: new Date(twoWeeksAgo.getTime() + 48 * 60 * 60 * 1000),
    timeline: [
      {
        id: 'timeline-10',
        status: 'Pending',
        timestamp: twoWeeksAgo,
        note: 'Order placed',
      },
      {
        id: 'timeline-11',
        status: 'Confirmed',
        timestamp: new Date(twoWeeksAgo.getTime() + 3 * 60 * 60 * 1000),
        note: 'Payment verified',
      },
      {
        id: 'timeline-12',
        status: 'Shipped',
        timestamp: new Date(twoWeeksAgo.getTime() + 48 * 60 * 60 * 1000),
        note: 'Package shipped via UPS',
      },
    ],
    notes: [],
    fulfillment: {
      weight: 12.5,
      boxSize: 'Large',
      carrier: 'UPS',
      trackingNumber: '1Z999AA10987654321',
      shippedDate: new Date(twoWeeksAgo.getTime() + 48 * 60 * 60 * 1000),
    },
    shippingValidated: true,
  },
];
