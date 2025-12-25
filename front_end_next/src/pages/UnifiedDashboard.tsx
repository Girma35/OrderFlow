import { useState } from 'react';
import {
    LayoutDashboard,
    Workflow,
    Shield,
    Puzzle,
    Store,
    Sparkles
} from 'lucide-react';
import DashboardOverview from '../components/DashboardOverview';
import WorkflowBuilder from '../components/WorkflowBuilder';
import APIMonitor from '../components/APIMonitor';
import PluginMarketplace from '../components/PluginMarketplace';
import StoreManager from '../components/StoreManager';

type TabId = 'overview' | 'workflow' | 'api' | 'plugins' | 'stores';

interface Tab {
    id: TabId;
    label: string;
    icon: React.ElementType;
    component: React.ComponentType;
    description: string;
}

const tabs: Tab[] = [
    {
        id: 'overview',
        label: 'System Pulse',
        icon: LayoutDashboard,
        component: DashboardOverview,
        description: 'Real-time platform metrics and traffic analytics'
    },
    {
        id: 'workflow',
        label: 'Saga Engine',
        icon: Workflow,
        component: WorkflowBuilder,
        description: 'Order orchestration state machine'
    },
    {
        id: 'api',
        label: 'Integrity',
        icon: Shield,
        component: APIMonitor,
        description: 'Idempotency and webhook monitoring'
    },
    {
        id: 'plugins',
        label: 'Plugins',
        icon: Puzzle,
        component: PluginMarketplace,
        description: 'Hot-swappable extension modules'
    },
    {
        id: 'stores',
        label: 'Tenants',
        icon: Store,
        component: StoreManager,
        description: 'Multi-tenant isolation management'
    }
];

export default function UnifiedDashboard() {
    const [activeTab, setActiveTab] = useState<TabId>('overview');

    const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || DashboardOverview;

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <Sparkles className="text-blue-600" size={24} />
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                        Command Center
                    </h1>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-3xl">
                    Unified control plane for headless order processing, multi-tenant orchestration, and real-time observability.
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="glass-panel rounded-2xl p-2 overflow-x-auto">
                <div className="flex gap-2 min-w-max">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    group relative flex items-center gap-3 px-5 py-3.5 rounded-xl
                                    transition-all duration-300 min-w-[180px]
                                    ${isActive
                                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                                        : 'bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md'
                                    }
                                `}
                            >
                                <div className={`
                                    p-2 rounded-lg transition-all
                                    ${isActive
                                        ? 'bg-white/20'
                                        : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20'
                                    }
                                `}>
                                    <Icon size={18} className={isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600'} />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className={`text-sm font-bold ${isActive ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                        {tab.label}
                                    </p>
                                    <p className={`text-[10px] ${isActive ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {tab.description}
                                    </p>
                                </div>
                                {isActive && (
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Active Tab Content */}
            <div className="min-h-[600px]">
                <ActiveComponent />
            </div>

            {/* Footer Info */}
            <div className="glass-panel rounded-2xl p-6 border border-blue-100 dark:border-blue-900/30">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl">
                        <Shield className="text-blue-600" size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                            Enterprise-Grade Architecture
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            This platform leverages event-driven sagas, state machine orchestration, and isolated tenant contexts
                            to provide a robust, scalable order processing infrastructure. Every component is designed for
                            high availability, exactly-once semantics, and horizontal scalability.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
