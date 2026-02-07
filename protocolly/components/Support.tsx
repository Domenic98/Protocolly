
import React, { useState } from 'react';
import { Search, Mail, MessageSquare, FileText, ChevronRight, HelpCircle, ChevronDown, ArrowLeft, BookOpen, Layers, GitBranch, Zap } from 'lucide-react';

export const Support: React.FC = () => {
  const [activeView, setActiveView] = useState<'main' | 'guides' | 'forum' | 'billing'>('main');
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    { q: "How do I export execution logs for audit?", a: "Go to the Dashboard, select the specific SOP, and click the 'Export CSV' button in the top right corner. Enterprise users can also access the global Audit Log via the Enterprise Portal." },
    { q: "Can I invite external contractors to a private SOP?", a: "Yes. In the SOP settings, use the 'Share' feature to generate a secure, time-limited link. You can revoke access at any time." },
    { q: "What happens to my data if I cancel?", a: "We retain your data for 30 days post-cancellation to allow for retrieval. After that, all private protocol data is permanently deleted in accordance with our data retention policy." },
    { q: "How does the Creator Royalty split work?", a: "Creators earn 70% of the revenue generated from their SOPs (subscriptions or one-time purchases). 'Verified Expert' tier creators are eligible for an 80% split." }
  ];

  const articles: Record<string, { title: string, content: React.ReactNode }> = {
    'Getting Started with the Editor': {
      title: 'Getting Started with the Editor',
      content: (
        <div className="space-y-4 text-slate-600">
          <p>The PROTOCOLLY Editor is designed to build <strong>executable systems</strong>, not static documents. This guide covers the basics.</p>
          <h4 className="font-bold text-slate-900 mt-4">1. Defining Steps</h4>
          <p>Every step must be actionable. Avoid vague instructions like "Think about the customer." Instead, use "Log customer sentiment score."</p>
          <h4 className="font-bold text-slate-900 mt-4">2. Step Types</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Action:</strong> A checkbox the user must complete.</li>
            <li><strong>Decision:</strong> A branching path (Yes/No) that changes the flow.</li>
            <li><strong>Input:</strong> A field where data (numbers, text) is captured.</li>
          </ul>
        </div>
      )
    },
    'Best Practices for Decision Logic': {
      title: 'Best Practices for Decision Logic',
      content: (
        <div className="space-y-4 text-slate-600">
           <p>Logic nodes are the brain of your SOP. They prevent errors by guiding users down the correct path automatically.</p>
           <h4 className="font-bold text-slate-900 mt-4">Binary Decisions</h4>
           <p>Keep decisions binary when possible. "Is the risk score > 50?" is better than "Is the risk high?"</p>
        </div>
      )
    },
    'Versioning Strategy 101': {
       title: 'Versioning Strategy 101',
       content: (
          <div className="space-y-4 text-slate-600">
             <p>Never delete an SOP. Version it. This ensures audit trails remain intact.</p>
             <p>When you publish v2.0, all active users will see an "Update Available" badge. Enterprise users can force-migrate their teams.</p>
          </div>
       )
    },
    'Integrating Webhooks': {
       title: 'Integrating Webhooks',
       content: (
          <div className="space-y-4 text-slate-600">
             <p>Connect PROTOCOLLY to Slack, Jira, or Salesforce.</p>
             <p>Go to Settings API Keys to generate a secret. Use this secret to sign your payloads.</p>
          </div>
       )
    }
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleGuideClick = (title: string) => {
     setSelectedArticle(title);
  };

  const renderContent = () => {
    if (activeView === 'guides') {
      if (selectedArticle && articles[selectedArticle]) {
         const article = articles[selectedArticle];
         return (
            <div className="animate-fade-in">
               <button onClick={() => setSelectedArticle(null)} className="mb-6 flex items-center text-slate-500 hover:text-slate-900 font-medium transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Guides
               </button>
               <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                     <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                        <BookOpen className="w-6 h-6" />
                     </div>
                     <h1 className="text-3xl font-bold text-slate-900">{article.title}</h1>
                  </div>
                  <div className="prose prose-slate max-w-none">
                     {article.content}
                  </div>
               </div>
            </div>
         )
      }

      return (
        <div className="animate-fade-in">
          <button onClick={() => setActiveView('main')} className="mb-6 flex items-center text-slate-500 hover:text-slate-900 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Help Center
          </button>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Protocol Guides</h2>
          <div className="grid gap-4">
             {Object.keys(articles).map((title, i) => (
               <button 
                  key={i} 
                  onClick={() => handleGuideClick(title)}
                  className="w-full text-left p-6 bg-white border border-slate-200 rounded-xl hover:border-brand-300 hover:shadow-md transition-all group flex items-start"
               >
                 <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mr-4 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                    {i === 0 ? <BookOpen className="w-5 h-5 text-slate-400 group-hover:text-brand-500" /> : 
                     i === 1 ? <GitBranch className="w-5 h-5 text-slate-400 group-hover:text-brand-500" /> :
                     i === 2 ? <Layers className="w-5 h-5 text-slate-400 group-hover:text-brand-500" /> :
                     <Zap className="w-5 h-5 text-slate-400 group-hover:text-brand-500" />
                    }
                 </div>
                 <div>
                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-brand-600">{title}</h3>
                    <p className="text-sm text-slate-500 mt-1">Learn the fundamentals of high-performance protocols.</p>
                 </div>
                 <ChevronRight className="w-5 h-5 text-slate-300 ml-auto self-center group-hover:text-brand-500" />
               </button>
             ))}
          </div>
        </div>
      );
    }

    if (activeView === 'forum') return (
        <div className="animate-fade-in">
          <button onClick={() => setActiveView('main')} className="mb-6 flex items-center text-slate-500 hover:text-slate-900 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Help Center
          </button>
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
             <MessageSquare className="w-12 h-12 text-purple-500 mx-auto mb-4" />
             <h2 className="text-2xl font-bold text-slate-900 mb-2">Community Forum</h2>
             <p className="text-slate-500 mb-6 max-w-md mx-auto">Connect with 5,000+ operators sharing best practices, templates, and execution tips.</p>
             <button className="bg-purple-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200">
                Launch Discourse Board
             </button>
          </div>
        </div>
    );

    if (activeView === 'billing') return (
        <div className="animate-fade-in">
          <button onClick={() => setActiveView('main')} className="mb-6 flex items-center text-slate-500 hover:text-slate-900 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Help Center
          </button>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h2 className="text-xl font-bold text-slate-900 mb-4">Billing & Invoices</h2>
             <div className="p-8 bg-slate-50 rounded-lg text-slate-600 text-sm mb-6 border border-slate-100 text-center">
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                No active invoices found for this account.
             </div>
             <button className="text-brand-600 font-bold text-sm hover:underline">Update Payment Method</button>
          </div>
        </div>
    );

    return (
      <div className="animate-fade-in">
        <div className="grid md:grid-cols-3 gap-6 mb-16 relative z-10">
          <button onClick={() => setActiveView('guides')} className="text-left bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:-translate-y-1 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Protocol Guides</h3>
            <p className="text-slate-500 text-sm mb-4">Learn how to build, execute, and version control your SOPs efficiently.</p>
            <span className="text-blue-600 font-bold text-sm flex items-center group-hover:underline">Read Articles <ChevronRight className="w-4 h-4 ml-1" /></span>
          </button>

          <button onClick={() => setActiveView('forum')} className="text-left bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:-translate-y-1 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Community Forum</h3>
            <p className="text-slate-500 text-sm mb-4">Connect with other operators, share tips, and request features.</p>
            <span className="text-purple-600 font-bold text-sm flex items-center group-hover:underline">Join Discussion <ChevronRight className="w-4 h-4 ml-1" /></span>
          </button>

          <button onClick={() => setActiveView('billing')} className="text-left bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:-translate-y-1 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Billing & Account</h3>
            <p className="text-slate-500 text-sm mb-4">Manage subscriptions, invoices, and enterprise licensing.</p>
            <span className="text-green-600 font-bold text-sm flex items-center group-hover:underline">View Settings <ChevronRight className="w-4 h-4 ml-1" /></span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div 
                  key={i} 
                  onClick={() => toggleFaq(i)}
                  className={`bg-white border p-4 rounded-lg cursor-pointer transition-all ${expandedFaq === i ? 'border-brand-500 ring-1 ring-brand-500 shadow-sm' : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'}`}
                >
                  <div className="flex justify-between items-center select-none">
                    <span className={`font-medium ${expandedFaq === i ? 'text-brand-700' : 'text-slate-700'}`}>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${expandedFaq === i ? 'rotate-180 text-brand-500' : ''}`} />
                  </div>
                  {expandedFaq === i && (
                    <div className="mt-3 text-sm text-slate-600 pt-3 border-t border-slate-100 animate-fade-in leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-100 p-8 rounded-2xl border border-slate-200 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Still need help?</h2>
            <p className="text-slate-600 mb-6 text-sm">Our dedicated support team is available 24/7 for Enterprise customers and Mon-Fri for Business plans.</p>
            
            <div className="space-y-4">
              <div className="flex items-center text-sm font-medium text-slate-700 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <Mail className="w-5 h-5 mr-3 text-slate-400" />
                <a href="mailto:support@protocolly.com" className="hover:text-brand-600 transition-colors">support@protocolly.com</a>
              </div>
              <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-lg">
                Open Support Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Header with Search */}
      <div className="bg-slate-900 text-white py-16 px-6 relative z-0">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">How can we help you?</h1>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Search for answers (e.g. 'How to refund', 'API keys')..." 
              className="w-full pl-12 pr-4 py-4 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xl placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Main Content Card Container - Negative Margin Pull-up */}
      <div className="max-w-6xl mx-auto px-6 py-12 -mt-8 relative z-10">
        {renderContent()}
      </div>
    </div>
  );
};
