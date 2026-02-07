
import React from 'react';
import { 
  Shield, Lock, FileCheck, Activity, 
  Building2, ArrowRight, CheckCircle, Server, 
  FileText, Scale, Zap, CreditCard, ChevronRight
} from 'lucide-react';
import { Logo } from './Logo';

interface EnterpriseSalesPageProps {
  onLogin: () => void; // Used for Access System
  onBack: () => void;
}

export const EnterpriseSalesPage: React.FC<EnterpriseSalesPageProps> = ({ onLogin, onBack }) => {
  
  const handleAccessSystem = () => {
    // Directs to payment gateway/access unlock
    onLogin();
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-gold-500 selection:text-white">
      {/* Nav */}
      <nav className="border-b border-slate-100 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
             <div onClick={onBack} className="cursor-pointer">
                <Logo />
             </div>
             <div className="hidden md:flex items-center space-x-1">
                <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 tracking-wide uppercase">
                   Enterprise Edition
                </span>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={handleAccessSystem} className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center">
                Access System <ChevronRight className="ml-2 w-4 h-4" />
             </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-24 pb-32 overflow-hidden bg-white">
         <div className="max-w-5xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight text-slate-900">
               Operational Control You Can <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500">Prove</span>, <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-600 to-gold-500">Audit</span>, and <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600">Scale.</span>
            </h1>
            <p className="text-xl text-slate-500 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
               Documents don’t run businesses. Execution systems do. <br/>
               PROTOCOLLY Enterprise converts your static SOPs into private, executable workflows with built-in compliance and real-time intelligence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
               <button onClick={handleAccessSystem} className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gold-500 hover:text-slate-900 transition-all flex items-center justify-center shadow-xl shadow-slate-200">
                  Access System <CreditCard className="ml-2 w-5 h-5" />
               </button>
            </div>
         </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
               <div>
                  <span className="text-gold-600 font-bold uppercase tracking-wider text-sm">The Solution</span>
                  <h2 className="text-4xl font-bold mt-2 mb-6 text-slate-900">A Private Execution Layer</h2>
                  <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                     PROTOCOLLY isn't just a place to store files. It's a middleware that sits between your policy and your people, enforcing logic and capturing data.
                  </p>
                  
                  <div className="space-y-6">
                     {[
                        { title: "Private SOP Vaults", desc: "Encrypted, role-restricted repositories.", icon: Lock },
                        { title: "Executable Engine", desc: "AI-guided workflows that prevent skipping steps.", icon: Zap },
                        { title: "Compliance Audit Logs", desc: "Immutable execution records.", icon: FileCheck },
                        { title: "Governance & Control", desc: "Mandatory review schedules and approval chains.", icon: Scale },
                     ].map((feat, i) => (
                        <div key={i} className="flex gap-4 group">
                           <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-gold-50 group-hover:border-gold-200 transition-colors">
                              <feat.icon className="w-6 h-6 text-gold-500" />
                           </div>
                           <div>
                              <h4 className="font-bold text-lg text-slate-900">{feat.title}</h4>
                              <p className="text-slate-500 text-sm">{feat.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               
               <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-gold-100 to-slate-100 rounded-3xl blur-2xl transform rotate-3"></div>
                  <div className="relative bg-white border border-slate-200 rounded-2xl p-2 shadow-2xl">
                     <div className="bg-slate-50 rounded-xl overflow-hidden p-8">
                        <div className="flex items-center gap-4 mb-6">
                           <Shield className="w-8 h-8 text-gold-500" />
                           <h3 className="text-xl font-bold text-slate-900">Vault Security Active</h3>
                        </div>
                        <div className="space-y-3">
                           <div className="h-2 bg-slate-200 rounded w-full"></div>
                           <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                           <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                        </div>
                        <div className="mt-8 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                           <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-500">Audit Status</span>
                              <span className="text-green-600 font-bold flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Compliant</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Pricing Anchor */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
         <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-12 text-slate-900">Enterprise Pricing</h2>
            
            <div className="bg-white border-2 border-slate-900 rounded-3xl shadow-2xl relative overflow-hidden max-w-sm mx-auto">
               <div className="absolute top-0 inset-x-0 h-2 bg-gold-500"></div>
               <div className="p-8">
                  <div className="text-gold-600 text-sm font-bold uppercase tracking-wider mb-2">Full Suite Access</div>
                  <div className="text-5xl font-bold text-slate-900 mb-4">$1,499<span className="text-2xl text-slate-400 font-normal">/mo</span></div>
                  <p className="text-slate-500 mb-8 text-sm">
                     For Companies and Individuals that Require Exclusivity and High Grade Security.
                  </p>
                  
                  <ul className="space-y-4 mb-8 text-left text-sm">
                     <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 text-slate-900 shrink-0" /> Everything in Professional</li>
                     <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 text-slate-900 shrink-0" /> Private SOP Vault (Encryption)</li>
                     <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 text-slate-900 shrink-0" /> SSO & Audit Logs</li>
                     <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 text-slate-900 shrink-0" /> Dedicated Success Manager</li>
                  </ul>

                  <button 
                     onClick={handleAccessSystem}
                     className="w-full bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gold-500 hover:text-slate-900 transition-colors shadow-lg"
                  >
                     Unlock Enterprise
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 text-center text-slate-500 text-sm bg-white">
         <p>&copy; 2024 PROTOCOLLY Inc. Enterprise Division.</p>
         <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="hover:text-slate-900 transition-colors">Master Service Agreement</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Security Whitepaper</a>
         </div>
      </footer>
    </div>
  );
};
