
import React from 'react';
import { 
  TrendingUp, DollarSign, Activity, AlertTriangle, CheckCircle, 
  BarChart2, Award, Zap, ArrowUp, ArrowDown, Clock, Shield 
} from 'lucide-react';
import { SOPRevenueMetric, CreatorTier } from '../types';
import { Logo } from './Logo';

// Mock Data representing the Creator's Portfolio (Owned by Creator)
const MOCK_REVENUE_METRICS: SOPRevenueMetric[] = [
  {
    sopId: 'sop-001',
    title: 'Global Incident Response: Ransomware Containment',
    ownership: 'CREATOR_OWNED',
    executions: 842,
    executionWeight: 5, // High value
    grossAttributableRevenue: 15600.00,
    platformFee: 3120.00, // 20%
    netPayout: 12480.00, // 80%
    status: 'Payout Eligible'
  },
  {
    sopId: 'sop-002',
    title: 'SaaS Vendor Procurement',
    ownership: 'CREATOR_OWNED',
    executions: 2150,
    executionWeight: 3, // Medium value
    grossAttributableRevenue: 4300.00,
    platformFee: 860.00,
    netPayout: 3440.00,
    status: 'Payout Eligible'
  },
  {
    sopId: 'sop-003',
    title: 'Employee Offboarding',
    ownership: 'CREATOR_OWNED',
    executions: 530,
    executionWeight: 2, // Lower value
    grossAttributableRevenue: 850.00,
    platformFee: 170.00,
    netPayout: 680.00,
    status: 'Payout Eligible'
  }
];

