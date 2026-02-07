
import React, { useState } from 'react';
import { 
  Shield, Lock, FileText, Activity, Users, Search, 
  Settings, Briefcase, ChevronRight, CheckCircle, 
  AlertTriangle, FileCheck, Key, Building2, LogOut, Loader2, DollarSign, Layout
} from 'lucide-react';
import { Logo } from './Logo';
import { AuditLogEntry, ExpertRequest, SOP } from '../types';

interface EnterpriseDashboardProps {
  onExit: () => void;
  onCreateSOP: () => void;
  onOpenSOP: (sop: SOP) => void;
}

const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 'aud-1024', timestamp: '2023-10-24 09:42:11', actor: 'j.smith@acme.corp', action: 'EXECUTE_STEP', resource: 'SOP-99 (Wire Transfer)', outcome: 'Success', hash: '8f7a...3b21' },
  { id: 'aud-1023', timestamp: '2023-10-24 09:40:05', actor: 'j.smith@acme.corp', action: 'VIEW_PII', resource: 'SOP-99 (Wire Transfer)', outcome: 'Flagged', hash: '2c1d...9e44' },
  { id: 'aud-1022', timestamp: '2023-10-23 16:15:33', actor: 'system_admin', action: 'UPDATE_POLICY', resource: 'Global Risk Controls', outcome: 'Success', hash: '7a8b...1c33' },
  { id: 'aud-1021', timestamp: '2023-10-23 14:20:00', actor: 'm.chen@acme.corp', action: 'FORK_SOP', resource: 'Public: Crisis Comms', outcome: 'Success', hash: '5e6f...0d11' },
];

const MOCK_PRIVATE_SOPS: SOP[] = [
  {
    id: 'ent-1',
    title: 'Q4 Acme Corp Audit Prep',
    description: 'Internal financial review process strictly for the audit committee.',
    author: 'Acme Internal',
    ownership: 'COMPANY_OWNED',
    price: 0,
    rating: 0,
    category: 'Finance',
    users: 12,
    version: '2.1',
    visibility: 'confidential',
    steps: [
      { id: 'e1-1', title: 'Verify Ledger Access', description: 'Ensure user has read-only access to Q4 ledger.', type: 'action' }
    ],
    status: 'Active',
    riskClass: 'High',
    executionWeight: 1,
    tierAccess: 'Sovereign',
    jurisdiction: 'Internal',
    reviewCycle: 'Quarterly',
    purpose: 'Audit readiness',
    scope: 'Finance Dept',
    definitions: {},
    roles: [],
    prerequisites: [],
    inputs: [],
    complianceControls: [],
    outputs: [],
    kpis: [],
    risks: [],
    escalation: []
  },
  {
    id: 'ent-2',
    title: 'Customer Data Handling (GDPR)',
    description: 'Strict protocol for support staff accessing EU user data.',
    author: 'Acme Legal',
    ownership: 'COMPANY_OWNED',
    price: 0,
    rating: 0,
    category: 'Legal',
    users: 450,
    version: '4.0',
    visibility: 'private',
    steps: [
       { id: 'e2-1', title: 'Confirm Jurisdiction', description: 'Is the user located in the EU?', type: 'decision' }
    ],
    status: 'Active',
    riskClass: 'Medium',
    executionWeight: 1,
    tierAccess: 'Authority',
    jurisdiction: 'EU',
    reviewCycle: 'Bi-Annual',
    purpose: 'GDPR Compliance',
    scope: 'Support Team',
    definitions: {},
    roles: [],
    prerequisites: [],
    inputs: [],
    complianceControls: [],
    outputs: [],
    kpis: [],
    risks: [],
    escalation: []
  }
];

