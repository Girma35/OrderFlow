import React from 'react';
import { OrderWorkflowStep } from '../types';
import { ArrowRight, Lock, Check, Clock, ToggleLeft, ToggleRight } from 'lucide-react';

const sagaSteps: OrderWorkflowStep[] = [
  { id: '1', label: 'API Intake', status: 'completed', description: 'Tenant verification via X-Store-ID' },
  { id: '2', label: 'Payment Auth', status: 'current', description: 'Stripe/PayPal capture logic' },
  { id: '3', label: 'Fraud Detection', status: 'paused', description: 'Plugin override: Waiting for manual verification' },
  { id: '4', label: 'Inventory Reservation', status: 'pending', description: 'Deduct stock levels' },
  { id: '5', label: 'Fulfillment Dispatch', status: 'pending', description: 'Carrier label generation' },
  { id: '6', label: 'Post-Sale CRM', status: 'pending', description: 'Fire outbound webhooks' },
];

const WorkflowBuilder: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Saga Orchestration</h1>
          <p className="text-slate-500">The state machine governing headless fulfillment logic.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
          <button className="px-3 py-1.5 text-xs font-semibold bg-slate-100 rounded">Design View</button>
          <button className="px-3 py-1.5 text-xs font-semibold text-slate-500">Raw JSON</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-400">Merchant Overrides</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Fraud Detection</span>
                <ToggleRight className="text-blue-600 cursor-pointer" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">3PL Direct Notify</span>
                <ToggleLeft className="text-slate-300 cursor-pointer" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Carrier Auto-Select</span>
                <ToggleRight className="text-blue-600 cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
            <h3 className="text-blue-900 font-semibold text-sm mb-2 flex items-center gap-2">
              <Lock size={14} />
              Idempotency Locked
            </h3>
            <p className="text-blue-700 text-xs leading-relaxed">
              Every step is protected by the Idempotency-Key engine. Double-charging is mathematically impossible within this workflow.
            </p>
          </div>
        </div>

        {/* Workflow Visualization */}
        <div className="lg:col-span-3 space-y-4">
          {sagaSteps.map((step, idx) => (
            <div key={step.id} className="relative">
              {idx !== sagaSteps.length - 1 && (
                <div className="absolute left-6 top-12 bottom-[-16px] w-0.5 bg-slate-200" />
              )}
              <div className={`
                flex items-start gap-4 p-5 rounded-xl border transition-all
                ${step.status === 'completed' ? 'bg-emerald-50 border-emerald-100' :
                  step.status === 'current' ? 'bg-white border-blue-200 ring-2 ring-blue-100' :
                    step.status === 'paused' ? 'bg-amber-50 border-amber-100' :
                      'bg-white border-slate-200 opacity-60'}
              `}>
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center shrink-0
                  ${step.status === 'completed' ? 'bg-emerald-500 text-white' :
                    step.status === 'current' ? 'bg-blue-500 text-white animate-pulse' :
                      step.status === 'paused' ? 'bg-amber-500 text-white' :
                        'bg-slate-100 text-slate-400'}
                `}>
                  {step.status === 'completed' && <Check size={20} />}
                  {step.status === 'current' && <ArrowRight size={20} />}
                  {step.status === 'paused' && <Clock size={20} />}
                  {step.status === 'pending' && <span className="text-sm font-bold">{idx + 1}</span>}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-slate-900">{step.label}</h3>
                    {step.status === 'paused' && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full uppercase tracking-tight">
                        Awaiting Plugin response
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">{step.description}</p>
                </div>
                {step.status === 'current' && (
                  <button className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-md hover:bg-black">
                    Live Logs
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
