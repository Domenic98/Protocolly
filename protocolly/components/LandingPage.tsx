
import React, { useState } from 'react';
import { Logo } from './Logo';
import { 
  ArrowRight, CheckCircle, Shield, Zap, RefreshCw, BarChart3, Users, 
  Globe, Twitter, Linkedin, Star, Menu, X, Check, Crown, Lock, Server,
  AlertTriangle, Clock, FileText, Activity, AlertOctagon, GitBranch, XCircle, MapPin, Phone, Mail
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  onEnterpriseStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onEnterpriseStart }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [comparisonMode, setComparisonMode] = useState<'before' | 'after'>('before');

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const preventDefault = (e: React.MouseEvent) => e.preventDefault();

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-gold-100 selection:text-slate-900">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-xl border-b border-slate-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Logo />
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#orientation" onClick={(e) => handleNavClick(e, 'orientation')} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Philosophy</a>
              <a href="#reality" onClick={(e) => handleNavClick(e, 'reality')} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Before/After</a>
              <a href="#marketplace" onClick={(e) => handleNavClick(e, 'marketplace')} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Marketplace</a>
              <a href="#pricing" onClick={(e) => handleNavClick(e, 'pricing')} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Access</a>
              <button 
                onClick={onEnterApp}
                className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gold-500 hover:text-slate-900 transition-all hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Getting Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-600 hover:text-slate-900 p-2"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-4 pb-6 space-y-4 shadow-xl absolute w-full z-50">
             <a href="#orientation" onClick={(e) => handleNavClick(e, 'orientation')} className="block py-2 text-base font-medium text-slate-600 hover:text-slate-900">Philosophy</a>
             <a href="#reality" onClick={(e) => handleNavClick(e, 'reality')} className="block py-2 text-base font-medium text-slate-600 hover:text-slate-900">Before/After</a>
             <a href="#pricing" onClick={(e) => handleNavClick(e, 'pricing')} className="block py-2 text-base font-medium text-slate-600 hover:text-slate-900">Access</a>
             <div className="pt-4">
               <button 
                  onClick={() => { setMobileMenuOpen(false); onEnterApp(); }}
                  className="w-full bg-slate-900 text-white px-6 py-3 rounded-xl text-base font-bold hover:bg-gold-500 hover:text-slate-900 transition-colors"
                >
                  Getting Started
                </button>
             </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider mb-8 border border-slate-200">
                The Operating System for Execution
              </div>
              
              <h1 className="text-4xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight">
                Documents don’t run businesses. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600">
                   Execution systems do.
                </span>
              </h1>
              
              <div className="text-lg lg:text-xl text-slate-600 mb-12 max-w-4xl mx-auto lg:mx-0 leading-relaxed font-light space-y-4">
                <p>PROTOCOLLY turns operational knowledge into systems that guide action, enforce decisions, and leave an audit trail.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={onEnterApp}
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-gold-500 hover:text-slate-900 transition-all shadow-xl shadow-slate-200 hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center group"
                >
                  Explore Marketplace <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Hero Visual - Abstract Process */}
            <div className="lg:col-span-5 mt-16 lg:mt-0 relative hidden lg:block">
               <div className="relative rounded-2xl shadow-2xl bg-white border border-slate-200 p-8 transform rotate-2 hover:rotate-0 transition-all duration-700">
                  <div className="flex flex-col items-center space-y-4">
                      {/* Diagram */}
                      <div className="flex items-center w-full justify-between opacity-50">
                          <div className="h-20 w-24 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-400">INPUT</div>
                          <ArrowRight className="text-slate-300" />
                          <div className="h-20 w-24 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-400">PROCESS</div>
                          <ArrowRight className="text-slate-300" />
                          <div className="h-20 w-24 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-400">RESULT</div>
                      </div>
                      
                      {/* Active Layer */}
                      <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-slate-900 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-3">
                              <Zap className="w-5 h-5 text-gold-500" />
                              <span className="font-bold text-sm">Execution Engine Active</span>
                          </div>
                      </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of sections... */}
      <section className="py-24 bg-white border-t border-slate-100" id="orientation">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 flex flex-col items-center justify-center text-center space-y-6">
                      <div className="flex items-center gap-4 text-slate-400 font-mono text-xs uppercase tracking-widest">
                          <span>Process</span>
                          <ArrowRight className="w-4 h-4" />
                          <span className="text-slate-900 font-bold bg-gold-100 px-2 py-1 rounded">Decision</span>
                          <ArrowRight className="w-4 h-4" />
                          <span>Outcome</span>
                      </div>
                      <p className="text-sm text-slate-500 italic max-w-xs">
                          "Most software tracks the outcome. We govern the decision."
                      </p>
                  </div>
                  <div>
                      <h2 className="text-3xl font-bold text-slate-900 mb-6">Execution, not documentation.</h2>
                      <p className="text-lg text-slate-600 leading-relaxed mb-6">
                          Businesses don’t fail because people don’t work hard. They fail because critical steps are skipped, misunderstood, or improvised.
                      </p>
                      <p className="text-lg text-slate-600 leading-relaxed">
                          PROTOCOLLY replaces static documents with live systems that guide action, enforce decisions, and leave an audit trail.
                      </p>
                  </div>
              </div>
          </div>
      </section>

      {/* SECTION 2: WHAT BREAKS WITHOUT THIS */}
      <section className="py-24 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
              <div className="text-center mb-16">
                  <h2 className="text-2xl font-bold text-slate-900">What breaks without a system?</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                      <Clock className="w-8 h-8 text-slate-400 mb-6" />
                      <h3 className="font-bold text-lg text-slate-900 mb-2">SOPs become outdated</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">
                          The moment a PDF is saved, it starts decaying. Teams end up executing old versions of the truth.
                      </p>
                  </div>
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                      <Users className="w-8 h-8 text-slate-400 mb-6" />
                      <h3 className="font-bold text-lg text-slate-900 mb-2">Execution depends on who’s working</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">
                          Tribal knowledge means performance varies wildly between your best operator and your newest hire.
                      </p>
                  </div>
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                      <AlertOctagon className="w-8 h-8 text-slate-400 mb-6" />
                      <h3 className="font-bold text-lg text-slate-900 mb-2">Compliance is proven after the fact</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">
                          You only find out a step was skipped when the audit fails or the customer complains.
                      </p>
                  </div>
              </div>
              <div className="text-center mt-12">
                  <p className="text-slate-400 font-medium text-sm">This isn’t a documentation problem. It’s an execution problem.</p>
              </div>
          </div>
      </section>

      {/* SECTION 3: WHAT CHANGES (INTERACTIVE) */}
      <section className="py-24 bg-white" id="reality">
          <div className="max-w-5xl mx-auto px-4 md:px-8">
              <div className="flex justify-center mb-12">
                  <div className="bg-slate-100 p-1 rounded-xl inline-flex">
                      <button 
                        onClick={() => setComparisonMode('before')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${comparisonMode === 'before' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                          Before Protocolly
                      </button>
                      <button 
                        onClick={() => setComparisonMode('after')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${comparisonMode === 'after' ? 'bg-slate-900 shadow-sm text-white' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                          After Protocolly
                      </button>
                  </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8 text-center">
                  {comparisonMode === 'before' ? (
                      <>
                        <div className="p-6 animate-fade-in">
                            <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <FileText className="w-6 h-6 text-slate-400" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Static Documents</h3>
                            <p className="text-slate-500 text-sm">Read once, forgotten immediately.</p>
                        </div>
                        <div className="p-6 animate-fade-in">
                            <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <Users className="w-6 h-6 text-slate-400" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Manual Judgment</h3>
                            <p className="text-slate-500 text-sm">Every employee decides their own way.</p>
                        </div>
                        <div className="p-6 animate-fade-in">
                            <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="w-6 h-6 text-slate-400" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Post-Incident Explanations</h3>
                            <p className="text-slate-500 text-sm">"I thought I was supposed to..."</p>
                        </div>
                      </>
                  ) : (
                      <>
                        <div className="p-6 animate-scale-in">
                            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <Zap className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Guided Execution</h3>
                            <p className="text-slate-500 text-sm">Step-by-step enforcement at point of work.</p>
                        </div>
                        <div className="p-6 animate-scale-in">
                            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <GitBranch className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Decision Enforcement</h3>
                            <p className="text-slate-500 text-sm">Logic gates prevent bad choices.</p>
                        </div>
                        <div className="p-6 animate-scale-in">
                            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <Shield className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Verifiable History</h3>
                            <p className="text-slate-500 text-sm">Immutable logs of who did what, when.</p>
                        </div>
                      </>
                  )}
              </div>
          </div>
      </section>

      {/* SECTION 4: WHO USES THIS (SCENARIOS) */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                      "Regulated SMBs",
                      "Multi-location Operators",
                      "Franchise Systems",
                      "Scaling Startups"
                  ].map((label, i) => (
                      <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 text-center font-bold text-slate-700 hover:border-slate-400 transition-colors cursor-default">
                          {label}
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* SECTION 5: PRODUCT REALITY (UI PREVIEW) */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="lg:grid lg:grid-cols-2 gap-16 items-center">
                  <div>
                      <div className="inline-block px-3 py-1 rounded bg-gold-500/20 text-gold-400 text-xs font-bold uppercase tracking-wider mb-6">
                          Interface Philosophy
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold mb-6">This is not a document.<br/>This is a decision system.</h2>
                      <p className="text-slate-400 leading-relaxed mb-8">
                          Users read value directly in the UI. We don't just say "Do X". We say "If this step is skipped, regulatory escalation is triggered."
                      </p>
                      <div className="space-y-6">
                          <div className="flex gap-4">
                              <div className="w-1 h-full bg-gold-500 rounded-full"></div>
                              <div>
                                  <h4 className="font-bold text-white text-sm">Inline Logic</h4>
                                  <p className="text-slate-500 text-sm">"Based on your input, this path reduces exposure."</p>
                              </div>
                          </div>
                          <div className="flex gap-4">
                              <div className="w-1 h-full bg-red-500 rounded-full"></div>
                              <div>
                                  <h4 className="font-bold text-white text-sm">Failure Handling</h4>
                                  <p className="text-slate-500 text-sm">"What happens if this fails? Who is notified?"</p>
                              </div>
                          </div>
                      </div>
                  </div>
                  
                  <div className="mt-12 lg:mt-0 relative">
                      <div className="absolute inset-0 bg-gold-500/20 blur-[80px] rounded-full"></div>
                      <div className="relative bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl">
                          <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                              <div className="text-xs font-mono text-slate-400">PROTOCOL: INCIDENT_RESPONSE_V4</div>
                              <div className="flex gap-2">
                                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                  <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                              </div>
                          </div>
                          <div className="space-y-4">
                              <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-gold-500">
                                  <p className="text-xs text-gold-500 font-bold uppercase mb-1">Decision Node</p>
                                  <p className="text-white font-bold mb-2">Is user data impacted?</p>
                                  <div className="flex gap-2">
                                      <button className="bg-slate-700 px-4 py-2 rounded text-xs text-white hover:bg-slate-600">Yes</button>
                                      <button className="bg-slate-700 px-4 py-2 rounded text-xs text-white hover:bg-slate-600">No</button>
                                  </div>
                              </div>
                              <div className="bg-red-900/20 p-4 rounded-lg border border-red-900/50">
                                  <p className="text-xs text-red-400 font-bold mb-1 flex items-center"><AlertTriangle className="w-3 h-3 mr-1" /> Critical Checkpoint</p>
                                  <p className="text-slate-300 text-xs">If "Yes" is selected, Legal Counsel is auto-notified within 15 mins.</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* SECTION 6: ENTERPRISE (Low Key) */}
      <section className="py-24 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
              <Lock className="w-12 h-12 text-slate-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Private deployment for regulated operations.</h2>
              <p className="text-slate-600 mb-8 max-w-xl mx-auto">
                  Some processes should never be public. Private SOPs are isolated, permissioned, and excluded from marketplace visibility and AI training by default.
              </p>
              <div className="inline-block bg-slate-50 px-6 py-4 rounded-xl border border-slate-200">
                  <p className="text-sm font-medium text-slate-800">
                      "Audits don’t ask what your policy is. They ask what actually happened."
                  </p>
              </div>
              <div className="mt-8">
                  <button onClick={onEnterpriseStart} className="text-slate-900 font-bold text-sm border-b-2 border-slate-900 hover:border-transparent transition-all">
                      Discuss Enterprise Deployment
                  </button>
              </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
                <div className="col-span-1 md:col-span-2">
                    <Logo />
                    <p className="mt-4 text-sm text-slate-500 max-w-xs">
                        The Operating System for Execution. Ensuring consistency, compliance, and scalability for modern organizations.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Company</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li><a href="#" className="hover:text-slate-900">About</a></li>
                        <li><a href="#" className="hover:text-slate-900">Careers</a></li>
                        <li><a href="#" className="hover:text-slate-900">Press</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Contact</h4>
                    <ul className="space-y-3 text-sm text-slate-600">
                        <li className="flex items-start">
                            <MapPin className="w-4 h-4 mr-2 text-slate-400 shrink-0 mt-0.5" />
                            <span>100 Pine Street, Suite 1250<br/>San Francisco, CA 94111</span>
                        </li>
                        <li className="flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                            <span>+1 (415) 555-0123</span>
                        </li>
                        <li className="flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                            <span>hello@protocolly.com</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm gap-4">
                <p>&copy; {new Date().getFullYear()} PROTOCOLLY Inc. All rights reserved.</p>
                <div className="flex gap-6">
                    <a href="#" onClick={preventDefault} className="hover:text-slate-900">Privacy</a>
                    <a href="#" onClick={preventDefault} className="hover:text-slate-900">Terms</a>
                    <a href="#" onClick={preventDefault} className="hover:text-slate-900">Security</a>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};
