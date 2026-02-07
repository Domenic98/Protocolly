
import React, { useState, useRef, useEffect } from 'react';
import { SOP, SOPStep, ChatMessage } from '../types';
import { generateSopAssistance } from '../services/geminiService';
import { 
  CheckCircle, Circle, AlertTriangle, MessageSquare, 
  ArrowRight, Play, AlertCircle, Loader2, Send, Zap,
  FileText, Shield, Users, Clock, Calendar, CheckSquare, XCircle, Lock, Download, FileCheck, Award
} from 'lucide-react';

interface ExecutionEngineProps {
  sop: SOP;
  onBack: () => void;
}

interface LogEntry {
  stepId: string;
  title: string;
  description: string;
  role: string;
  action: string;
  timestamp: string;
}

export const ExecutionEngine: React.FC<ExecutionEngineProps> = ({ sop, onBack }) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [chatOpen, setChatOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isComplete, setIsComplete] = useState(false); // New Completion State
  
  // Input Validation State
  const [actionConfirmed, setActionConfirmed] = useState(false);
  const [decisionValue, setDecisionValue] = useState<'approved' | 'rejected' | null>(null);
  const [inputValue, setInputValue] = useState('');

  // Store all inputs for the report
  const [executionLog, setExecutionLog] = useState<LogEntry[]>([]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Safety check for empty protocols
  if (!sop.steps || sop.steps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
         <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 max-w-md text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">No Steps Defined</h2>
            <p className="text-slate-500 mb-6">This protocol currently has no executable steps. Please contact the author or support.</p>
            <button onClick={onBack} className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold">Return to Marketplace</button>
         </div>
      </div>
    );
  }

  const currentStep = sop.steps[activeStepIndex];
  const progress = Math.round((completedSteps.length / sop.steps.length) * 100);
  const executionCost = sop.price === 0 ? 1 : Math.ceil(sop.price / 50) + 1; 

  // Reset validation state when step changes
  useEffect(() => {
    setActionConfirmed(false);
    setDecisionValue(null);
    setInputValue('');
  }, [activeStepIndex]);

  // Initial Chat Message on Start
  useEffect(() => {
    if (hasStarted && messages.length === 0) {
        setMessages([
            {
              role: 'model',
              text: `Hello. I am your AI Operator for the "${sop.title}" protocol. I've reviewed the current context. Ready to begin Step 1?`,
              timestamp: new Date()
            }
        ]);
    }
  }, [hasStarted, sop.title]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Strict Validation Logic
  const canProceed = () => {
    if (currentStep.type === 'action') return actionConfirmed;
    if (currentStep.type === 'decision') return decisionValue !== null;
    if (currentStep.type === 'input') return inputValue.trim().length > 0;
    if (currentStep.type === 'automation') return true; 
    return true;
  };

  const handleNextStep = () => {
    if (!canProceed()) return;

    // Log the execution of this step
    const logEntry: LogEntry = {
        stepId: currentStep.id,
        title: currentStep.title,
        description: currentStep.description,
        role: currentStep.requiredRole || 'General Operator',
        action: currentStep.type === 'action' ? 'Confirmed Checkbox' : 
                currentStep.type === 'decision' ? `Decision: ${decisionValue?.toUpperCase()}` :
                currentStep.type === 'input' ? `Input Value: "${inputValue}"` : 'Automated Trigger',
        timestamp: new Date().toLocaleString()
    };
    
    const newLog = [...executionLog, logEntry];
    setExecutionLog(newLog);

    if (!completedSteps.includes(currentStep.id)) {
      setCompletedSteps([...completedSteps, currentStep.id]);
    }
    
    if (activeStepIndex < sop.steps.length - 1) {
      setActiveStepIndex(prev => prev + 1);
      
      // Add AI context transition message
      const nextStep = sop.steps[activeStepIndex + 1];
      setMessages(prev => [...prev, {
        role: 'model',
        text: `Moving to Step ${activeStepIndex + 2}: ${nextStep.title}. ${nextStep.requiredRole ? `Note: This requires ${nextStep.requiredRole} authorization.` : ''}`,
        timestamp: new Date()
      }]);
    } else {
        // Protocol Complete - Set complete state to show summary view
        setIsComplete(true);
    }
  };

  const handleDownloadReport = () => {
    const startTime = messages.length > 0 ? messages[0].timestamp : new Date();
    const endTime = new Date();
    const duration = Math.max(1, Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60)); // minutes

    const reportContent = `
================================================================================
                      PROTOCOLLY | EXECUTION AUDIT RECORD
================================================================================

PROTOCOL METADATA
-----------------
ID:             ${sop.id.toUpperCase()}
Title:          ${sop.title}
Version:        ${sop.version}
Category:       ${sop.category}
Risk Class:     ${sop.riskClass}
Jurisdiction:   ${sop.jurisdiction}

EXECUTION CONTEXT
-----------------
Session ID:     ${Math.random().toString(36).substr(2, 9).toUpperCase()}
User:           Active Operator (Licensed)
Date:           ${endTime.toLocaleDateString()}
Time Started:   ${startTime.toLocaleTimeString()}
Time Completed: ${endTime.toLocaleTimeString()}
Duration:       ${duration} minutes
Status:         ${isComplete ? 'COMPLETED' : 'PARTIAL / IN PROGRESS'}

--------------------------------------------------------------------------------
                                EXECUTION LOG
--------------------------------------------------------------------------------

${executionLog.map((log, i) => {
return `STEP ${i + 1}: ${log.title.toUpperCase()}
   • Description:  ${log.description || 'N/A'}
   • Role Required:${log.role}
   • Action Taken: ${log.action}
   • Timestamp:    ${log.timestamp}
   • Status:       VERIFIED
--------------------------------------------------------------------------------`
}).join('\n')}

${!isComplete ? `
[!] ALERT: EXECUTION HALTED PREMATURELY
    Reason: Manual download requested before completion.
    Remaining Steps: ${sop.steps.length - completedSteps.length}
` : `
[✓] SUCCESS: PROTOCOL COMPLETED
    All mandatory steps verified, logged, and cryptographically hashed.
    Compliance Standard Met.
`}

================================================================================
Generated by Protocolly OS. 
This document is an immutable record of operational execution.
================================================================================
`.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sop.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_AUDIT_LOG.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const context = `Executing SOP: ${sop.title}. Progress: ${progress}%.`;
    const aiResponseText = await generateSopAssistance(currentStep, userMsg.text, context);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'model', text: aiResponseText, timestamp: new Date() }]);
  };

  // --- COVER PAGE VIEW ---
  if (!hasStarted) {
      return (
          <div className="min-h-screen bg-slate-50 overflow-y-auto">
              {/* Header Bar */}
              <div className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex justify-between items-center shadow-sm">
                  <div className="flex items-center gap-4">
                      <button onClick={onBack} className="text-slate-500 hover:text-slate-900 flex items-center text-sm font-bold">
                          <ArrowRight className="w-4 h-4 mr-1 rotate-180" /> Exit
                      </button>
                      <div className="h-6 w-px bg-slate-200"></div>
                      <span className="text-slate-400 text-xs font-mono uppercase">Protocol ID: {sop.id.toUpperCase()}</span>
                  </div>
                  <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          sop.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                          {sop.status}
                      </span>
                  </div>
              </div>

              <div className="max-w-5xl mx-auto p-8 md:p-12 space-y-12">
                  
                  {/* Title Block */}
                  <div className="text-center border-b border-slate-200 pb-12">
                      <div className="inline-flex items-center justify-center p-3 bg-slate-100 rounded-xl mb-6">
                          <FileText className="w-8 h-8 text-slate-400" />
                      </div>
                      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight max-w-4xl mx-auto">{sop.title}</h1>
                      <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">{sop.description}</p>
                      
                      <div className="mt-8 flex flex-wrap justify-center gap-4">
                          <button 
                            onClick={() => setHasStarted(true)}
                            className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gold-500 hover:text-slate-900 transition-all shadow-xl shadow-slate-200 flex items-center"
                          >
                              <Play className="w-5 h-5 mr-2 fill-current" /> Initialize Protocol
                          </button>
                      </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Version</label>
                          <p className="font-mono text-sm font-bold text-slate-900">{sop.version}</p>
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Effective Date</label>
                          <p className="font-mono text-sm font-bold text-slate-900">{sop.effectiveDate || 'N/A'}</p>
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Review Cycle</label>
                          <p className="font-mono text-sm font-bold text-slate-900">{sop.reviewCycle}</p>
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Risk Class</label>
                          <p className={`font-mono text-sm font-bold ${sop.riskClass === 'High' ? 'text-red-600' : 'text-slate-900'}`}>{sop.riskClass}</p>
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Owner</label>
                          <p className="font-mono text-sm font-bold text-slate-900">{sop.sopOwner || 'Ops Lead'}</p>
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approved By</label>
                          <p className="font-mono text-sm font-bold text-slate-900">{sop.approvedBy || 'Compliance'}</p>
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Jurisdiction</label>
                          <p className="font-mono text-sm font-bold text-slate-900">{sop.jurisdiction}</p>
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tier</label>
                          <p className="font-mono text-sm font-bold text-slate-900">{sop.tierAccess}</p>
                      </div>
                  </div>

                  {/* Core Content */}
                  <div className="grid md:grid-cols-3 gap-8">
                      <div className="md:col-span-2 space-y-8">
                          <section>
                              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center"><Zap className="w-4 h-4 mr-2 text-gold-500" /> Purpose & Outcome</h3>
                              <p className="text-slate-600 leading-relaxed text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                                  {sop.purpose}
                              </p>
                          </section>

                          <section>
                              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center"><Shield className="w-4 h-4 mr-2 text-blue-500" /> Scope</h3>
                              <p className="text-slate-600 leading-relaxed text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                                  {sop.scope}
                              </p>
                          </section>

                          <section>
                              <h3 className="text-lg font-bold text-slate-900 mb-3">Roles & Responsibilities</h3>
                              <div className="space-y-3">
                                  {sop.roles?.map((role, i) => (
                                      <div key={i} className="flex gap-4 p-3 border border-slate-100 rounded-lg">
                                          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                                              {role.role.charAt(0)}
                                          </div>
                                          <div>
                                              <p className="font-bold text-slate-900 text-sm">{role.role}</p>
                                              <p className="text-xs text-slate-500">{role.responsibilities}</p>
                                          </div>
                                      </div>
                                  ))}
                                  {(!sop.roles || sop.roles.length === 0) && <p className="text-sm text-slate-400 italic">No specific roles defined.</p>}
                              </div>
                          </section>
                          
                          <section>
                              <h3 className="text-lg font-bold text-slate-900 mb-3">Execution Map Preview</h3>
                              <div className="border-l-2 border-slate-200 pl-6 space-y-4">
                                  {sop.steps.map((step, i) => (
                                      <div key={i} className="relative">
                                          <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                                          <p className="text-sm font-bold text-slate-700">{step.title}</p>
                                          <p className="text-xs text-slate-400 truncate">{step.type}</p>
                                      </div>
                                  ))}
                              </div>
                          </section>
                      </div>

                      <div className="space-y-8">
                          <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                              <h3 className="font-bold text-red-800 mb-4 flex items-center text-sm uppercase tracking-wide"><AlertTriangle className="w-4 h-4 mr-2" /> Known Risks</h3>
                              <ul className="space-y-3">
                                  {sop.risks?.map((risk, i) => (
                                      <li key={i} className="text-xs text-red-700 bg-white p-3 rounded border border-red-100 shadow-sm">
                                          <span className="font-bold block mb-1">{risk.trigger}</span>
                                          {risk.mitigation}
                                      </li>
                                  ))}
                                  {(!sop.risks || sop.risks.length === 0) && <li className="text-xs text-slate-400">No risks documented.</li>}
                              </ul>
                          </div>

                          <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                              <h3 className="font-bold text-green-800 mb-4 flex items-center text-sm uppercase tracking-wide"><CheckCircle className="w-4 h-4 mr-2" /> Prerequisites</h3>
                              <ul className="space-y-2">
                                  {sop.prerequisites?.map((pre, i) => (
                                      <li key={i} className="flex items-start text-xs text-green-800">
                                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 mt-1 shrink-0"></div>
                                          {pre}
                                      </li>
                                  ))}
                                  {(!sop.prerequisites || sop.prerequisites.length === 0) && <li className="text-xs text-slate-400">None.</li>}
                              </ul>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  // --- COMPLETION VIEW ---
  if (isComplete) {
      return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
              <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-slate-200 max-w-lg text-center animate-fade-in">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Award className="w-12 h-12 text-green-600" />
                  </div>
                  <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Protocol Executed</h1>
                  <p className="text-slate-500 mb-8 leading-relaxed">
                      You have successfully completed all <strong>{sop.steps.length}</strong> steps of the "{sop.title}" protocol. An immutable audit record has been generated.
                  </p>
                  
                  <div className="space-y-4">
                      <button 
                          onClick={handleDownloadReport}
                          className="w-full bg-slate-900 text-white px-6 py-4 rounded-xl font-bold hover:bg-gold-500 hover:text-slate-900 transition-all shadow-lg flex items-center justify-center"
                      >
                          <Download className="w-5 h-5 mr-2" /> Download Final Audit Report
                      </button>
                      <button 
                          onClick={onBack}
                          className="w-full bg-white border border-slate-200 text-slate-600 px-6 py-4 rounded-xl font-bold hover:bg-slate-50 hover:text-slate-900 transition-all"
                      >
                          Return to Dashboard
                      </button>
                  </div>
                  <div className="mt-6 text-xs text-slate-400 flex items-center justify-center">
                      <FileCheck className="w-3 h-3 mr-1" /> Log ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                  </div>
              </div>
          </div>
      );
  }

  // --- EXECUTION MODE VIEW ---
  return (
    <div className="flex flex-col lg:flex-row bg-slate-50 min-h-[calc(100vh-64px)] lg:h-[calc(100vh-64px)] lg:overflow-hidden">
      
      {/* Sidebar: Step List */}
      <div className="w-full lg:w-80 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 lg:overflow-y-auto flex flex-col max-h-48 lg:max-h-full">
        <div className="p-4 border-b border-slate-100">
          <div className="flex justify-between items-center mb-2">
             <button onClick={onBack} className="text-sm text-slate-500 hover:text-brand-600 flex items-center"><ArrowRight className="w-3 h-3 mr-1 rotate-180" /> Exit</button>
             <button onClick={handleDownloadReport} className="text-xs font-bold text-brand-600 flex items-center bg-brand-50 px-3 py-1.5 rounded hover:bg-brand-100 transition-colors shadow-sm border border-brand-200" title="Download Partial Audit Record">
                <Download className="w-3 h-3 mr-1.5" /> Save Log
             </button>
          </div>
          <h2 className="font-bold text-slate-900 leading-tight">{sop.title}</h2>
          
          <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
             <span className="flex items-center"><Zap className="w-3 h-3 text-gold-500 mr-1" /> Cost: {executionCost} Credits</span>
             <span className="text-green-600">Active</span>
          </div>

          <div className="mt-3 bg-slate-100 rounded-full h-2 w-full overflow-hidden">
            <div className="bg-brand-500 h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="mt-1 text-xs text-slate-500 flex justify-between">
            <span>{progress}% Complete</span>
            <span>{completedSteps.length}/{sop.steps.length} Steps</span>
          </div>
        </div>
        <div className="flex-1 py-2 overflow-y-auto">
          {sop.steps.map((step, idx) => {
            const isActive = idx === activeStepIndex;
            const isCompleted = completedSteps.includes(step.id);
            return (
              <div 
                key={step.id}
                className={`px-4 py-3 border-l-4 transition-colors ${
                  isActive ? 'bg-brand-50 border-brand-500' : 'border-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                     {isCompleted ? (
                       <CheckCircle className="h-5 w-5 text-green-500" />
                     ) : isActive ? (
                       <Circle className="h-5 w-5 text-brand-500 fill-brand-100" />
                     ) : (
                       <Circle className="h-5 w-5 text-slate-300" />
                     )}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${isActive ? 'text-brand-900' : 'text-slate-700'}`}>
                      {idx + 1}. {step.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 truncate uppercase">{step.type}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content: Current Step */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 flex items-center space-x-2">
            <span className={`px-2 py-1 rounded text-xs font-mono uppercase font-bold tracking-wide ${
                currentStep.type === 'decision' ? 'bg-amber-100 text-amber-700' :
                currentStep.type === 'action' ? 'bg-blue-100 text-blue-700' :
                'bg-slate-200 text-slate-600'
            }`}>
                {currentStep.type} Node
            </span>
            {currentStep.requiredRole && (
              <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium border border-slate-200 flex items-center">
                <Lock className="w-3 h-3 mr-1" /> {currentStep.requiredRole}
              </span>
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">{currentStep.title}</h1>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
             <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed mb-4">
                {currentStep.description}
             </div>
             {currentStep.details && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-700 flex gap-3">
                <FileText className="w-5 h-5 text-slate-400 shrink-0" />
                <div>
                    <span className="font-bold block text-slate-900 mb-1">Details & Criteria</span>
                    {currentStep.details}
                </div>
              </div>
            )}
          </div>

          {/* Action Area */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-inner mb-12">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center text-sm uppercase tracking-wider">
              <Play className="h-4 w-4 mr-2 text-brand-500" /> Action Required
            </h3>
            
            {currentStep.type === 'decision' && (
              <div className="space-y-4">
                  <p className="text-sm text-slate-600 mb-2">You must make a definitive choice to proceed.</p>
                  <div className="flex gap-4">
                    <button 
                        onClick={() => setDecisionValue('approved')}
                        className={`flex-1 py-4 border-2 rounded-xl font-bold transition-all flex items-center justify-center ${
                            decisionValue === 'approved' 
                            ? 'bg-green-600 border-green-600 text-white shadow-lg transform scale-[1.02]' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-green-400 hover:text-green-600'
                        }`}
                    >
                        <CheckCircle className="w-5 h-5 mr-2" /> Approve / Yes
                    </button>
                    <button 
                        onClick={() => setDecisionValue('rejected')}
                        className={`flex-1 py-4 border-2 rounded-xl font-bold transition-all flex items-center justify-center ${
                            decisionValue === 'rejected' 
                            ? 'bg-red-600 border-red-600 text-white shadow-lg transform scale-[1.02]' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-red-400 hover:text-red-600'
                        }`}
                    >
                        <XCircle className="w-5 h-5 mr-2" /> Reject / No
                    </button>
                  </div>
              </div>
            )}

            {currentStep.type === 'action' && (
               <div 
                 className={`bg-white p-4 rounded-xl border-2 transition-colors cursor-pointer ${actionConfirmed ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300'}`} 
                 onClick={() => setActionConfirmed(!actionConfirmed)}
               >
                 <div className="flex items-start gap-4">
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors mt-0.5 shrink-0 ${
                        actionConfirmed ? 'bg-brand-600 border-brand-600' : 'bg-white border-slate-300'
                    }`}>
                        {actionConfirmed && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <div>
                        <span className={`font-bold block mb-1 ${actionConfirmed ? 'text-brand-800' : 'text-slate-900'}`}>Confirm Execution</span>
                        <span className="text-sm text-slate-500">I verify that I have completed the action described above in the relevant system.</span>
                    </div>
                 </div>
               </div>
            )}

            {currentStep.type === 'input' && (
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Required Input</label>
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter value to proceed..."
                        className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm shadow-sm"
                    />
                </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center">
              <span className="text-xs text-slate-400 italic">
                  Step {activeStepIndex + 1} of {sop.steps.length}
              </span>
              <button 
                onClick={handleNextStep}
                disabled={!canProceed()}
                className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center ${
                    canProceed() 
                    ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-200 cursor-pointer' 
                    : 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed opacity-70'
                }`}
              >
                Complete & Next <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: AI Assistant */}
      <div className={`border-t lg:border-t-0 lg:border-l border-slate-200 bg-white flex flex-col transition-all duration-300 ${chatOpen ? 'w-full lg:w-96 h-96 lg:h-full' : 'w-full lg:w-12 h-12 lg:h-full'}`}>
        
        {/* Chat Toggle */}
        <div className="h-12 border-b border-slate-100 flex items-center justify-between px-4 bg-slate-50 cursor-pointer" onClick={() => setChatOpen(!chatOpen)}>
          <div className="flex items-center text-sm font-semibold text-slate-700">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              {chatOpen ? "AI Operator" : ""}
          </div>
          <button className="p-1 hover:bg-slate-200 rounded">
            {chatOpen ? <ArrowRight className="h-4 w-4 rotate-90 lg:rotate-0" /> : <MessageSquare className="h-4 w-4" />}
          </button>
        </div>

        {chatOpen && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-brand-600 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-brand-500" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-slate-200">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about this step..."
                  className="w-full pr-10 pl-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!input.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-brand-500 hover:text-white transition-colors disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['Explain risk', 'Show example', 'Skip step'].map(suggestion => (
                   <button 
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="whitespace-nowrap px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-600 hover:bg-slate-100"
                   >
                     {suggestion}
                   </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
