import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';

export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: number;
}

interface NotificationProps {
    notifications: Notification[];
    onClose: (id: string) => void;
}

const NotificationItem: React.FC<{ notification: Notification; onClose: () => void }> = ({ notification, onClose }) => {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const duration = 5000;
        const interval = 50;
        const step = (interval / duration) * 100;

        const timer = setInterval(() => {
            setProgress((prev) => Math.max(0, prev - step));
        }, interval);

        return () => clearInterval(timer);
    }, []);

    const getTypeStyles = () => {
        switch (notification.type) {
            case 'success':
                return {
                    icon: <CheckCircle className="text-emerald-500" size={20} />,
                    bg: 'bg-emerald-500/10',
                    border: 'border-emerald-500/20',
                    progress: 'bg-emerald-500'
                };
            case 'error':
                return {
                    icon: <XCircle className="text-rose-500" size={20} />,
                    bg: 'bg-rose-500/10',
                    border: 'border-rose-500/20',
                    progress: 'bg-rose-500'
                };
            case 'warning':
                return {
                    icon: <AlertCircle className="text-amber-500" size={20} />,
                    bg: 'bg-amber-500/10',
                    border: 'border-amber-500/20',
                    progress: 'bg-amber-500'
                };
            default:
                return {
                    icon: <Info className="text-blue-500" size={20} />,
                    bg: 'bg-blue-500/10',
                    border: 'border-blue-500/20',
                    progress: 'bg-blue-500'
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div className="group relative w-full max-w-sm animate-in fade-in slide-in-from-right-8 duration-500 pointer-events-auto">
            <div className={`overflow-hidden glass-panel rounded-2xl border ${styles.border} shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]`}>
                <div className="p-4 flex gap-4">
                    <div className={`shrink-0 p-2.5 rounded-xl ${styles.bg} h-fit`}>
                        {styles.icon}
                    </div>

                    <div className="flex-1 min-w-0 pr-4">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm tracking-tight">
                            {notification.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                            {notification.message}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg h-fit"
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100 dark:bg-white/5">
                    <div
                        className={`h-full transition-all duration-75 ease-linear ${styles.progress} opacity-60`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

const NotificationPopup: React.FC<NotificationProps> = ({ notifications, onClose }) => {
    return (
        <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-sm items-end">
            {notifications.map((notif) => (
                <NotificationItem
                    key={notif.id}
                    notification={notif}
                    onClose={() => onClose(notif.id)}
                />
            ))}
        </div>
    );
};

export default NotificationPopup;
