
import React, { useState } from 'react';
import { 
  Users, FileText, AlertTriangle, Activity, CheckCircle, XCircle, 
  Search, Filter, ChevronRight, Eye, Shield, BarChart3, Lock, Zap,
  AlertOctagon, Clock, ArrowLeft, Trash2, Archive, PlayCircle
} from 'lucide-react';
import { Logo } from './Logo';
import { ReviewApplication, ReviewSOP, FlaggedIncident, SOP, SOPStep, RejectionReasonCode } from '../types';

interface AdminDashboardProps {
  onExit: () => void;
  activeSops: SOP[];
  pendingSops: ReviewSOP[];
  applications: ReviewApplication[];
  onApproveSop: (sop: ReviewSOP) => void;
  onRejectSop: (id: string) => void;
  onDeleteSop: (id: string) => void;
  onApproveApp: (app: ReviewApplication) => void;
  onRejectApp: (id: string) => void;
}

// --- REJECTION RUBRIC CONFIG ---
const REJECTION_REASONS: { code: RejectionReasonCode; label: string; desc: string; fix: string }[] = [
  { code: 'GENERIC_CONTENT', label: 'Generic / AI-Generated', desc: 'Content is too broad, lacks domain specificity, or appears to be a direct LLM output without augmentation.', fix: 'Add company-specific constraints, edge cases, or "messy reality" scenarios.' },
  { code: 'SAFETY_RISK', label: 'Safety / Compliance Risk', desc: 'Missing critical safety warnings or compliance checkpoints in high-risk procedures.', fix: 'Add "Risk" section and "Stop/Check" decision nodes.' },
  { code: 'INCOMPLETE_LOGIC', label: 'Incomplete Logic', desc: 'Steps do not flow logically or missing decision outcomes (e.g., what happens if check fails?).', fix: 'Add Decision Nodes for negative paths.' },
  { code: 'VAGUE_OUTCOMES', label: 'Vague Outcomes', desc: 'Outcome descriptions are not measurable or verifiable.', fix: 'Define specific KPIs or artifacts produced (e.g. "Signed PDF" vs "Done").' },
  { code: 'FORMATTING', label: 'Formatting Issues', desc: 'Poor structure, readability, or grammar issues.', fix: 'Follow the standard 15-section SOP structure.' }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    onExit, activeSops, pendingSops, applications,
    onApproveSop, onRejectSop, onDeleteSop, onApproveApp, onRejectApp
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'apps' | 'sops' | 'manage_sops'>('overview');
  const [selectedApp, setSelectedApp] = useState<ReviewApplication | null>(null);
  const [selectedSOP, setSelectedSOP] = useState<ReviewSOP | null>(null);
  
  // Rejection State
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState<RejectionReasonCode | null>(null);
  const [rejectNote, setRejectNote] = useState('');

  // Scoring State for SOP Review
  const [scores, setScores] = useState({ clarity: 0, logic: 0, risk: 0, compliance: 0, updates: 0 });

  const totalScore = Object.values(scores).reduce((a: number, b: number) => a + b, 0);

  const handleRejectSubmit = () => {
    if (selectedApp) {
        onRejectApp(selectedApp.id);
        alert(`Application rejected: ${rejectReason}`);
    } else if (selectedSOP) {
        onRejectSop(selectedSOP.id);
        alert(`SOP rejected: ${rejectReason}`);
    }
    
    setShowRejectModal(false);
    setSelectedApp(null);
    setSelectedSOP(null);
    setRejectReason(null);
    setRejectNote('');
  };

  const handleApproveSopClick = () => {
      if (selectedSOP) {
          onApproveSop(selectedSOP);
          setSelectedSOP(null);
          alert("SOP Published Successfully.");
      }
  };

  const handleApproveAppClick = () => {
      if (selectedApp) {
          onApproveApp(selectedApp);
          setSelectedApp(null);
          alert("Creator Application Approved.");
      }
  };

  // --- SUB-COMPONENTS ---

  const KpiCard = ({ title, value, sub, color }: { title: string, value: string, sub: string, color: 'green' | 'yellow' | 'red' }) => (
    <div className={`p-6 rounded-xl border ${color === 'green' ? 'bg-green-50 border-green-100' : color === 'yellow' ? 'bg-amber-50 border-amber-100' : 'bg-red-50 border-red-100'}`}>
      <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">{title}</div>
      <div className={`text-3xl font-bold mb-1 ${color === 'green' ? 'text-green-700' : color === 'yellow' ? 'text-amber-700' : 'text-red-700'}`}>{value}</div>
      <div className="text-xs text-slate-500">{sub}</div>
    </div>
  );

  const StepNode: React.FC<{ step: SOPStep, index: number }> = ({ step, index }) => (
    <div className="flex items-start gap-3 mb-4">
      <div className="flex flex-col items-center">
         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
            step.type === 'decision' ? 'bg-amber-100 text-amber-700' : 
            step.type === 'action' ? 'bg-blue-100 text-blue-700' :
            'bg-slate-100 text-slate-700'
         }`}>
           {index + 1}
         </div>
         {index < (selectedSOP?.steps.length || 0) - 1 && <div className="w-px h-full bg-slate-300 my-1"></div>}
      </div>
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-sm flex-1 min-w-0">
         <div className="flex flex-wrap justify-between items-start gap-2">
            <span className="font-bold text-slate-900 text-sm">{step.title}</span>
            <span className="text-[10px] uppercase bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{step.type}</span>
         </div>
         <p className="text-xs text-slate-500 mt-1">{step.description}</p>
         {step.requiredRole && (
           <div className="mt-2 text-[10px] flex items-center text-amber-600 bg-amber-50 inline-block px-2 py-0.5 rounded border border-amber-100">
              <Lock className="w-3 h-3 mr-1" /> Requires: {step.requiredRole}
           </div>
         )}
      </div>
    </div>
  );

  // --- REJECTION MODAL ---
  const RejectionModal = () => (
    <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in">
            <div className="bg-red-50 p-6 border-b border-red-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-red-900 flex items-center">
                    <XCircle className="w-5 h-5 mr-2" /> Reject Submission
                </h3>
                <button onClick={() => setShowRejectModal(false)} className="text-red-700 hover:text-red-900">Close</button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
                <p className="text-sm text-slate-600 mb-6">Select a primary reason from the rubric. This standardized feedback helps creators improve.</p>
                
                <div className="grid gap-3 mb-6">
                    {REJECTION_REASONS.map(reason => (
                        <label 
                            key={reason.code} 
                            className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all ${
                                rejectReason === reason.code ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            <input 
                                type="radio" 
                                name="reason" 
                                className="mt-1 mr-3"
                                checked={rejectReason === reason.code}
                                onChange={() => setRejectReason(reason.code)}
                            />
                            <div>
                                <span className={`font-bold text-sm block ${rejectReason === reason.code ? 'text-red-900' : 'text-slate-900'}`}>
                                    {reason.label}
                                </span>
                                <span className="text-xs text-slate-500 block mt-1">{reason.desc}</span>
                                {rejectReason === reason.code && (
                                    <div className="mt-2 text-xs font-medium text-red-700 bg-white p-2 rounded border border-red-100">
                                        💡 Tip: {reason.fix}
                                    </div>
                                )}
                            </div>
                        </label>
                    ))}
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Additional Feedback</label>
                    <textarea 
                        value={rejectNote}
                        onChange={(e) => setRejectNote(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg text-sm h-24 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Provide specific examples of where the submission failed..."
                    />
                </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg">Cancel</button>
                <button 
                    onClick={handleRejectSubmit}
                    disabled={!rejectReason}
                    className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                    Confirm Rejection
                </button>
            </div>
        </div>
    </div>
  );

  // --- VIEWS ---

  const renderOverview = () => (
    <div className="space-y-8 animate-fade-in">
       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <KpiCard title="Apps Pending" value={applications.length.toString()} sub="High Priority" color="yellow" />
          <KpiCard title="SOPs Pending" value={pendingSops.length.toString()} sub="Avg wait: 4h" color="yellow" />
          <KpiCard title="Active SOPs" value={activeSops.length.toString()} sub="Live in market" color="green" />
          <KpiCard title="Flagged SOPs" value="3" sub="Requires Action" color="red" />
          <KpiCard title="Avg Quality" value="4.2" sub="Execution Score" color="green" />
          <KpiCard title="Rev Risk" value="$1.2k" sub="Flagged Assets" color="red" />
       </div>

       <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900 flex items-center"><Users className="w-5 h-5 mr-2 text-slate-500" /> Recent Applications</h3>
                <button onClick={() => setActiveTab('apps')} className="text-sm text-brand-600 font-bold hover:underline">View Queue</button>
             </div>
             <div className="space-y-4">
                {applications.slice(0, 5).map(app => (
                   <div key={app.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div>
                         <div className="font-bold text-slate-900 text-sm">{app.fullName}</div>
                         <div className="text-xs text-slate-500">{app.role} • {app.industry}</div>
                      </div>
                      <div className={`text-xs font-bold px-2 py-1 rounded ${app.aiScore > 80 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                         AI Score: {app.aiScore}
                      </div>
                   </div>
                ))}
                {applications.length === 0 && <p className="text-sm text-slate-400">No pending applications.</p>}
             </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900 flex items-center"><FileText className="w-5 h-5 mr-2 text-slate-500" /> SOP Review Queue</h3>
                <button onClick={() => setActiveTab('sops')} className="text-sm text-brand-600 font-bold hover:underline">View All</button>
             </div>
             <div className="space-y-4">
                {pendingSops.slice(0, 5).map(sop => (
                   <div key={sop.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <FileText className="w-4 h-4 text-blue-500 mt-1 shrink-0" />
                      <div className="flex-1">
                         <div className="font-bold text-slate-900 text-sm">{sop.title}</div>
                         <div className="text-xs text-slate-500">{sop.author}</div>
                      </div>
                      <div className="ml-auto text-[10px] font-bold uppercase tracking-wide text-blue-600 bg-blue-100 px-2 py-1 rounded">
                         Pending
                      </div>
                   </div>
                ))}
                {pendingSops.length === 0 && <p className="text-sm text-slate-400">Queue is empty. Good job!</p>}
             </div>
          </div>
       </div>
    </div>
  );

  const renderAppDetail = () => {
    if (!selectedApp) return null;
    return (
      <div className="bg-white flex flex-col lg:flex-row lg:h-[calc(100vh-140px)] rounded-xl border border-slate-200 shadow-lg overflow-hidden animate-fade-in h-auto">
         {/* Left: Summary */}
         <div className="w-full lg:w-1/4 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200 p-6 lg:overflow-y-auto">
            <button onClick={() => setSelectedApp(null)} className="mb-6 flex items-center text-xs text-slate-500 hover:text-slate-900 font-bold uppercase tracking-wider">
               <ArrowLeft className="w-3 h-3 mr-1" /> Back to List
            </button>
            
            <div className="mb-6">
               <div className="w-16 h-16 bg-slate-200 rounded-full mb-4 flex items-center justify-center text-2xl font-bold text-slate-500">
                  {selectedApp.fullName.charAt(0)}
               </div>
               <h2 className="text-xl font-bold text-slate-900">{selectedApp.professionalName}</h2>
               <p className="text-sm text-slate-500">{selectedApp.fullName}</p>
            </div>

            <div className="space-y-4 text-sm">
               <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Role</label>
                  <p className="font-medium text-slate-900">{selectedApp.role}</p>
                  <p className="text-xs text-slate-500">{selectedApp.yearsExperience} years exp</p>
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Industry</label>
                  <p className="font-medium text-slate-900">{selectedApp.industry}</p>
               </div>
               
               <div className="pt-4 border-t border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                     <span className="font-bold text-slate-700">AI Credibility</span>
                     <span className={`font-bold ${selectedApp.aiScore > 75 ? 'text-green-600' : 'text-red-600'}`}>{selectedApp.aiScore}/100</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                     <div className={`h-full ${selectedApp.aiScore > 75 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${selectedApp.aiScore}%` }}></div>
                  </div>
               </div>
               
               {selectedApp.riskFlags.length > 0 && (
                  <div className="bg-red-50 border border-red-100 p-3 rounded-lg">
                     <label className="text-xs font-bold text-red-800 uppercase flex items-center mb-2">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Risk Flags
                     </label>
                     <ul className="list-disc pl-4 space-y-1">
                        {selectedApp.riskFlags.map((flag, i) => (
                           <li key={i} className="text-xs text-red-700">{flag}</li>
                        ))}
                     </ul>
                  </div>
               )}
            </div>
         </div>

         {/* Center: Proof of Work */}
         <div className="flex-1 p-8 overflow-y-auto">
            <h3 className="font-bold text-slate-900 text-lg mb-6 flex items-center">
               <Shield className="w-5 h-5 mr-2 text-brand-500" /> Proof of Work Analysis
            </h3>

            <div className="space-y-8">
               <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Process Description</label>
                  <p className="text-slate-800 leading-relaxed text-sm">
                     {selectedApp.proofDescription}
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                     <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Outcomes</label>
                     <ul className="space-y-2 text-sm">
                        <li className="flex justify-between"><span className="text-slate-500">Time:</span> <span className="font-medium text-slate-900">{selectedApp.outcomeTime}</span></li>
                        <li className="flex justify-between"><span className="text-slate-500">Cost:</span> <span className="font-medium text-slate-900">{selectedApp.outcomeCost}</span></li>
                        <li className="flex justify-between"><span className="text-slate-500">Errors:</span> <span className="font-medium text-slate-900">{selectedApp.outcomeErrors}</span></li>
                     </ul>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                     <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Dependencies</label>
                     <div className="flex flex-wrap gap-2">
                        {selectedApp.dependents.map(d => (
                           <span key={d} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded font-medium">{d}</span>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                  <label className="text-xs font-bold text-amber-800 uppercase mb-2 block flex items-center">
                     <Zap className="w-3 h-3 mr-1" /> Operational Thinking Test
                  </label>
                  <p className="text-sm text-amber-900 italic mb-4">"A staff member skips a critical step..."</p>
                  <p className="text-slate-800 leading-relaxed text-sm border-l-4 border-amber-300 pl-4 bg-white/50 py-2 rounded-r">
                     {selectedApp.scenarioResponse}
                  </p>
               </div>
            </div>
         </div>

         {/* Right: Decision */}
         <div className="w-full lg:w-1/4 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 p-6 flex flex-col">
            <h3 className="font-bold text-slate-900 mb-4">Decision Controls</h3>
            
            <div className="flex-1">
               <div className="p-4 bg-white border border-slate-200 rounded-lg mb-4">
                  <p className="text-sm font-medium text-slate-900 mb-2">Reviewer Question:</p>
                  <p className="text-xs text-slate-500 italic">"Would I trust this person to run part of my business?"</p>
               </div>
            </div>

            <div className="space-y-3">
               <button onClick={handleApproveAppClick} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-200 transition-all flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 mr-2" /> Approve & Certify
               </button>
               <button onClick={() => setSelectedApp(null)} className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl transition-all">
                  Request Info
               </button>
               <button onClick={() => setShowRejectModal(true)} className="w-full bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 font-bold py-3 rounded-xl transition-all flex items-center justify-center">
                  <XCircle className="w-4 h-4 mr-2" /> Reject Application
               </button>
            </div>
         </div>
      </div>
    );
  };

  const renderSOPDetail = () => {
    if (!selectedSOP) return null;
    return (
      <div className="bg-white flex flex-col lg:flex-row lg:h-[calc(100vh-140px)] rounded-xl border border-slate-200 shadow-lg overflow-hidden animate-fade-in h-auto">
        {/* Left: Metadata */}
        <div className="w-full lg:w-1/5 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200 p-6 lg:overflow-y-auto">
           <button onClick={() => setSelectedSOP(null)} className="mb-6 flex items-center text-xs text-slate-500 hover:text-slate-900 font-bold uppercase tracking-wider">
               <ArrowLeft className="w-3 h-3 mr-1" /> Back to Queue
            </button>
            <h2 className="text-lg font-bold text-slate-900 leading-tight mb-2">{selectedSOP.title}</h2>
            <div className="flex items-center gap-2 mb-6">
               <span className="text-xs font-bold px-2 py-0.5 bg-brand-100 text-brand-700 rounded">{selectedSOP.category}</span>
               <span className="text-xs text-slate-500">{selectedSOP.steps.length} Steps</span>
            </div>

            <div className="space-y-4">
               <div className="p-3 bg-white rounded border border-slate-200">
                  <div className="text-xs text-slate-500 mb-1">Originality Score</div>
                  <div className="text-2xl font-bold text-green-600">{selectedSOP.aiOriginalityScore}%</div>
               </div>
               <div className="p-3 bg-white rounded border border-slate-200">
                  <div className="text-xs text-slate-500 mb-1">Structure Unique</div>
                  <div className="text-2xl font-bold text-blue-600">{selectedSOP.structuralUniquenessScore}%</div>
               </div>
               <div className="p-3 bg-white rounded border border-slate-200">
                  <div className="text-xs text-slate-500 mb-1">Est. User Value</div>
                  <div className="text-2xl font-bold text-slate-900">${selectedSOP.estimatedUserValue}</div>
               </div>
            </div>
        </div>

        {/* Center: Structure Map */}
        <div className="flex-1 p-8 overflow-y-auto bg-slate-50/50">
           <div className="max-w-2xl mx-auto">
              <h3 className="font-bold text-slate-900 text-lg mb-6 flex items-center">
                 <Activity className="w-5 h-5 mr-2 text-brand-500" /> Protocol Structure Map
              </h3>
              <div className="relative">
                 <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200"></div>
                 {selectedSOP.steps.map((step, idx) => (
                    <StepNode key={step.id} step={step} index={idx} />
                 ))}
              </div>
           </div>
        </div>

        {/* Right: Scoring */}
        <div className="w-full lg:w-1/4 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 p-6 flex flex-col lg:overflow-y-auto">
           <h3 className="font-bold text-slate-900 mb-6">Quality Scoring</h3>
           
           <div className="space-y-6 mb-8">
              {[
                { key: 'clarity', label: 'Execution Clarity' },
                { key: 'logic', label: 'Decision Logic' },
                { key: 'risk', label: 'Risk Handling' },
                { key: 'compliance', label: 'Compliance Awareness' },
                { key: 'updates', label: 'Update Readiness' },
              ].map(criterion => (
                 <div key={criterion.key}>
                    <div className="flex justify-between text-sm mb-1">
                       <span className="text-slate-700 font-medium">{criterion.label}</span>
                       <span className="font-bold text-slate-900">{(scores as any)[criterion.key]}/5</span>
                    </div>
                    <div className="flex gap-1">
                       {[1,2,3,4,5].map(score => (
                          <button 
                            key={score}
                            onClick={() => setScores(prev => ({ ...prev, [criterion.key]: score }))}
                            className={`flex-1 h-8 rounded border transition-colors ${
                               ((scores as any)[criterion.key] as number) >= score 
                               ? 'bg-brand-500 border-brand-500 text-white' 
                               : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                             {score}
                          </button>
                       ))}
                    </div>
                 </div>
              ))}
           </div>

           <div className="mt-auto">
              <div className="flex justify-between items-center mb-4 p-4 bg-slate-50 rounded-lg">
                 <span className="font-bold text-slate-700">Total Score</span>
                 <span className={`text-2xl font-bold ${(totalScore as number) >= 18 ? 'text-green-600' : 'text-slate-400'}`}>{totalScore}/25</span>
              </div>
              <p className="text-xs text-center text-slate-400 mb-4">Minimum 18/25 required to publish</p>
              
              <div className="grid grid-cols-2 gap-3">
                 <button 
                    onClick={handleApproveSopClick}
                    disabled={(totalScore as number) < 18} 
                    className="col-span-2 bg-green-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg shadow-md transition-all"
                 >
                    Publish Protocol
                 </button>
                 <button className="bg-white border border-slate-300 text-slate-700 font-bold py-3 rounded-lg hover:bg-slate-50">
                    Request Edits
                 </button>
                 <button onClick={() => setShowRejectModal(true)} className="bg-red-50 border border-red-200 text-red-700 font-bold py-3 rounded-lg hover:bg-red-100">
                    Reject
                 </button>
              </div>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
       {/* Top Bar */}
       <header className="bg-slate-900 text-white h-16 flex items-center justify-between px-6 sticky top-0 z-50 shadow-md">
          <div className="flex items-center gap-6">
             <Logo light className="h-6 w-6" />
             <div className="h-6 w-px bg-slate-700"></div>
             <h1 className="font-bold tracking-wide text-sm uppercase hidden md:block">Admin Console <span className="text-slate-500 ml-2">v2.1</span></h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center text-xs text-slate-400">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                System Operational
             </div>
             <button onClick={onExit} className="text-xs font-bold bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded transition-colors text-slate-300">
                Exit to App
             </button>
          </div>
       </header>

       <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
          {/* Sidebar */}
          <nav className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col">
             <div className="p-4 space-y-1">
                {[
                  { id: 'overview', icon: BarChart3, label: 'Overview' },
                  { id: 'manage_sops', icon: FileText, label: 'Manage All SOPs' },
                  { id: 'apps', icon: Users, label: 'Applications', badge: applications.length.toString() },
                  { id: 'sops', icon: CheckCircle, label: 'Review Queue', badge: pendingSops.length.toString() },
                ].map(item => (
                   <button
                     key={item.id}
                     onClick={() => { setActiveTab(item.id as any); setSelectedApp(null); setSelectedSOP(null); }}
                     className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === item.id ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                     }`}
                   >
                      <div className="flex items-center">
                         <item.icon className={`w-4 h-4 mr-3 ${item.badge && parseInt(item.badge) > 0 ? 'text-blue-500' : ''}`} />
                         {item.label}
                      </div>
                      {item.badge && (
                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${parseInt(item.badge) > 0 ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-600'}`}>
                            {item.badge}
                         </span>
                      )}
                   </button>
                ))}
             </div>
             <div className="mt-auto p-4 border-t border-slate-100 hidden lg:block">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                      AD
                   </div>
                   <div>
                      <div className="text-sm font-bold text-slate-900">Admin User</div>
                      <div className="text-xs text-slate-500">Super Admin</div>
                   </div>
                </div>
             </div>
          </nav>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto p-4 md:p-8">
             {activeTab === 'overview' && renderOverview()}
             
             {/* MANAGE ACTIVE SOPS */}
             {activeTab === 'manage_sops' && (
                 <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Active SOP Registry</h2>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm min-w-[700px]">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Title</th>
                                        <th className="px-6 py-4 font-bold">Ownership</th>
                                        <th className="px-6 py-4 font-bold">Users</th>
                                        <th className="px-6 py-4 font-bold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {activeSops.map(sop => (
                                        <tr key={sop.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900">{sop.title}</div>
                                                <div className="text-xs text-slate-500">{sop.id}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                    sop.ownership === 'COMPANY_OWNED' ? 'bg-slate-200 text-slate-700' : 'bg-purple-100 text-purple-700'
                                                }`}>
                                                    {sop.ownership.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-slate-600">{sop.users}</td>
                                            <td className="px-6 py-4 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => onDeleteSop(sop.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded" 
                                                    title="Delete SOP"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                 </div>
             )}

             {activeTab === 'apps' && !selectedApp && (
                <div className="animate-fade-in">
                   <h2 className="text-2xl font-bold text-slate-900 mb-6">Creator Application Queue</h2>
                   <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm min-w-[600px]">
                           <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs">
                              <tr>
                                 <th className="px-6 py-4 font-bold">Applicant</th>
                                 <th className="px-6 py-4 font-bold">Role & Exp</th>
                                 <th className="px-6 py-4 font-bold">AI Risk Score</th>
                                 <th className="px-6 py-4 font-bold">Submitted</th>
                                 <th className="px-6 py-4 font-bold">Action</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                              {applications.map(app => (
                                 <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-900">{app.fullName}</td>
                                    <td className="px-6 py-4 text-slate-600">{app.role} ({app.yearsExperience}y)</td>
                                    <td className="px-6 py-4">
                                       <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${app.aiScore > 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                          {app.aiScore}/100
                                       </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{app.submittedAt}</td>
                                    <td className="px-6 py-4">
                                       <button onClick={() => setSelectedApp(app)} className="text-brand-600 font-bold hover:underline">Review</button>
                                    </td>
                                 </tr>
                              ))}
                              {applications.length === 0 && (
                                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">No applications pending.</td></tr>
                              )}
                           </tbody>
                        </table>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 'apps' && selectedApp && renderAppDetail()}

             {activeTab === 'sops' && !selectedSOP && (
                 <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">SOP Review Queue</h2>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm min-w-[600px]">
                           <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs">
                              <tr>
                                 <th className="px-6 py-4 font-bold">Title</th>
                                 <th className="px-6 py-4 font-bold">Category</th>
                                 <th className="px-6 py-4 font-bold">Steps</th>
                                 <th className="px-6 py-4 font-bold">AI Originality</th>
                                 <th className="px-6 py-4 font-bold">Action</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                              {pendingSops.map(sop => (
                                 <tr key={sop.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-900">{sop.title}</td>
                                    <td className="px-6 py-4 text-slate-600">{sop.category}</td>
                                    <td className="px-6 py-4 text-slate-600">{sop.steps.length}</td>
                                    <td className="px-6 py-4">
                                       <span className="text-green-600 font-bold">{sop.aiOriginalityScore}%</span>
                                    </td>
                                    <td className="px-6 py-4">
                                       <button onClick={() => setSelectedSOP(sop)} className="text-brand-600 font-bold hover:underline">Start Audit</button>
                                    </td>
                                 </tr>
                              ))}
                              {pendingSops.length === 0 && (
                                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">No SOPs pending review.</td></tr>
                              )}
                           </tbody>
                        </table>
                      </div>
                    </div>
                 </div>
             )}

             {activeTab === 'sops' && selectedSOP && renderSOPDetail()}
             
          </main>
       </div>
       
       {showRejectModal && <RejectionModal />}
    </div>
  );
};
