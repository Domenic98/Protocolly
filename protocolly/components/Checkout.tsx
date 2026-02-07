
import React, { useState } from 'react';
import { SOP } from '../types';
import { Shield, Lock, CreditCard, CheckCircle, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import { Logo } from './Logo';

interface CheckoutProps {
  sop: SOP;
  onComplete: () => void;
  onCancel: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ sop, onComplete, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'form' | 'success'>('form');
  
  // Controlled State
  const [formData, setFormData] = useState({
    name: '',
    card: '',
    expiry: '',
    cvc: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    // Clear error when user types
    if (errors[field]) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    }

    let formattedValue = value;

    if (field === 'card') {
        formattedValue = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    } else if (field === 'expiry') {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            formattedValue = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
        } else {
            formattedValue = cleaned;
        }
    } else if (field === 'cvc') {
        formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Name
    if (!formData.name.trim()) newErrors.name = "Cardholder name is required.";

    // Card (Simple format check, in real app use Luhn algorithm)
    const cleanCard = formData.card.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cleanCard)) {
        newErrors.card = "Please enter a valid card number.";
    }

    // Expiry
    if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) {
        newErrors.expiry = "Format: MM/YY";
    } else {
        const [mStr, yStr] = formData.expiry.split('/');
        const m = parseInt(mStr);
        const y = parseInt(yStr);
        const now = new Date();
        const currentYear = parseInt(now.getFullYear().toString().slice(-2));
        const currentMonth = now.getMonth() + 1;

        if (m < 1 || m > 12) {
            newErrors.expiry = "Invalid month.";
        } else if (y < currentYear || (y === currentYear && m < currentMonth)) {
            newErrors.expiry = "Card has expired.";
        }
    }

    // CVC
    if (!/^\d{3,4}$/.test(formData.cvc)) {
        newErrors.cvc = "Invalid CVC.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);
    // Simulate Secure API call
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStep('success');
      // Auto-redirect after success
      setTimeout(() => {
        onComplete();
      }, 2000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Left Side: Order Summary */}
        <div className="bg-gradient-to-br from-amber-700 to-yellow-800 text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-[100px] opacity-10"></div>
          
          <div>
            <div className="flex items-center gap-2 mb-8 text-amber-100 cursor-pointer hover:text-white transition-colors" onClick={onCancel}>
              <ArrowLeft className="w-4 h-4" /> Back to Marketplace
            </div>
            <h3 className="text-amber-200 font-medium text-xs uppercase tracking-wider mb-2">Order Summary</h3>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">{sop.title}</h2>
            <div className="flex items-center gap-2 mb-6">
              <span className="px-2 py-1 bg-black/20 rounded text-xs text-amber-100 font-mono">v{sop.version}</span>
              <span className="text-amber-100 text-sm">{sop.author}</span>
            </div>
            <p className="text-amber-50 text-sm leading-relaxed mb-8">{sop.description}</p>
          </div>

          <div className="space-y-4">
             <div className="flex justify-between items-center text-amber-100 text-sm">
                <span>Subtotal</span>
                <span>${sop.price.toFixed(2)}</span>
             </div>
             <div className="flex justify-between items-center text-amber-100 text-sm">
                <span>Platform Fee (2%)</span>
                <span>${(sop.price * 0.02).toFixed(2)}</span>
             </div>
             <div className="h-px bg-white/20 my-4"></div>
             <div className="flex justify-between items-center font-bold text-xl text-white">
                <span>Total</span>
                <span>${(sop.price * 1.02).toFixed(2)}</span>
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
                <h2 className="text-xl font-bold text-slate-900">Payment Details</h2>
                <div className="flex gap-2">
                   <div className="h-6 w-10 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-[10px] text-slate-400 font-bold">VISA</div>
                   <div className="h-6 w-10 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-[10px] text-slate-400 font-bold">MC</div>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                   <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Cardholder Name</label>
                   <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full p-3 bg-slate-50 border rounded-lg focus:ring-2 focus:outline-none transition-all text-sm ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-brand-500'}`} 
                    placeholder="John Doe" 
                   />
                   {errors.name && <p className="mt-1 text-xs text-red-500 flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> {errors.name}</p>}
                </div>

                <div>
                   <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Card Number</label>
                   <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                      <input 
                        type="text" 
                        value={formData.card}
                        onChange={(e) => handleInputChange('card', e.target.value)}
                        className={`w-full pl-10 pr-3 py-3 bg-slate-50 border rounded-lg focus:ring-2 focus:outline-none transition-all text-sm font-mono ${errors.card ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-brand-500'}`} 
                        placeholder="0000 0000 0000 0000"
                      />
                   </div>
                   {errors.card && <p className="mt-1 text-xs text-red-500 flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> {errors.card}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Expiry Date</label>
                      <input 
                        type="text" 
                        value={formData.expiry}
                        onChange={(e) => handleInputChange('expiry', e.target.value)}
                        className={`w-full p-3 bg-slate-50 border rounded-lg focus:ring-2 focus:outline-none transition-all text-sm font-mono ${errors.expiry ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-brand-500'}`} 
                        placeholder="MM/YY" 
                      />
                      {errors.expiry && <p className="mt-1 text-xs text-red-500 flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> {errors.expiry}</p>}
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">CVC</label>
                      <input 
                        type="text" 
                        value={formData.cvc}
                        onChange={(e) => handleInputChange('cvc', e.target.value)}
                        className={`w-full p-3 bg-slate-50 border rounded-lg focus:ring-2 focus:outline-none transition-all text-sm font-mono ${errors.cvc ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-brand-500'}`} 
                        placeholder="123" 
                      />
                      {errors.cvc && <p className="mt-1 text-xs text-red-500 flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> {errors.cvc}</p>}
                   </div>
                </div>
              </div>

              <div className="mt-8">
                 <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 disabled:opacity-70 flex items-center justify-center"
                 >
                   {isProcessing ? (
                     <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...
                     </>
                   ) : (
                     <>Pay ${(sop.price * 1.02).toFixed(2)}</>
                   )}
                 </button>
                 
                 <div className="mt-4 flex items-center justify-center text-xs text-slate-400 gap-1">
                    <Lock className="h-3 w-3" /> TLS 1.3 Encrypted Transaction
                 </div>
              </div>
            </form>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in">
               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                 <CheckCircle className="h-10 w-10 text-green-600" />
               </div>
               <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Authorized</h2>
               <p className="text-slate-500">Redirecting to Protocol Environment...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
