
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { TrendingUp, Clock, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

const data = [
  { name: 'Onboarding', avgTime: 120, target: 140, compliance: 98 },
  { name: 'Refunds', avgTime: 45, target: 60, compliance: 92 },
  { name: 'Incident', avgTime: 200, target: 180, compliance: 85 },
  { name: 'Payroll', avgTime: 300, target: 300, compliance: 100 },
  { name: 'Audit', avgTime: 400, target: 450, compliance: 99 },
];

const trendData = [
  { day: 'Mon', executions: 4 },
  { day: 'Tue', executions: 7 },
  { day: 'Wed', executions: 12 },
  { day: 'Thu', executions: 9 },
  { day: 'Fri', executions: 15 },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
       <div className="flex justify-between items-center">
         <div>
            <h1 className="text-3xl font-bold text-slate-900">System Status</h1>
            <p className="text-slate-500 mt-1">These are the processes currently protecting your business.</p>
         </div>
         <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium">Export Report</button>
       </div>

       {/* AI Insight Header */}
       <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-xl shadow-lg border border-slate-700">
          <div className="flex items-start gap-4">
             <div className="w-10 h-10 bg-gold-500 rounded-lg flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-slate-900" />
             </div>
             <div>
                <h3 className="font-bold text-lg text-gold-400 mb-1">AI Operational Insight</h3>
                <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
                   Based on this week's data, your <strong>Incident Response</strong> protocol is deviating 15% from the target time. 
                   The delay correlates with the "Legal Review" step. Consider automating the initial notification to Legal to save ~20 minutes per execution.
                </p>
             </div>
          </div>
       </div>

       {/* Key Metrics */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 text-sm font-medium">Active Protocols</span>
                <TrendingUp className="h-5 w-5 text-green-500" />
             </div>
             <div className="text-3xl font-bold text-slate-900">14</div>
             <div className="text-xs text-green-600 mt-2 font-medium">+2 this week</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 text-sm font-medium">Avg Completion Time</span>
                <Clock className="h-5 w-5 text-gold-500" />
             </div>
             <div className="text-3xl font-bold text-slate-900">-18%</div>
             <div className="text-xs text-gold-600 mt-2 font-medium">vs Industry Benchmark</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 text-sm font-medium">Compliance Rate</span>
                <CheckCircle className="h-5 w-5 text-purple-500" />
             </div>
             <div className="text-3xl font-bold text-slate-900">98.2%</div>
             <div className="text-xs text-slate-400 mt-2 font-medium">Last 30 days</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 text-sm font-medium">Risk Flags</span>
                <AlertTriangle className="h-5 w-5 text-amber-500" />
             </div>
             <div className="text-3xl font-bold text-slate-900">3</div>
             <div className="text-xs text-amber-600 mt-2 font-medium">Requires Attention</div>
          </div>
       </div>

       {/* Charts */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="text-lg font-bold text-slate-900 mb-6">Process Speed vs Benchmark (mins)</h3>
             <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={data} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                      <XAxis type="number" stroke="#64748b" fontSize={12} />
                      <YAxis dataKey="name" type="category" width={100} stroke="#64748b" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        cursor={{ fill: '#f1f5f9' }}
                      />
                      <Bar dataKey="avgTime" name="Your Time" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} />
                      <Bar dataKey="target" name="Industry Avg" fill="#94a3b8" radius={[0, 4, 4, 0]} barSize={20} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="text-lg font-bold text-slate-900 mb-6">Execution Volume (This Week)</h3>
             <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip 
                         contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      />
                      <Line type="monotone" dataKey="executions" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} />
                   </LineChart>
                </ResponsiveContainer>
             </div>
          </div>
       </div>
    </div>
  );
};
