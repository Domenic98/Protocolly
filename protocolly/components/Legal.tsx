
import React, { useState } from 'react';

export const Legal: React.FC<{ defaultTab?: string }> = ({ defaultTab = 'Privacy Policy' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const tabs = ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 font-sans">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Legal Center</h1>
        <p className="text-slate-500">Transparent, clear, and operator-friendly terms.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="md:w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab 
                  ? 'bg-slate-900 text-white' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[600px]">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{activeTab}</h2>
          <div className="prose prose-slate max-w-none text-sm text-slate-600">
            <p className="mb-4">Last Updated: October 24, 2024</p>
            
            {activeTab === 'Privacy Policy' && (
              <>
                <p>At PROTOCOLLY, we take your privacy seriously. This policy outlines how we collect, use, and protect your operational data.</p>
                <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">1. Data Collection</h3>
                <p>We collect information about the processes you execute, the outcomes achieved, and the metadata associated with your account. We DO NOT train our public AI models on your private SOP content unless you explicitly opt-in to the Marketplace.</p>
                <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">2. Usage</h3>
                <p>Data is used solely to provide the execution engine service, improve platform reliability, and generate your personal analytics.</p>
              </>
            )}

            {activeTab === 'Terms of Service' && (
              <>
                <p>By using PROTOCOLLY, you agree to these terms. We provide an execution platform, but you are responsible for the compliance and safety of the real-world actions you take.</p>
                <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">1. Liability</h3>
                <p>PROTOCOLLY is an advisory tool. We are not liable for operational failures resulting from the execution of an SOP.</p>
                <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">2. Intellectual Property</h3>
                <p>You retain full ownership of any Private SOPs you create. Public Marketplace SOPs are licensed to PROTOCOLLY for distribution.</p>
              </>
            )}

            {activeTab === 'Cookie Policy' && (
              <>
                <p>We use cookies to maintain your session security and analyze platform performance. We do not use third-party tracking cookies for advertising.</p>
              </>
            )}

            {activeTab === 'Security' && (
              <>
                <p>Security is our primary feature. We use bank-grade encryption for all data at rest and in transit.</p>
                <ul className="list-disc pl-5 space-y-2 mt-4">
                  <li>SOC2 Type II Compliant Infrastructure</li>
                  <li>AES-256 Encryption</li>
                  <li>Role-Based Access Control (RBAC)</li>
                  <li>Regular 3rd Party Penetration Testing</li>
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
