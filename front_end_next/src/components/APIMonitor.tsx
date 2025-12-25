
import React from 'react';
import { WebhookLog } from '../types';
import { Shield, RefreshCw, Terminal, CheckCircle } from 'lucide-react';

const mockLogs: WebhookLog[] = [
  { id: 'evt_101', event: 'order.created', status: 200, timestamp: '14:20:11', duration: '45ms' },
  { id: 'evt_102', event: 'payment.verified', status: 200, timestamp: '14:20:15', duration: '120ms' },
  { id: 'evt_103', event: 'inventory.deducted', status: 500, timestamp: '14:21:00', duration: '3200ms' },
  { id: 'evt_104', event: 'order.created', status: 200, timestamp: '14:22:10', duration: '51ms' },
];

const APIMonitor: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Integrity & Reliability</h1>
        <p className="text-slate-500 italic font-medium">"Exactly-Once" processing logic for financial safety.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Idempotency Engine Stats */}
        <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative shadow-2xl">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                <Shield size={24} />
              </div>
              <h3 className="text-lg font-bold">Idempotency-Key Engine</h3>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Duplicate Attempts Blocked</p>
                  <h4 className="text-3xl font-bold mt-1">42,891</h4>
                </div>
                <div className="text-xs text-blue-400 font-semibold bg-blue-400/10 px-2 py-1 rounded">
                  +1.2% this hour
                </div>
              </div>

              <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Integrity Confidence</p>
                  <h4 className="text-3xl font-bold mt-1">100.0%</h4>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 text-xs uppercase font-bold tracking-tighter">
                  <CheckCircle size={12} /> Verified
                </div>
              </div>
            </div>

            <p className="mt-8 text-sm text-slate-400 leading-relaxed">
              Every merchant request requires a unique <code>Idempotency-Key</code> header.
              The engine automatically detects retries and returns the original cached response,
              preventing duplicate billing across the event bus.
            </p>
          </div>
          <div className="absolute -bottom-12 -right-12 text-blue-500/5 rotate-12">
            <Shield size={240} />
          </div>
        </div>

        {/* Live Event Stream */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-slate-400" />
              <span className="text-sm font-bold uppercase tracking-wider text-slate-500">Live Webhook Dispatcher</span>
            </div>
            <button className="p-1 hover:bg-slate-200 rounded text-slate-400 transition-colors">
              <RefreshCw size={14} />
            </button>
          </div>
          <div className="flex-1 font-mono text-xs p-4 space-y-3 bg-slate-50 overflow-y-auto max-h-[350px]">
            {mockLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-4">
                <span className="text-slate-400">[{log.timestamp}]</span>
                <span className="text-blue-600 font-bold">{log.event}</span>
                <span className={`font-bold ${log.status === 200 ? 'text-emerald-600' : 'text-red-500'}`}>
                  HTTP {log.status}
                </span>
                <span className="text-slate-400 ml-auto">{log.duration}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 text-slate-400 italic mt-4 animate-pulse">
              <span>_</span>
              <span>Waiting for events...</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex items-start gap-4">
        <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center shrink-0 text-amber-700">
          <RefreshCw size={20} />
        </div>
        <div>
          <h4 className="font-bold text-amber-900 mb-1">Retry & Recovery Strategy</h4>
          <p className="text-sm text-amber-700 leading-relaxed">
            When a merchant endpoint fails (e.g. HTTP 500), the <code>webhook.dispatcher</code> enters an exponential backoff state for that specific Store-ID. This maintains system stability while providing eventual consistency for downstream merchant data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default APIMonitor;