export const EnterpriseDashboard: React.FC<EnterpriseDashboardProps> = ({ onExit, onCreateSOP, onOpenSOP }) => {
  const [activeTab, setActiveTab] = useState<'vault' | 'audit' | 'experts' | 'settings'>('vault');
  const [expertReqs, setExpertReqs] = useState<ExpertRequest[]>([]);
  const [isSubmittingExpert, setIsSubmittingExpert] = useState(false);

  // Expert Request Form State
  const [reqCategory, setReqCategory] = useState('Operations');
  const [reqBudget, setReqBudget] = useState('$5,000');
  const [reqDesc, setReqDesc] = useState('');

  const handleRequestExpert = () => {
    setIsSubmittingExpert(true);
    // Simulate payment/submission delay
    setTimeout(() => {
        const newReq: ExpertRequest = {
            id: Date.now().toString(),
            category: reqCategory,
            budget: reqBudget,
            requirements: reqDesc,
            status: 'Pending'
        };
        setExpertReqs([...expertReqs, newReq]);
        setReqDesc('');
        setIsSubmittingExpert(false);
        // Show success alert
        alert("Escrow funds reserved. Request sent to matched Master Architects.");
    }, 1500);
  };

  const SidebarItem = ({ id, icon: Icon, label }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-4 py-3 text-sm font-medium transition-all whitespace-nowrap rounded-lg lg:rounded-none flex-shrink-0 lg:w-full lg:text-left
        ${activeTab === id 
          ? 'bg-white/20 text-white border-l-4 border-slate-900 shadow-sm font-bold' 
          : 'text-amber-100 hover:text-white hover:bg-white/10 border-l-4 border-transparent'
        }`}
    >
      <Icon className={`w-4 h-4 mr-3 shrink-0 ${activeTab === id ? 'text-slate-900' : 'text-amber-200'}`} />
      <span className={activeTab === id ? 'text-slate-900' : ''}>{label}</span>
    </button>
  );

  return (
    <div className="h-screen overflow-hidden bg-slate-100 flex flex-col font-sans">
      {/* Enterprise Header */}
      <header className="bg-slate-900 text-white h-16 flex items-center justify-between px-6 sticky top-0 z-50 shadow-md flex-shrink-0 border-b border-slate-800">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-gold-500" />
              <span className="font-bold tracking-tight text-lg hidden sm:inline">ACME Corp <span className="text-slate-500 font-normal">| Enterprise</span></span>
              <span className="font-bold tracking-tight text-lg sm:hidden">ACME</span>
           </div>
           <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>
           <span className="text-[10px] sm:text-xs font-mono text-gold-500 flex items-center bg-gold-500/10 px-2 py-1 rounded border border-gold-500/20">
              <Lock className="w-3 h-3 mr-1" /> VAULT ACTIVE
           </span>
        </div>
        <div className="flex items-center gap-4">
           {/* Toggle to Standard View */}
           <button onClick={onExit} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-bold transition-colors border border-slate-700">
              <Layout className="w-3 h-3" /> Standard View
           </button>
           
           <div className="text-right hidden md:block border-l border-slate-800 pl-4">
              <div className="text-xs text-gold-500 uppercase tracking-wider font-bold">Enterprise Plan</div>
              <div className="text-sm font-bold text-white">Unlimited Seats</div>
           </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Sidebar / Navigation - GOLD THEME */}
        <aside className="w-full lg:w-64 bg-gradient-to-b from-amber-500 to-amber-700 flex-shrink-0 flex flex-col shadow-xl z-20">
           {/* Mobile Horizontal Scroll / Desktop Vertical */}
           <div className="p-4 lg:p-6 overflow-x-auto lg:overflow-visible scrollbar-hide w-full">
              <div className="text-xs font-bold text-amber-900/60 uppercase tracking-wider mb-2 lg:mb-4 hidden lg:block">Core Modules</div>
              <div className="flex flex-row lg:flex-col gap-2 lg:gap-1 min-w-full lg:min-w-0">
                 <SidebarItem id="vault" icon={Shield} label="Private Vault" />
                 <SidebarItem id="audit" icon={Activity} label="Audit Logs" />
                 <SidebarItem id="experts" icon={Briefcase} label="Expert Matching" />
                 <SidebarItem id="settings" icon={Settings} label="Governance" />
              </div>
           </div>
           
           <div className="mt-auto p-6 border-t border-amber-600/30 hidden lg:block">
              <div className="bg-amber-800/20 rounded-lg p-4 border border-amber-600/30">
                 <h4 className="text-white text-sm font-bold mb-1">Priority Support</h4>
                 <p className="text-amber-100 text-xs mb-3">Your success manager is online.</p>
                 <button className="w-full bg-white text-amber-700 hover:bg-amber-50 text-xs font-bold py-2 rounded transition-colors shadow-sm">
                    Contact Manager
                 </button>
              </div>
           </div>
        </aside>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
           
           {/* VAULT VIEW */}
           {activeTab === 'vault' && (
              <div className="max-w-6xl mx-auto animate-fade-in pb-12">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                       <h1 className="text-2xl font-bold text-slate-900 mb-1">Private Protocol Vault</h1>
                       <p className="text-slate-500 text-sm">
                          Isolated, encrypted data lake for internal SOPs. 
                          <span className="font-bold text-slate-700 ml-1">Excluded from public AI training models.</span>
                       </p>
                    </div>
                    <button 
                        onClick={onCreateSOP}
                        className="bg-amber-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-amber-700 transition-colors flex items-center shadow-lg whitespace-nowrap text-sm w-full md:w-auto justify-center"
                    >
                       <Key className="w-4 h-4 mr-2" /> New Encrypted SOP
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_PRIVATE_SOPS.map(sop => (
                       <div key={sop.id} onClick={() => onOpenSOP(sop)} className="cursor-pointer bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                          {sop.visibility === 'confidential' && (
                             <div className="absolute top-0 right-0 bg-red-100 text-red-700 text-[10px] font-bold px-3 py-1 rounded-bl-lg flex items-center">
                                <Lock className="w-3 h-3 mr-1" /> CONFIDENTIAL
                             </div>
                          )}
                          {sop.visibility === 'private' && (
                             <div className="absolute top-0 right-0 bg-slate-100 text-slate-700 text-[10px] font-bold px-3 py-1 rounded-bl-lg flex items-center">
                                <Shield className="w-3 h-3 mr-1" /> INTERNAL
                             </div>
                          )}
                          
                          <div className="mb-4 mt-2">
                             <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                <FileText className="w-5 h-5" />
                             </div>
                             <h3 className="font-bold text-slate-900 text-lg leading-tight mb-2 group-hover:text-amber-600 transition-colors">{sop.title}</h3>
                             <p className="text-slate-500 text-sm line-clamp-2">{sop.description}</p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                             <div className="text-xs text-slate-400">
                                v{sop.version} • {sop.users} executions
                             </div>
                             <button className="text-amber-600 font-bold text-sm hover:underline flex items-center">
                                Access <ChevronRight className="w-4 h-4" />
                             </button>
                          </div>
                       </div>
                    ))}
                    
                    {/* Placeholder for "Fork from Marketplace" */}
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center text-slate-400 hover:border-amber-400 hover:text-amber-500 hover:bg-amber-50 transition-all cursor-pointer group min-h-[200px]">
                       <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-white flex items-center justify-center mb-3 transition-colors">
                          <Search className="w-6 h-6" />
                       </div>
                       <h3 className="font-bold text-sm">Fork from Marketplace</h3>
                       <p className="text-xs mt-1">Import a public SOP and privatize it.</p>
                    </div>
                 </div>
              </div>
           )}

           {/* AUDIT LOG VIEW */}
           {activeTab === 'audit' && (
              <div className="max-w-6xl mx-auto animate-fade-in pb-12">
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                       <h1 className="text-2xl font-bold text-slate-900 mb-1">Compliance Audit Log</h1>
                       <p className="text-slate-500 text-sm">Immutable record of all execution events. Exportable for legal review.</p>
                    </div>
                    <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-bold hover:bg-slate-50 transition-colors text-sm w-full sm:w-auto">
                       Export CSV
                    </button>
                 </div>

                 <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm min-w-[800px]">
                         <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs font-bold tracking-wider">
                            <tr>
                               <th className="px-6 py-4">Timestamp</th>
                               <th className="px-6 py-4">Actor</th>
                               <th className="px-6 py-4">Action</th>
                               <th className="px-6 py-4">Resource</th>
                               <th className="px-6 py-4">Status</th>
                               <th className="px-6 py-4">Integrity Hash</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100 font-mono text-xs">
                            {MOCK_AUDIT_LOGS.map(log => (
                               <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                                  <td className="px-6 py-4 text-slate-900 font-bold whitespace-nowrap">{log.actor}</td>
                                  <td className="px-6 py-4 text-slate-700 whitespace-nowrap">{log.action}</td>
                                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{log.resource}</td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                     <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                                        log.outcome === 'Success' ? 'bg-green-100 text-green-700' : 
                                        log.outcome === 'Flagged' ? 'bg-amber-100 text-amber-700' : 
                                        'bg-red-100 text-red-700'
                                     }`}>
                                        {log.outcome}
                                     </span>
                                  </td>
                                  <td className="px-6 py-4 text-slate-400 truncate max-w-[120px]" title={log.hash}>
                                     {log.hash}
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                    </div>
                 </div>
              </div>
           )}

           {/* EXPERT MATCHING */}
           {activeTab === 'experts' && (
              <div className="max-w-4xl mx-auto animate-fade-in pb-12">
                 <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Hire a Master Architect</h1>
                    <p className="text-slate-500 max-w-lg mx-auto text-sm">
                       Commission bespoke, high-performance protocols from the top 1% of vetted creators.
                       Private. Secure. Guaranteed results.
                    </p>
                 </div>

                 <div className="grid md:grid-cols-3 gap-8">
                    {/* Request Form */}
                    <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-lg p-6 md:p-8">
                       <h3 className="font-bold text-slate-900 mb-6 flex items-center">
                          <Briefcase className="w-5 h-5 text-gold-500 mr-2" /> New Project Request
                       </h3>
                       
                       <div className="space-y-6">
                          <div>
                             <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Protocol Category</label>
                             <select 
                                value={reqCategory}
                                onChange={(e) => setReqCategory(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none text-sm"
                             >
                                <option>Operations</option>
                                <option>Finance & Risk</option>
                                <option>Cybersecurity</option>
                                <option>Legal Compliance</option>
                             </select>
                          </div>
                          <div>
                             <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Estimated Budget</label>
                             <select 
                                value={reqBudget}
                                onChange={(e) => setReqBudget(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none text-sm"
                             >
                                <option>$1,000 - $5,000</option>
                                <option>$5,000 - $15,000</option>
                                <option>$15,000+</option>
                             </select>
                          </div>
                          <div>
                             <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Project Requirements</label>
                             <textarea 
                                value={reqDesc}
                                onChange={(e) => setReqDesc(e.target.value)}
                                rows={4}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none resize-none text-sm"
                                placeholder="Describe the outcome you need (e.g. 'Complete SOC2 Type II audit readiness workflow')..."
                             />
                          </div>
                          <button 
                             onClick={handleRequestExpert}
                             disabled={!reqDesc || isSubmittingExpert}
                             className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 text-sm flex items-center justify-center"
                          >
                             {isSubmittingExpert ? (
                                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing Deposit...</>
                             ) : (
                                <><DollarSign className="w-4 h-4 mr-1" /> Deposit Funds & Submit Request</>
                             )}
                          </button>
                       </div>
                    </div>

                    {/* Active Requests */}
                    <div className="space-y-4">
                       <div className="bg-slate-800 text-white rounded-xl p-6 border border-slate-700">
                          <h4 className="font-bold text-gold-500 mb-2 text-sm uppercase tracking-wider">How it works</h4>
                          <ul className="space-y-3 text-sm text-slate-300">
                             <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 text-green-400 shrink-0 mt-0.5" /> We match you with 3 'Master' tier creators.</li>
                             <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 text-green-400 shrink-0 mt-0.5" /> You select the best fit.</li>
                             <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 text-green-400 shrink-0 mt-0.5" /> Funds held in escrow until delivery.</li>
                             <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 text-green-400 shrink-0 mt-0.5" /> Full IP transfer to your Enterprise Vault.</li>
                          </ul>
                       </div>

                       {expertReqs.length > 0 && (
                          <div className="bg-white border border-slate-200 rounded-xl p-6">
                             <h4 className="font-bold text-slate-900 mb-4 text-sm">Active Requests</h4>
                             <div className="space-y-3">
                                {expertReqs.map(req => (
                                   <div key={req.id} className="p-3 bg-slate-50 rounded border border-slate-100">
                                      <div className="flex justify-between items-start mb-1">
                                         <span className="text-xs font-bold text-slate-700">{req.category}</span>
                                         <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">{req.status}</span>
                                      </div>
                                      <p className="text-xs text-slate-500 line-clamp-2">{req.requirements}</p>
                                   </div>
                                ))}
                             </div>
                          </div>
                       )}
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'settings' && (
              <div className="max-w-4xl mx-auto flex items-center justify-center h-full text-slate-400 pb-12">
                 <div className="text-center p-8">
                    <Settings className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <h3 className="text-lg font-medium text-slate-600">Governance & Settings</h3>
                    <p className="text-sm mt-2">Role-Based Access Control (RBAC) and Whitelabel settings would go here.</p>
                 </div>
              </div>
           )}

        </main>
      </div>
    </div>
  );
};
