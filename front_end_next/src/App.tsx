import { useState, useEffect, useRef } from 'react';
import { ShoppingCart } from 'lucide-react';
import DarkModeToggle from './components/DarkModeToggle';
import Footer from './components/Footer';
import NotificationPopup, { Notification } from './components/NotificationPopup';
import OrderFormPage from './pages/OrderFormPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import DashboardPage from './pages/DashboardPage';
import { submitOrder, fetchAlerts } from './utils/api';
import { LayoutDashboard, Send, MapPin } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'submission' | 'tracking' | 'dashboard'>('submission');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const seenIds = useRef<Set<string>>(new Set());

  // Poll for notifications
  useEffect(() => {
    const pollNotifications = async () => {
      try {
        const alerts = await fetchAlerts();
        if (alerts && alerts.length > 0) {
          const now = Date.now();

          setNotifications(prev => {
            // Filter for alerts we haven't seen in this session AND are relatively recent (last 30s)
            // or if they are "sticky" type alerts.
            const newAlerts = (alerts as Notification[]).filter(alert => {
              const isNew = !seenIds.current.has(alert.id);
              // If it has a timestamp, check if it's recent (within 30 seconds)
              // This prevents old mock/stored alerts from popping up every time you refresh or after long idle
              const alertTime = alert.timestamp ? new Date(alert.timestamp).getTime() : now;
              const isRecent = (now - alertTime) < 30000;

              return isNew && isRecent;
            });

            if (newAlerts.length === 0) return prev;

            // Mark as seen immediately
            newAlerts.forEach(alert => seenIds.current.add(alert.id));

            // Set up auto-dismiss for the UI
            newAlerts.forEach(alert => {
              setTimeout(() => {
                setNotifications(current => current.filter(n => n.id !== alert.id));
              }, 5000);
            });

            return [...prev, ...newAlerts].slice(-5); // Keep last 5
          });
        }
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };

    // Poll less frequently to reduce server load
    const interval = setInterval(pollNotifications, 10000); // Changed from 3s to 10s
    pollNotifications();
    return () => clearInterval(interval);
  }, []);

  const handleOrderSubmission = async (payload: any) => {
    setLoading(true);
    setError(null);

    const result = await submitOrder(payload);

    if (result.success) {
      setOrderData(payload);
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
    <div className="min-h-screen px-4 py-10 sm:py-16 premium-gradient aurora-grid flex flex-col items-center justify-center transition-all duration-700">

      {/* Notification Layer */}
      <NotificationPopup
        notifications={notifications}
        onClose={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
      />

      <div className={`w-full ${view === 'dashboard' ? 'max-w-6xl' : 'max-w-xl'} glass-panel p-6 sm:p-10 rounded-[2.5rem] relative overflow-hidden group transition-all duration-500`}>
        <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        <div className="absolute -top-32 -right-16 w-64 h-64 bg-blue-500/20 rounded-full blur-[120px]"></div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/40">
              <ShoppingCart size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter font-outfit uppercase">
                Motia<span className="text-blue-600">.</span>
              </h1>
              <p className="text-xs uppercase tracking-[0.4em] text-gray-400 mt-1">Order Intelligence Surface</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100/60 dark:bg-gray-800/60 p-1.5 rounded-2xl">
              <button
                onClick={() => setView('submission')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide ${view === 'submission' ? 'bg-white dark:bg-gray-700 shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Send size={18} />
                Submit
              </button>
              <button
                onClick={() => setView('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide ${view === 'dashboard' ? 'bg-white dark:bg-gray-700 shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <LayoutDashboard size={18} />
                Overview
              </button>
              {orderId && (
                <button
                  onClick={() => setView('tracking')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide ${view === 'tracking' ? 'bg-white dark:bg-gray-700 shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <MapPin size={18} />
                  Track
                </button>
              )}
            </div>
            <DarkModeToggle />
          </div>
        </div>

        <main className="relative z-10">
          {view === 'submission' && (
            <OrderFormPage 
              onOrderSubmitted={handleOrderSubmission} 
              isLoading={loading}
              onNavigateToDashboard={() => setView('dashboard')}
            />
          )}
          {view === 'tracking' && (
            <OrderTrackingPage 
              orderId={orderId!} 
              formData={orderData} 
              onReset={reset}
              onNavigateToDashboard={() => setView('dashboard')}
            />
          )}
          {view === 'dashboard' && (
            <DashboardPage />
          )}

          {error && (
            <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-xl text-center font-medium animate-bounce-subtle">
              {error}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}