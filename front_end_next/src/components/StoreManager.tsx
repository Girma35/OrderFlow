
import React from 'react';
import { Store as StoreType } from '../types';
import { Filter, ExternalLink } from 'lucide-react';

const mockStores: StoreType[] = [
  { id: 'X-ID-101', name: 'Vintage Kicks', status: 'Healthy', activePlugins: 4, dailyRevenue: 12400, throughput: 120 },
  { id: 'X-ID-204', name: 'Luxe Aesthetics', status: 'Healthy', activePlugins: 7, dailyRevenue: 54000, throughput: 450 },
  { id: 'X-ID-882', name: 'TechNode Emporium', status: 'Throttled', activePlugins: 3, dailyRevenue: 8200, throughput: 890 },
  { id: 'X-ID-441', name: 'EcoWare Solutions', status: 'Healthy', activePlugins: 5, dailyRevenue: 15100, throughput: 85 },
  { id: 'X-ID-092', name: 'Swift Essentials', status: 'Warning', activePlugins: 2, dailyRevenue: 3200, throughput: 40 },
];

const StoreManager: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Merchant Isolation</h1>
          <p className="text-slate-500">State Groups partition paths: /artifacts/appId/data/storeId</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-md hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Filter size={16} /> Filter
          </button>
          <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors">
            Provision New Tenant
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Merchant / ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Health Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-center">Plugins</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Revenue (24h)</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Throughput</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockStores.map((store) => (
                <tr key={store.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{store.name}</span>
                      <span className="text-xs text-slate-400 font-mono">{store.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${store.status === 'Healthy' ? 'bg-emerald-500' :
                        store.status === 'Throttled' ? 'bg-amber-500' : 'bg-red-500'
                        }`} />
                      <span className="text-sm font-medium text-slate-700">{store.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                      {store.activePlugins} active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    ${store.dailyRevenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-32">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-slate-500">{store.throughput} rpm</span>
                      </div>
                      <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${store.status === 'Throttled' ? 'bg-amber-500' : 'bg-blue-500'}`}
                          style={{ width: `${Math.min((store.throughput / 1000) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                      <ExternalLink size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <p className="text-xs text-slate-500 italic">Showing 5 of 2,840 isolated merchant clusters.</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs border border-slate-200 rounded bg-white hover:bg-slate-50 transition-colors">Prev</button>
            <button className="px-3 py-1 text-xs border border-slate-200 rounded bg-white hover:bg-slate-50 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreManager;
