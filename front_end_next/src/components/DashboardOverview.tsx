
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
// Added Activity to imports
import { TrendingUp, Users, Zap, ShieldCheck, Activity } from 'lucide-react';

const data = [
  { name: '00:00', requests: 400, errors: 24, latency: 120 },
  { name: '04:00', requests: 300, errors: 18, latency: 135 },
  { name: '08:00', requests: 800, errors: 45, latency: 150 },
  { name: '12:00', requests: 1200, errors: 60, latency: 190 },
  { name: '16:00', requests: 1000, errors: 32, latency: 140 },
  { name: '20:00', requests: 700, errors: 28, latency: 110 },
  { name: '23:59', requests: 500, errors: 20, latency: 115 },
];

const stats = [
  { label: 'Platform Health', value: '99.98%', icon: ShieldCheck, color: 'text-emerald-600', trend: '+0.02%' },
  { label: 'Active Store Tenants', value: '2,840', icon: Users, color: 'text-blue-600', trend: '+124 today' },
  { label: 'API Throughput', value: '18.4k rpm', icon: Zap, color: 'text-amber-500', trend: 'Peak: 24k' },
  { label: 'Successful Transactions', value: '$4.2M', icon: TrendingUp, color: 'text-indigo-600', trend: '+14% WoW' },
];

const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Pulse</h1>
        <p className="text-slate-500">Global real-time observability across all isolated merchant clusters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-slate-50 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                {stat.trend}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Traffic Distribution</h2>
            <select className="text-sm border border-slate-200 rounded px-2 py-1 outline-none">
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="requests" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRequests)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">System Latency (ms)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="latency" fill="#0f172a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold">Anomalous Activity (Global Security)</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                  <Activity size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Rate limit reached for Store: X-ID-9922</p>
                  <p className="text-xs text-slate-500">Tier: Professional | Peak Requests: 2,400/min</p>
                </div>
              </div>
              <span className="text-xs text-slate-400">14m ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
