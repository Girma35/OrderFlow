
import React, { useState } from 'react';
import { Plugin, PluginStatus } from '../types';
// Added Settings and Puzzle to imports
import { Download, CheckCircle2, Play, Pause, Trash2, Code2, Settings, Puzzle } from 'lucide-react';

const initialPlugins: Plugin[] = [
  {
    id: 'p-001',
    name: 'Advanced Fraud Detection',
    version: '2.4.1',
    author: 'Motia Security',
    hooks: ['beforePayment', 'onOrderCreated'],
    status: PluginStatus.ACTIVE,
    description: 'Real-time transaction analysis with merchant-defined risk scoring.'
  },
  {
    id: 'p-002',
    name: 'FedEx SmartShip Integration',
    version: '1.0.5',
    author: 'FedEx Corp',
    hooks: ['afterFulfillment', 'onOrderShipped'],
    status: PluginStatus.INACTIVE,
    description: 'Direct integration for automated label generation and tracking updates.'
  },
  {
    id: 'p-003',
    name: 'Custom White-Label Invoicing',
    version: '3.1.0',
    author: 'DesignTeam',
    hooks: ['beforeFulfillment'],
    status: PluginStatus.ACTIVE,
    description: 'Inject dynamic merchant branding into PDF invoices automatically.'
  },
  {
    id: 'p-004',
    name: '3PL Webhook Dispatcher',
    version: '0.9.0-beta',
    author: 'Logistics Pro',
    hooks: ['onOrderCreated'],
    status: PluginStatus.SANDBOXED,
    description: 'Route orders directly to third-party logistics endpoints securely.'
  }
];

const PluginMarketplace: React.FC = () => {
  const [plugins, setPlugins] = useState<Plugin[]>(initialPlugins);

  const toggleStatus = (id: string) => {
    setPlugins(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: p.status === PluginStatus.ACTIVE ? PluginStatus.INACTIVE : PluginStatus.ACTIVE
        };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Plugin Engine</h1>
          <p className="text-slate-500">Extend the order processor with hot-swappable sandboxed modules.</p>
        </div>
        <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2">
          <Download size={16} />
          Register New Plugin
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {plugins.map((plugin) => (
          <div key={plugin.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col hover:border-slate-300 transition-all shadow-sm">
            <div className="p-6 flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                    <Code2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{plugin.name}</h3>
                    <p className="text-xs text-slate-500">v{plugin.version} by {plugin.author}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${plugin.status === PluginStatus.ACTIVE ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    plugin.status === PluginStatus.INACTIVE ? 'bg-slate-50 text-slate-500 border-slate-100' :
                      'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                  {plugin.status}
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-6 line-clamp-2">{plugin.description}</p>

              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-400 uppercase">Subscribed Hooks</p>
                <div className="flex flex-wrap gap-2">
                  {plugin.hooks.map(hook => (
                    <span key={hook} className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded border border-slate-200">
                      {hook}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleStatus(plugin.id)}
                  className={`p-2 rounded-md transition-colors ${plugin.status === PluginStatus.ACTIVE
                      ? 'text-amber-600 hover:bg-amber-100'
                      : 'text-emerald-600 hover:bg-emerald-100'
                    }`}
                  title={plugin.status === PluginStatus.ACTIVE ? 'Pause Plugin' : 'Resume Plugin'}
                >
                  {plugin.status === PluginStatus.ACTIVE ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-md transition-colors">
                  <Settings size={18} />
                </button>
              </div>
              <button className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1">
                <Trash2 size={14} />
                Uninstall
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 text-white p-8 rounded-2xl relative overflow-hidden group">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <CheckCircle2 className="text-blue-400" />
              Developer Sandbox Active
            </h2>
            <p className="text-slate-400 text-sm">
              The hot-swapping engine ensures that plugins execute in a separate context. A crash in "3PL Dispatcher" will not affect the main Order Processor pipeline.
            </p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg whitespace-nowrap">
            View Developer Portal
          </button>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          <Puzzle size={120} />
        </div>
      </div>
    </div>
  );
};

export default PluginMarketplace;
