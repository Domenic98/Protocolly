
import React, { useState } from 'react';
import { Logo } from './Logo';
import { Mail, Lock, User, ArrowRight, Github, Chrome, ArrowLeft, CheckSquare, AlertCircle } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface SignUpProps {
  onComplete: (name: string) => void;
  onBack: () => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onComplete, onBack }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);
    
    // 1. Basic Client-Side Validation
    if (!isLogin && !termsAccepted) {
        setErrorMsg("You must agree to the Terms and Conditions to create an account.");
        return;
    }

    if (!isLogin && !name.trim()) {
        setErrorMsg("Full Name is required.");
        return;
    }

    // Rate Limit Feature Removed: Basic check only
    if (!email.includes('@')) {
        setErrorMsg("Please enter a valid email address.");
        return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        // Sign In
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
            // Customize Supabase error messages for better UX
            if (error.message.includes("Invalid login credentials")) {
                throw new Error("Incorrect email or password. Please try again.");
            }
            throw error;
        }

        // On success
        const displayName = data.session?.user.user_metadata?.full_name || email.split('@')[0];
        onComplete(displayName);

      } else {
        // Sign Up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });

        if (error) throw error;

        if (data.session) {
           // Immediate session (email confirmation off or auto-confirmed)
           onComplete(name);
        } else if (data.user) {
           // User created but needs email verification
           setInfoMsg(`Account created! A confirmation link has been sent to ${email}. Please verify your email to continue.`);
           setIsLoading(false);
        }
      }
    } catch (error: any) {
      console.error("Auth Error:", error);
      
      // --- SECURITY BYPASS FOR DEMO ---
      // If backend rate limits are hit, allow entry as Demo User to prevent lockout during testing.
      if (error.message?.includes("rate limit") || error.message?.includes("Too many requests")) {
          console.warn("Rate limit hit. Bypassing for demo purposes.");
          onComplete(name || email.split('@')[0] || "Demo User");
          return;
      }
      
      setErrorMsg(error.message || "An authentication error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 flex items-center text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
        </button>
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          {isLogin ? 'Sign in to your account' : 'Get started with PROTOCOLLY'}
        </h2>
        {!isLogin && (
            <p className="mt-4 text-center text-sm text-slate-500 max-w-xs mx-auto">
                Most teams already have SOPs. What they don’t have is visibility into how they’re actually executed.
            </p>
        )}
        <p className="mt-2 text-center text-sm text-slate-600">
          {isLogin ? 'New to the platform?' : 'Already have an account?'}{' '}
          <button onClick={() => { setIsLogin(!isLogin); setErrorMsg(null); setInfoMsg(null); }} className="font-bold text-brand-600 hover:text-brand-500 transition-colors">
            {isLogin ? 'Create a new account' : 'Sign in'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl border border-slate-200 sm:rounded-2xl sm:px-10">
          
          {errorMsg && (
            <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{errorMsg}</p>
            </div>
          )}

          {infoMsg && (
            <div className="mb-4 p-4 bg-green-50 border border-green-100 rounded-lg flex items-start animate-fade-in">
              <CheckSquare className="w-5 h-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">{infoMsg}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Full Name
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={!isLogin}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="focus:ring-2 focus:ring-brand-500 focus:outline-none block w-full pl-10 py-3 sm:text-sm border-slate-300 rounded-lg border bg-slate-50"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Email Address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-2 focus:ring-brand-500 focus:outline-none block w-full pl-10 py-3 sm:text-sm border-slate-300 rounded-lg border bg-slate-50"
                  placeholder="jane@company.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-2 focus:ring-brand-500 focus:outline-none block w-full pl-10 py-3 sm:text-sm border-slate-300 rounded-lg border bg-slate-50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {!isLogin && (
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="focus:ring-brand-500 h-4 w-4 text-brand-600 border-slate-300 rounded"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="font-medium text-slate-700">I agree to the Terms and Conditions</label>
                        <p className="text-slate-500 text-xs">By clicking this, you agree to our Service Agreement and Privacy Policy.</p>
                    </div>
                </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-slate-200 text-sm font-bold text-white bg-slate-900 hover:bg-gold-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 transition-all"
              >
                {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Secured by Supabase</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