export const CreatorDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const currentTier: CreatorTier = 'Verified Expert';
  const totalNetPayout = MOCK_REVENUE_METRICS.reduce((acc, curr) => acc + curr.netPayout, 0);
  const totalGross = MOCK_REVENUE_METRICS.reduce((acc, curr) => acc + curr.grossAttributableRevenue, 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white h-20 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
           <Logo light className="h-8 w-8" />
           <div className="h-8 w-px bg-slate-700"></div>
           <div>
              <h1 className="font-bold text-lg leading-none">Creator Economics</h1>
              <span className="text-xs text-slate-400">Revenue Intelligence & Payouts</span>
           </div>
        </div>
        <button onClick={onBack} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
           Exit to App
        </button>
      </header>

      <div className="max-w-7xl mx-auto p-8 space-y-8">
         
         {/* Top Stats Row */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Net Payout Card */}
            <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-xl p-6 text-white shadow-xl relative overflow-hidden col-span-2">
               <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign className="w-24 h-24" /></div>
               <p className="text-xs text-emerald-300 font-bold uppercase tracking-wider mb-2">Net Creator Payout (80%)</p>
               <h2 className="text-4xl font-bold mb-1">${totalNetPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
               <div className="flex items-center gap-2 text-sm text-emerald-200 mt-2">
                  <ArrowUp className="w-4 h-4" />
                  <span>Eligible for payout on Oct 31</span>
               </div>
            </div>

            {/* Execution Volume */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
               <div className="flex justify-between items-start mb-2">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Executions</p>
                  <Activity className="w-5 h-5 text-blue-600 bg-blue-100 rounded-full p-1" />
               </div>
               <h2 className="text-3xl font-bold text-slate-900">{MOCK_REVENUE_METRICS.reduce((a,c) => a + c.executions, 0).toLocaleString()}</h2>
               <p className="text-xs text-slate-500 mt-1">
                  Valid executions across all owned SOPs.
               </p>
            </div>

            {/* Gross Revenue Reference */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
               <div className="flex justify-between items-start mb-2">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Gross Attributable</p>
                  <BarChart2 className="w-5 h-5 text-slate-600 bg-slate-100 rounded-full p-1" />
               </div>
               <h2 className="text-3xl font-bold text-slate-900">${totalGross.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
               <div className="mt-2 text-[10px] text-slate-400 border-t border-slate-100 pt-2">
                  Platform Fee (20%): -${(totalGross * 0.20).toLocaleString(undefined, { maximumFractionDigits: 0 })}
               </div>
            </div>
         </div>

         {/* Formula Explanation */}
         <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-xs text-blue-800 flex flex-wrap gap-4 items-center justify-center shadow-sm">
            <span className="font-bold uppercase tracking-wider text-blue-900">Revenue Logic:</span>
            <span className="bg-white px-3 py-1.5 rounded border border-blue-200 font-mono text-slate-600">Executions × Weight</span>
            <span>=</span>
            <span className="bg-white px-3 py-1.5 rounded border border-blue-200 font-mono font-bold text-slate-800">Gross Revenue</span>
            <span>→</span>
            <span className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded border border-emerald-200 font-bold font-mono">80% Creator</span>
            <span>+</span>
            <span className="bg-slate-200 text-slate-600 px-3 py-1.5 rounded border border-slate-300 font-mono">20% Protocolly</span>
         </div>

         {/* Detailed SOP Table */}
         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
               <h3 className="font-bold text-slate-900 text-lg">Execution Performance</h3>
               <button className="text-xs font-bold text-slate-500 hover:text-slate-900">Download CSV</button>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold border-b border-slate-200">
                     <tr>
                        <th className="px-6 py-4">Protocol</th>
                        <th className="px-6 py-4 text-center">Weight</th>
                        <th className="px-6 py-4 text-center">Executions</th>
                        <th className="px-6 py-4 text-right">Gross Rev</th>
                        <th className="px-6 py-4 text-right text-red-400">Fee (20%)</th>
                        <th className="px-6 py-4 text-right text-emerald-700">Net Payout (80%)</th>
                        <th className="px-6 py-4 text-center">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {MOCK_REVENUE_METRICS.map(sop => (
                        <tr key={sop.sopId} className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4">
                              <p className="font-bold text-slate-900">{sop.title}</p>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {sop.sopId.toUpperCase()}</p>
                           </td>
                           <td className="px-6 py-4 text-center">
                              <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-bold">
                                 <Zap className="w-3 h-3 mr-1 text-gold-500" /> {sop.executionWeight}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-center font-mono text-slate-600">
                              {sop.executions.toLocaleString()}
                           </td>
                           <td className="px-6 py-4 text-right font-mono text-slate-500">
                              ${sop.grossAttributableRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                           </td>
                           <td className="px-6 py-4 text-right font-mono text-red-400 text-xs">
                              -${sop.platformFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                           </td>
                           <td className="px-6 py-4 text-right font-bold text-emerald-700 font-mono text-base">
                              ${sop.netPayout.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                           </td>
                           <td className="px-6 py-4 text-center">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                                 {sop.status}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                     <tr>
                        <td colSpan={3} className="px-6 py-4 text-right text-slate-500 uppercase text-xs tracking-wider">Totals</td>
                        <td className="px-6 py-4 text-right font-mono text-slate-900">${totalGross.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right font-mono text-red-400">-${(totalGross * 0.2).toLocaleString()}</td>
                        <td className="px-6 py-4 text-right font-mono text-emerald-700 text-lg">${totalNetPayout.toLocaleString()}</td>
                        <td></td>
                     </tr>
                  </tfoot>
               </table>
            </div>
         </div>

         {/* Education / Upsell */}
         <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-xl p-6 text-white border border-slate-700">
               <h3 className="font-bold text-lg mb-2 flex items-center text-gold-500"><Shield className="w-5 h-5 mr-2" /> Compliance Note</h3>
               <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                  Payouts are processed on the 31st of each month. To ensure eligibility, all SOPs must maintain a <strong className="text-white">Active</strong> status and pass random quality audits.
               </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-slate-200">
               <h3 className="font-bold text-lg mb-2 text-slate-900">Increase your Weight</h3>
               <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center"><ArrowUp className="w-4 h-4 text-green-500 mr-2" /> Add more decision logic nodes.</li>
                  <li className="flex items-center"><ArrowUp className="w-4 h-4 text-green-500 mr-2" /> Link to other high-value protocols.</li>
                  <li className="flex items-center"><ArrowUp className="w-4 h-4 text-green-500 mr-2" /> Implement rigorous error handling steps.</li>
               </ul>
            </div>
         </div>

      </div>
    </div>
  );
};
