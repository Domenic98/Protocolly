
import React, { useState } from 'react';
import { Check, Star, Shield, Zap, Building2, Crown, ArrowRight, Activity, Users, Lock, Server, Eye, Command, ArrowLeft, Calendar, Tag } from 'lucide-react';
import { Logo } from './Logo';

interface PricingSelectionProps {
  onSelect: (tier: string, price: number, cycle: string) => void;
  onBack?: () => void; 
}

type BillingCycle = 'Monthly' | 'Quarterly' | 'Yearly' | '24 Months';

export const PricingSelection: React.FC<PricingSelectionProps> = ({ onSelect, onBack }) => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('Monthly');

  const getDiscount = (cycle: BillingCycle) => {
    switch (cycle) {
      case 'Monthly': return 0;
      case 'Quarterly': return 0.10; // 10%
      case 'Yearly': return 0.20; // 20%
      case '24 Months': return 0.30; // 30%
      default: return 0;
    }
  };

  const calculatePrice = (basePrice: number) => {
    const discount = getDiscount(billingCycle);
    return basePrice * (1 - discount);
  };

  const getBadge = (cycle: BillingCycle) => {
    if (cycle === 'Monthly') return null;
    const discount = getDiscount(cycle) * 100;
    return <span className="ml-2 bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">Save {discount}%</span>;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative mb-12">
          <button 
            onClick={() => onBack ? onBack() : window.location.reload()} 
            className="absolute top-0 left-0 flex items-center text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>
          
          <div className="text-center pt-8 md:pt-0">
            <div className="flex justify-center mb-6">
              <Logo className="h-10 w-10" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Acquire Your Execution License</h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-8">
              Access is subscription-based. Because operational control only works when it’s continuous.
            </p>

            {/* Billing Cycle Selector */}
            <div className="inline-flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm mb-8 overflow-x-auto max-w-full">
              {(['Monthly', 'Quarterly', 'Yearly', '24 Months'] as BillingCycle[]).map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setBillingCycle(cycle)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center whitespace-nowrap ${
                    billingCycle === cycle
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {cycle}
                  {cycle === 'Yearly' && billingCycle !== 'Yearly' && <span className="ml-1 text-[10px] text-green-600 font-extrabold">-20%</span>}
                  {cycle === '24 Months' && billingCycle !== '24 Months' && <span className="ml-1 text-[10px] text-green-600 font-extrabold">-30%</span>}
                </button>
              ))}
            </div>
            <div className="text-xs text-slate-400 font-medium">
               Prices shown are per month, billed {billingCycle.toLowerCase()}.
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 items-stretch">
          
          {/* TIER 0: OBSERVER (Free) */}
          <div className="bg-slate-100 rounded-xl p-6 border-2 border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col opacity-80 hover:opacity-100">
             <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Observer</h3>
             </div>
             <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-slate-900">$0</span>
             </div>
             <p className="text-xs text-slate-500 mb-6 h-10">Evaluation Only.</p>
             <div className="mb-2 text-xs font-bold text-slate-900 uppercase">What you get:</div>
             <ul className="space-y-3 mb-8 flex-1 border-t border-slate-200 pt-4">
                <li className="flex items-start text-xs text-slate-600"><Check className="w-3 h-3 text-slate-400 mr-2 shrink-0" /> Free-Class SOPs Only</li>
                <li className="flex items-start text-xs text-slate-600"><Check className="w-3 h-3 text-slate-400 mr-2 shrink-0" /> 2 Executions / mo (Capped)</li>
             </ul>
             <button 
                onClick={() => onSelect('Observer', 0, 'Monthly')}
                className="w-full py-3 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-white transition-colors text-xs mt-auto"
             >
                Start Evaluation
             </button>
          </div>

          {/* TIER 1: OPERATOR */}
          <div className="bg-white rounded-xl p-6 border-2 border-emerald-500 shadow-md hover:shadow-xl transition-all flex flex-col transform hover:-translate-y-1">
             <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wide">Operator</h3>
                {getBadge(billingCycle)}
             </div>
             <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-slate-900">${calculatePrice(49).toFixed(0)}</span>
                <span className="text-slate-500 ml-1 text-xs">/mo</span>
             </div>
             <p className="text-xs text-slate-500 mb-6 h-10">For when individual execution must be tracked.</p>
             <div className="mb-2 text-xs font-bold text-slate-900 uppercase">Enforces:</div>
             <ul className="space-y-3 mb-8 flex-1 border-t border-emerald-100 pt-4">
                <li className="flex items-start text-xs text-slate-700"><Check className="w-3 h-3 text-emerald-500 mr-2 shrink-0" /> <strong>60 Executions</strong> / mo</li>
                <li className="flex items-start text-xs text-slate-700"><Check className="w-3 h-3 text-emerald-500 mr-2 shrink-0" /> Standard-Class SOP Access</li>
                <li className="flex items-start text-xs text-slate-700"><Check className="w-3 h-3 text-emerald-500 mr-2 shrink-0" /> AI Operator Assistance</li>
             </ul>
             <button 
                onClick={() => onSelect('Operator', calculatePrice(49), billingCycle)}
                className="w-full py-3 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold rounded-lg hover:bg-emerald-100 transition-colors text-xs mt-auto"
             >
                Request Operator Access
             </button>
          </div>

          {/* TIER 2: COMMANDER */}
          <div className="bg-white rounded-xl p-6 border-4 border-amber-400 shadow-xl flex flex-col relative transform md:-translate-y-2 z-10">
             <div className="flex items-center gap-2 mb-2">
                <Command className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-amber-700 uppercase tracking-wide">Commander</h3>
                {getBadge(billingCycle)}
             </div>
             <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-slate-900">${calculatePrice(149).toFixed(0)}</span>
                <span className="text-slate-500 ml-1 text-xs">/mo</span>
             </div>
             <p className="text-xs text-slate-500 mb-6 h-10">For when failure handling must be managed.</p>
             <div className="mb-2 text-xs font-bold text-slate-900 uppercase">Enforces:</div>
             <ul className="space-y-3 mb-8 flex-1 border-t border-amber-100 pt-4">
                <li className="flex items-start text-xs text-slate-800 font-medium"><Check className="w-3 h-3 text-amber-500 mr-2 shrink-0" /> 300 Executions / mo</li>
                <li className="flex items-start text-xs text-slate-800 font-medium"><Check className="w-3 h-3 text-amber-500 mr-2 shrink-0" /> 10 Team Seats</li>
                <li className="flex items-start text-xs text-slate-700"><Check className="w-3 h-3 text-amber-500 mr-2 shrink-0" /> High-Risk SOP Access</li>
                <li className="flex items-start text-xs text-slate-700"><Check className="w-3 h-3 text-amber-500 mr-2 shrink-0" /> Advanced Analytics</li>
             </ul>
             <button 
                onClick={() => onSelect('Commander', calculatePrice(149), billingCycle)}
                className="w-full py-3 bg-amber-400 text-slate-900 font-bold rounded-lg hover:bg-amber-500 transition-colors text-xs mt-auto shadow-md"
             >
                Request Command Access
             </button>
          </div>

          {/* TIER 3: AUTHORITY */}
          <div className="bg-white rounded-xl p-6 border-2 border-orange-500 shadow-md hover:shadow-xl transition-all flex flex-col transform hover:-translate-y-1">
             <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-orange-600" />
                <h3 className="text-sm font-bold text-orange-700 uppercase tracking-wide">Authority</h3>
                {getBadge(billingCycle)}
             </div>
             <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-slate-900">${calculatePrice(499).toFixed(0)}</span>
                <span className="text-slate-500 ml-1 text-xs">/mo</span>
             </div>
             <p className="text-xs text-slate-500 mb-6 h-10">For when consistency is critical at scale.</p>
             <div className="mb-2 text-xs font-bold text-slate-900 uppercase">Enforces:</div>
             <ul className="space-y-3 mb-8 flex-1 border-t border-orange-100 pt-4">
                <li className="flex items-start text-xs text-slate-700"><Check className="w-3 h-3 text-orange-500 mr-2 shrink-0" /> <strong>Unlimited</strong> Executions</li>
                <li className="flex items-start text-xs text-slate-700"><Check className="w-3 h-3 text-orange-500 mr-2 shrink-0" /> <strong>Unlimited</strong> Team Seats</li>
                <li className="flex items-start text-xs text-slate-700"><Check className="w-3 h-3 text-orange-500 mr-2 shrink-0" /> Priority Routing</li>
                <li className="flex items-start text-xs text-slate-700"><Check className="w-3 h-3 text-orange-500 mr-2 shrink-0" /> Forecasting AI</li>
             </ul>
             <button 
                onClick={() => onSelect('Authority', calculatePrice(499), billingCycle)}
                className="w-full py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors text-xs mt-auto"
             >
                Request Authority
             </button>
          </div>

          {/* TIER 4: SOVEREIGN */}
          <div className="bg-slate-900 rounded-xl p-6 border-2 border-red-700 shadow-xl flex flex-col">
             <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-red-500" />
                <h3 className="text-sm font-bold text-red-500 uppercase tracking-wide">Sovereign</h3>
             </div>
             <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-white">${calculatePrice(1499).toFixed(0)}</span>
                <span className="text-slate-400 ml-1 text-xs">/mo</span>
             </div>
             <p className="text-xs text-slate-400 mb-6 h-10">For when outcomes must be audit-proof.</p>
             <div className="mb-2 text-xs font-bold text-red-500 uppercase">Enforces:</div>
             <ul className="space-y-3 mb-8 flex-1 border-t border-slate-800 pt-4">
                <li className="flex items-start text-xs text-slate-300"><Check className="w-3 h-3 text-red-500 mr-2 shrink-0" /> <strong>Private Vault</strong></li>
                <li className="flex items-start text-xs text-slate-300"><Check className="w-3 h-3 text-red-500 mr-2 shrink-0" /> Custom Locking & Authoring</li>
                <li className="flex items-start text-xs text-slate-300"><Check className="w-3 h-3 text-red-500 mr-2 shrink-0" /> Full Audit Logs & Export</li>
                <li className="flex items-start text-xs text-slate-300"><Check className="w-3 h-3 text-red-500 mr-2 shrink-0" /> SSO & RBAC</li>
             </ul>
             <button 
                onClick={() => onSelect('Sovereign', calculatePrice(1499), billingCycle)}
                className="w-full py-3 border border-red-700 text-red-500 font-bold rounded-lg hover:bg-red-700 hover:text-white transition-colors text-xs mt-auto"
             >
                Discuss Deployment
             </button>
          </div>

        </div>
        
        <div className="mt-12 text-center border-t border-slate-200 pt-8">
             <p className="text-sm text-slate-500 font-medium">
                "One audit failure costs {'>'}$50,000. These licenses prevent that."
             </p>
        </div>
      </div>
    </div>
  );
};
