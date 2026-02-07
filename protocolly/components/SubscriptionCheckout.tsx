
import React, { useState } from 'react';
import { Shield, Lock, CreditCard, CheckCircle, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import { Logo } from './Logo';

interface SubscriptionCheckoutProps {
  planName: string;
  price: number;
  onComplete: () => void;
  onCancel: () => void;
}

export const SubscriptionCheckout: React.FC<SubscriptionCheckoutProps> = ({ planName, price, onComplete, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'form' | 'success'>('form');
  
  const [formData, setFormData] = useState({
    name: '',
    card: '',
    expiry: '',
    cvc: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    if (errors[field]) {
        setErrors(prev => { const n = {...prev}; delete n[field]; return n; });
    }

    let formatted = value;
    if (field === 'card') formatted = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    if (field === 'expiry') {
        const clean = value.replace(/\D/g, '');
        if (clean.length >= 2) formatted = clean.slice(0, 2) + '/' + clean.slice(2, 4);
        else formatted = clean;
    }
    if (field === 'cvc') formatted = value.replace(/\D/g, '').slice(0, 4);

    setFormData(prev => ({ ...prev, [field]: formatted }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = "Required.";
    
    if (formData.card.replace(/\s/g, '').length < 13) e.card = "Invalid card.";
    
    if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) e.expiry = "Invalid.";
    else {
        const [m, y] = formData.expiry.split('/').map(Number);
        const now = new Date();
        const curY = parseInt(now.getFullYear().toString().slice(-2));
        const curM = now.getMonth() + 1;
        if (m < 1 || m > 12) e.expiry = "Invalid month";
        else if (y < curY || (y === curY && m < curM)) e.expiry = "Expired";
    }

    if (formData.cvc.length < 3) e.cvc = "Invalid.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStep('success');
      setTimeout(() => {
        onComplete();
      }, 2000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Left Side: Order Summary */}
        <div className={`text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-amber-700 to-yellow-800`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-[100px] opacity-10"></div>
          
          <div>
            <div className="flex items-center gap-2 mb-8 text-amber-100 cursor-pointer hover:text-white transition-colors" onClick={onCancel}>
              <ArrowLeft className="w-4 h-4" /> Change Plan
            </div>
            <h3 className="text-amber-200 font-medium text-xs uppercase tracking-wider mb-2">Subscription Summary</h3>
            <h2 className="text-3xl font-bold mb-4">{planName} Plan</h2>
            <div className="flex items-center gap-2 mb-6">
              <span className="px-2 py-1 bg-white/10 rounded text-xs text-amber-50">Monthly Billing</span>
              <span className="text-amber-200 text-sm">Cancel Anytime</span>
            </div>
            <p className="text-amber-100 text-sm leading-relaxed mb-8">
              Unlocking {planName === 'Enterprise' ? 'full enterprise-grade security and governance features.' : 'advanced operational capabilities for your team.'}
            </p>
          </div>

          <div className="space-y-4">
             <div className="flex justify-between items-center text-amber-100 text-sm">
                <span>Monthly Price</span>
                <span>${price.toFixed(2)}</span>
             </div>
             <div className="flex justify-between items-center text-amber-100 text-sm">
                <span>Tax (Est.)</span>
                <span>$0.00</span>
             </div>
             <div className="h-px bg-white/20 my-4"></div>
             <div className="flex justify-between items-center font-bold text-xl text-white">
                <span>Total Due Today</span>
                <span>${price.toFixed(2)}</span>
             </div>
          </div>
        </div>

        {/* Right Side: Payment Form */}
        <div className="p-8 md:p-12 bg-white flex flex-col justify-center">
          <div className="mb-8">
             <Logo className="h-6 w-6" />
          </div>

          {paymentStep === 'form' ? (
            <form onSubmit={handleSubmit} noValidate>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Secure Payment</h2>
                <div className="flex gap-2">
                   <div className="h-6 w-10 bg-slate-100 rounded border border-slate-200"></div>
                   <div className="h-6 w-10 bg-slate-100 rounded border border-slate-200"></div>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                   <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Cardholder Name</label>
                   <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full p-3 bg-slate-50 border rounded-lg focus:ring-2 focus:outline-none transition-all text-sm ${errors.name ? 'border-red-500' : 'border-slate-200'}`} 
                    placeholder="John Doe" 
                   />
                </div>

                <div>
                   <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Card Number</label>
                   <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                      <input 
                        type="text" 
                        value={formData.card}
                        onChange={(e) => handleInputChange('card', e.target.value)}
                        className={`w-full pl-10 pr-3 py-3 bg-slate-50 border rounded-lg focus:ring-2 focus:outline-none transition-all text-sm font-mono ${errors.card ? 'border-red-500' : 'border-slate-200'}`} 
                        placeholder="0000 0000 0000 0000" 
                      />
                   </div>
                   {errors.card && <p className="text-xs text-red-500 mt-1">{errors.card}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Expiry Date</label>
                      <input 
                        type="text" 
                        value={formData.expiry}
                        onChange={(e) => handleInputChange('expiry', e.target.value)}
                        className={`w-full p-3 bg-slate-50 border rounded-lg focus:ring-2 focus:outline-none transition-all text-sm font-mono ${errors.expiry ? 'border-red-500' : 'border-slate-200'}`} 
                        placeholder="MM/YY" 
                      />
                      {errors.expiry && <p className="text-xs text-red-500 mt-1">{errors.expiry}</p>}
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">CVC</label>
                      <input 
                        type="text" 
                        value={formData.cvc}
                        onChange={(e) => handleInputChange('cvc', e.target.value)}
                        className={`w-full p-3 bg-slate-50 border rounded-lg focus:ring-2 focus:outline-none transition-all text-sm font-mono ${errors.cvc ? 'border-red-500' : 'border-slate-200'}`} 
                        placeholder="123" 
                      />
                      {errors.cvc && <p className="text-xs text-red-500 mt-1">{errors.cvc}</p>}
                   </div>
                </div>
              </div>

              <div className="mt-8">
                 <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gold-500 hover:text-slate-900 transition-all shadow-lg disabled:opacity-70 flex items-center justify-center"
                 >
                   {isProcessing ? (
                     <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...
                     </>
                   ) : (
                     <>Confirm & Pay ${price.toFixed(2)}</>
                   )}
                 </button>
                 
                 <div className="mt-4 flex items-center justify-center text-xs text-slate-400 gap-1">
                    <Lock className="h-3 w-3" /> Payments are secure and encrypted
                 </div>
              </div>
            </form>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in">
               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                 <CheckCircle className="h-10 w-10 text-green-600" />
               </div>
               <h2 className="text-2xl font-bold text-slate-900 mb-2">Subscription Active!</h2>
               <p className="text-slate-500">Unlocking {planName} features...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
