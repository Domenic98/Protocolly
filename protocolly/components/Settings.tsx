
import React from 'react';
import { User, Bell, Shield, Key, CreditCard, Save, Upload, Mail, Phone, MapPin } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12 animate-fade-in">
      <div className="flex justify-between items-end mb-8">
         <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Account Settings</h1>
            <p className="text-slate-500">Manage your profile, preferences, and security settings.</p>
         </div>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="md:col-span-1 space-y-1">
          <button className="w-full flex items-center p-3 rounded-lg bg-white border border-slate-200 text-slate-900 font-bold text-sm shadow-sm">
            <User className="w-4 h-4 mr-3 text-gold-500" /> Profile
          </button>
          <button className="w-full flex items-center p-3 rounded-lg text-slate-600 hover:bg-slate-100 text-sm font-medium transition-colors">
            <Bell className="w-4 h-4 mr-3" /> Notifications
          </button>
          <button className="w-full flex items-center p-3 rounded-lg text-slate-600 hover:bg-slate-100 text-sm font-medium transition-colors">
            <Shield className="w-4 h-4 mr-3" /> Security
          </button>
          <button className="w-full flex items-center p-3 rounded-lg text-slate-600 hover:bg-slate-100 text-sm font-medium transition-colors">
            <CreditCard className="w-4 h-4 mr-3" /> Billing & Plan
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
          
          {/* Profile Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Personal Information</h2>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center text-3xl font-bold text-slate-500 relative group cursor-pointer overflow-hidden border-4 border-white shadow-lg">
                <span className="group-hover:opacity-0 transition-opacity">JD</span>
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <Upload className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-gold-500 hover:text-slate-900 transition-colors">Change Photo</button>
                <button className="ml-2 px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors">Remove</button>
                <p className="text-xs text-slate-400 mt-2">JPG, GIF or PNG. Max size 800K.</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">First Name</label>
                <input type="text" defaultValue="Jane" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-gold-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Last Name</label>
                <input type="text" defaultValue="Doe" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-gold-500 outline-none" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
               <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Email Address</label>
                  <div className="relative">
                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <input type="email" defaultValue="jane.doe@company.com" className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-gold-500 outline-none" />
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Phone Number</label>
                  <div className="relative">
                     <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <input type="tel" defaultValue="+1 (555) 000-0000" className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-gold-500 outline-none" />
                  </div>
               </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Job Title</label>
              <input type="text" defaultValue="VP Operations" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-gold-500 outline-none" />
            </div>
          </div>

          {/* Plan Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
             <div className="flex justify-between items-center mb-4">
               <h2 className="text-lg font-bold text-slate-900">Current Plan</h2>
               <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Active</span>
             </div>
             <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                   <p className="font-bold text-slate-900">Professional Tier</p>
                   <p className="text-xs text-slate-500">$499/month • Renews on Nov 1</p>
                </div>
                <button className="text-gold-600 font-bold text-sm hover:underline">Manage Subscription</button>
             </div>
          </div>

          <div className="flex justify-end pt-4">
            <button className="flex items-center bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg">
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
