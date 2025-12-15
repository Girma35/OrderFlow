import { useState, useMemo } from 'react';
import { Layout } from './components/Layout/Layout';
import { OrderFilters } from './components/Dashboard/OrderFilters';
import { OrderTable } from './components/Dashboard/OrderTable';
import { Pagination } from './components/Dashboard/Pagination';
import { OrderDetail } from './components/OrderDetail/OrderDetail';
import { FulfillmentModal } from './components/Fulfillment/FulfillmentModal';
import { Toast, ToastType } from './components/common/Toast';
import { mockOrders } from './data/mockOrders';
import {
  Order,
  OrderFilters as OrderFiltersType,
  FulfillmentFormData,
  TimelineEvent,
  Note,
} from './types/order';

type View = 'dashboard' | 'detail';

function App() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filters, setFilters] = useState<OrderFiltersType>({
    status: 'Pending',
    dateFrom: '',
    dateTo: '',
  });
  const [sortBy, setSortBy] = useState<'orderId' | 'status' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFulfillmentModal, setShowFulfillmentModal] = useState(false);
  const [orderToFulfill, setOrderToFulfill] = useState<Order | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const itemsPerPage = 10;

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter((order) => {
      if (filters.status !== 'All' && order.status !== filters.status) {
        return false;
      }

      if (filters.dateFrom) {
        const orderDate = new Date(order.createdAt);
        const fromDate = new Date(filters.dateFrom);
        if (orderDate < fromDate) return false;
      }

      if (filters.dateTo) {
        const orderDate = new Date(order.createdAt);
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (orderDate > toDate) return false;
      }

      return true;
    });

    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        let compareValue = 0;
        if (sortBy === 'orderId') {
          compareValue = a.orderNumber.localeCompare(b.orderNumber);
        } else if (sortBy === 'status') {
          compareValue = a.status.localeCompare(b.status);
        }
        return sortDirection === 'asc' ? compareValue : -compareValue;
      });
    }

    return filtered;
  }, [orders, filters, sortBy, sortDirection]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedOrders.slice(startIndex, endIndex);
  }, [filteredAndSortedOrders, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedOrders.length / itemsPerPage);

  const handleSort = (column: 'orderId' | 'status') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const handleOrderClick = (order: Order) => {
    const updatedOrder = orders.find((o) => o.id === order.id) || order;
    setSelectedOrder(updatedOrder);
    setCurrentView('detail');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedOrder(null);
  };

  const handleFulfillOrder = (order: Order) => {
    setOrderToFulfill(order);
    setShowFulfillmentModal(true);
  };

  const handleFulfillmentSubmit = (orderId: string, fulfillmentData: FulfillmentFormData) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          const now = new Date();
          const newTimelineEvent: TimelineEvent = {
            id: `timeline-${Date.now()}`,
            status: 'Shipped',
            timestamp: now,
            note: `Package shipped via ${fulfillmentData.carrier}`,
          };

          return {
            ...order,
            status: 'Shipped' as const,
            updatedAt: now,
            fulfillment: {
              weight: fulfillmentData.weight ? Number(fulfillmentData.weight) : undefined,
              boxSize: fulfillmentData.boxSize,
              carrier: fulfillmentData.carrier,
              trackingNumber: fulfillmentData.trackingNumber,
              shippedDate: now,
            },
            timeline: [...order.timeline, newTimelineEvent],
          };
        }
        return order;
      })
    );

    if (selectedOrder?.id === orderId) {
      const updatedOrder = orders.find((o) => o.id === orderId);
      if (updatedOrder) {
        const now = new Date();
        const newTimelineEvent: TimelineEvent = {
          id: `timeline-${Date.now()}`,
          status: 'Shipped',
          timestamp: now,
          note: `Package shipped via ${fulfillmentData.carrier}`,
        };

        setSelectedOrder({
          ...updatedOrder,
          status: 'Shipped',
          updatedAt: now,
          fulfillment: {
            weight: fulfillmentData.weight ? Number(fulfillmentData.weight) : undefined,
            boxSize: fulfillmentData.boxSize,
            carrier: fulfillmentData.carrier,
            trackingNumber: fulfillmentData.trackingNumber,
            shippedDate: now,
          },
          timeline: [...updatedOrder.timeline, newTimelineEvent],
        });
      }
    }

    setToast({
      message: 'Order fulfilled successfully!',
      type: 'success',
    });

    setShowFulfillmentModal(false);
    setOrderToFulfill(null);
  };

  const handleAddNote = (orderId: string, noteText: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      text: noteText,
      timestamp: new Date(),
      author: 'Current User',
    };

    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            notes: [...order.notes, newNote],
          };
        }
        return order;
      })
    );

    if (selectedOrder?.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        notes: [...selectedOrder.notes, newNote],
      });
    }

    setToast({
      message: 'Note added successfully!',
      type: 'success',
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (newFilters: OrderFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <Layout>
      {currentView === 'dashboard' && (
        <>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
            <p className="text-gray-600">
              Showing {filteredAndSortedOrders.length} order
              {filteredAndSortedOrders.length !== 1 ? 's' : ''}
            </p>
          </div>

          <OrderFilters filters={filters} onFilterChange={handleFilterChange} />

          <OrderTable
            orders={paginatedOrders}
            onOrderClick={handleOrderClick}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSort={handleSort}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {currentView === 'detail' && selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onBack={handleBackToDashboard}
          onFulfillOrder={handleFulfillOrder}
          onAddNote={handleAddNote}
        />
      )}

      {showFulfillmentModal && orderToFulfill && (
        <FulfillmentModal
          order={orderToFulfill}
          onClose={() => {
            setShowFulfillmentModal(false);
            setOrderToFulfill(null);
          }}
          onSubmit={handleFulfillmentSubmit}
        />
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </Layout>
  );
}

export default App;
