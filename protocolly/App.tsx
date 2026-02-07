
import React, { useState, useEffect, useRef } from 'react';
import { ViewState, SOP, Notification, ReviewApplication, ReviewSOP, CreatorApplication } from './types';
import { INITIAL_SOPS } from './data/sops';
import { LandingPage } from './components/LandingPage';
import { SignUp } from './components/SignUp';
import { PricingSelection } from './components/PricingSelection';
import { Marketplace } from './components/Marketplace';
import { ExecutionEngine } from './components/ExecutionEngine';
import { SubscriptionCheckout } from './components/SubscriptionCheckout';
import { CreatorStudio } from './components/CreatorStudio';
import { Dashboard } from './components/Dashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { CreatorDashboard } from './components/CreatorDashboard';
import { EnterpriseDashboard } from './components/EnterpriseDashboard';
import { EnterpriseSalesPage } from './components/EnterpriseSalesPage';
import { Settings as SettingsView } from './components/Settings';
import { Support as SupportView } from './components/Support';
import { Legal as LegalView } from './components/Legal';
import { Communities } from './components/Communities';
import { Logo } from './components/Logo';
import { supabase } from './services/supabaseClient';
import { db } from './services/dbService';
import { 
  LayoutDashboard, ShoppingBag, Settings, LogOut, PlusCircle, 
  Globe, Twitter, Linkedin, Plus, Shield, Building2, Menu, X, 
  Mail, Phone, MapPin, Home, Star, DollarSign, Info, BarChart3, HelpCircle,
  ArrowRight, Activity, Zap, Clock, TrendingUp, CheckCircle, Bell, User, Crown, Users, Layers, AlertOctagon, Lock, RefreshCw, FolderOpen, Grid
} from 'lucide-react';

// Tier Hierarchy Mapping (0 = Observer, 4 = Sovereign)
const TIER_LEVELS: Record<string, number> = {
  'Observer': 0,
  'Operator': 1,
  'Commander': 2,
  'Authority': 3,
  'Sovereign': 4
};

// --- SYSTEM LOGIC: PRICE = WEIGHT & ACCESS ---
const getSopTierRequirement = (priceWeight: number): string => {
  if (priceWeight === 0) return 'Observer';
  if (priceWeight < 100) return 'Operator';
  if (priceWeight < 200) return 'Commander';
  if (priceWeight < 500) return 'Authority';
  return 'Sovereign';
};

const getExecutionCost = (priceWeight: number): number => {
  if (priceWeight === 0) return 1;
  return Math.ceil(priceWeight / 50) + 1; // Example weighting logic
};

// Protected views requiring auth
const PROTECTED_VIEWS = [
  ViewState.HOME, 
  ViewState.MARKETPLACE, 
  ViewState.EXECUTION, 
  ViewState.DASHBOARD, 
  ViewState.ADMIN, 
  ViewState.CREATOR_DASHBOARD,
  ViewState.ENTERPRISE,
  ViewState.SETTINGS,
  ViewState.SUPPORT,
  ViewState.COMMUNITIES
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LANDING);
  const [selectedSOP, setSelectedSOP] = useState<SOP | null>(null);
  
  // --- CORE DATA STATE ---
  const [sops, setSops] = useState<SOP[]>([]); // Start empty, fetch from DB
  const [pendingSops, setPendingSops] = useState<ReviewSOP[]>([]); 
  const [applications, setApplications] = useState<ReviewApplication[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [seedProgress, setSeedProgress] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [legalTab, setLegalTab] = useState('Privacy Policy');
  
  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  // User State - Defaulting to Observer (Free Tier)
  const [userTier, setUserTier] = useState('Observer');
  const [executionBalance, setExecutionBalance] = useState(2); 
  const [pendingTier, setPendingTier] = useState<string | null>(null);
  const [pendingPrice, setPendingPrice] = useState<number>(0);
  const [userName, setUserName] = useState('Operator');
  const [pendingShareSopId, setPendingShareSopId] = useState<string | null>(null);
  const [onboardingIntent, setOnboardingIntent] = useState<'GENERAL' | 'ENTERPRISE'>('GENERAL');
  const [isAdmin, setIsAdmin] = useState(false);

  // --- DATA FETCHING ---
  const fetchData = async () => {
    setIsLoading(true);
    
    // 1. Fetch Active Public SOPs for Marketplace
    let activeSops = await db.getActiveSops();
    
    // 2. AUTO-RESTORATION CHECK: If DB is empty, seed automatically
    if (activeSops.length === 0) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            setSeedProgress(true);
            console.log("Empty marketplace detected. Initiating automated restoration...");
            // Seed the initial 1100+ SOPs
            await db.seedInitialSops(INITIAL_SOPS);
            // Fetch again
            activeSops = await db.getActiveSops();
            setSeedProgress(false);
        }
    }
    
    setSops(activeSops);

    // If admin, fetch pending items
    if (isAdmin) {
       const allSops = await db.getAllSops();
       // Cast to ReviewSOP for pending list (simplified for demo)
       const pending = allSops.filter(s => s.status === 'Draft' || s.status === 'Pending_Review').map(s => ({
           ...s,
           submittedAt: s.effectiveDate || new Date().toISOString(),
           aiOriginalityScore: 85,
           structuralUniquenessScore: 78,
           estimatedUserValue: 500,
           status: 'pending' as any
       }));
       setPendingSops(pending);

       const apps = await db.getApplications();
       setApplications(apps.filter(a => a.status === 'pending'));
    }
    setIsLoading(false);
  };

  // Seed DB if empty (Dev Helper - manual trigger)
  const handleSeedDb = async () => {
      if (confirm("This will seed the database with ~1000 generated SOPs. Continue?")) {
          setIsLoading(true);
          setSeedProgress(true);
          await db.seedInitialSops(INITIAL_SOPS);
          await fetchData();
          setSeedProgress(false);
          setIsLoading(false);
      }
  };

  // Supabase Auth Listener
  useEffect(() => {
    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserName(session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'Operator');
        
        db.getUserProfile(session.user.id).then(profile => {
            if (profile) {
                setUserTier(profile.tier || 'Observer');
                setIsAdmin(profile.is_admin || false);
            }
        });

        // Redirect if on auth/landing pages
        setCurrentView(prev => {
            if (prev === ViewState.LANDING || prev === ViewState.SIGN_UP) return ViewState.HOME;
            return prev;
        });
      }
    });

    // 2. Subscribe to Auth Changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
         setUserName(session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'Operator');
         db.getUserProfile(session.user.id).then(profile => {
            if (profile) {
                setUserTier(profile.tier || 'Observer');
                setIsAdmin(profile.is_admin || false);
            }
         });

         // Automatically enter app if signed in
         setCurrentView(prev => {
             if (prev === ViewState.LANDING || prev === ViewState.SIGN_UP) return ViewState.HOME;
             return prev;
         });
      } else {
         // Logged out
         setUserName('Operator');
         setUserTier('Observer');
         setIsAdmin(false);
         setSops([]); // Clear data on logout
         
         // Only redirect to landing if on a protected view
         setCurrentView(prev => {
             if (PROTECTED_VIEWS.includes(prev)) return ViewState.LANDING;
             return prev;
         });
      }
    });

    return () => subscription.unsubscribe();
  }, []); // Run once on mount

  // Load Data on User Change
  useEffect(() => {
      if (userName !== 'Operator') fetchData();
  }, [userName, isAdmin]);

  // Click outside listener for notifications
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check for shared protocol link on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedSopId = params.get('sopId');
    if (sharedSopId) {
      setPendingShareSopId(sharedSopId);
    }
  }, []);

  // Generate Dynamic Notifications
  useEffect(() => {
    const newNotifications: Notification[] = [];
    
    // 1. Updated SOPs
    const recentSops = sops.slice(0, 2);
    recentSops.forEach(sop => {
        newNotifications.push({
            id: `notif-${sop.id}`,
            title: `Updated: ${sop.title.substring(0, 25)}...`,
            message: `Version ${sop.version} is now active. Review change log for details.`,
            type: 'update',
            timestamp: '2 hours ago',
            read: false
        });
    });

    // 2. New Category Added
    newNotifications.push({
        id: 'notif-new-cat-1',
        title: 'New Category: AI Governance',
        message: 'A new section for AI Safety & Governance protocols is now live.',
        type: 'new_category',
        timestamp: '1 day ago',
        read: false
    });

    // 3. New SOP Available
    if (sops.length > 5) {
        newNotifications.push({
            id: `notif-new-${sops[4].id}`,
            title: 'New Protocol Available',
            message: `${sops[4].title} has just been published to the marketplace.`,
            type: 'alert',
            timestamp: 'Just now',
            read: false
        });
    }

    if (isAdmin && (pendingSops.length > 0 || applications.length > 0)) {
         newNotifications.push({
            id: 'notif-admin-1',
            title: 'Admin Action Required',
            message: `${pendingSops.length} SOPs and ${applications.length} applications pending.`,
            type: 'system',
            timestamp: 'Now',
            read: false
        });
    }

    setNotifications(newNotifications);
  }, [sops, pendingSops, isAdmin, applications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleEnterApp = async () => {
    // Check if user is already logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        // If logged in, go straight to home
        setCurrentView(ViewState.HOME);
    } else {
        // If not logged in, go to sign up
        setOnboardingIntent('GENERAL');
        setCurrentView(ViewState.SIGN_UP);
    }
  };

  const handleEnterpriseStart = async () => {
    // Similar logic for Enterprise
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        setCurrentView(ViewState.PRICING_SELECTION); // Logged in, show pricing
    } else {
        setOnboardingIntent('ENTERPRISE');
        setCurrentView(ViewState.SIGN_UP);
    }
  };
  
  const handleSignUpComplete = (name: string) => {
    setUserName(name || 'Operator');
    if (onboardingIntent === 'ENTERPRISE') {
        setCurrentView(ViewState.PRICING_SELECTION);
    } else {
        setUserTier('Observer'); 
        setExecutionBalance(2);
        setCurrentView(ViewState.HOME);
    }
  };

  const handlePricingComplete = (tier: string, price: number) => {
    if (tier === 'Observer') {
        setUserTier(tier);
        setExecutionBalance(2); 
        setCurrentView(ViewState.HOME);
        return;
    }
    setPendingTier(tier);
    setPendingPrice(price);
    setCurrentView(ViewState.SUBSCRIPTION_CHECKOUT);
  };

  const handleSubscriptionPaymentComplete = () => {
    if (pendingTier) {
        setUserTier(pendingTier);
        // In real app, update profile via API
        const limits: Record<string, number> = { 
            'Operator': 60, 
            'Commander': 300, 
            'Authority': 99999, 
            'Sovereign': 99999 
        };
        setExecutionBalance(limits[pendingTier] || 2);
        
        if (onboardingIntent === 'ENTERPRISE' && pendingTier === 'Sovereign') {
            setCurrentView(ViewState.ENTERPRISE);
        } else {
            setCurrentView(ViewState.HOME);
        }
        setPendingTier(null);
        setOnboardingIntent('GENERAL'); 
    }
  };

  const handleSelectSOP = (sop: SOP) => {
    const requiredTier = sop.tierAccess || getSopTierRequirement(sop.price);
    const userLevel = TIER_LEVELS[userTier];
    const reqLevel = TIER_LEVELS[requiredTier];
    const executionCost = sop.executionWeight ? (sop.executionWeight * 10) : getExecutionCost(sop.price);

    if (userLevel < reqLevel) {
       alert(`Access Restricted. This protocol requires the ${requiredTier} license.`);
       setCurrentView(ViewState.PRICING);
       return;
    }

    if (executionBalance < executionCost) {
       alert(`Insufficient Execution Balance. This run requires ${executionCost} credits.`);
       setCurrentView(ViewState.PRICING);
       return;
    }

    setSelectedSOP(sop);
    setExecutionBalance(prev => prev - executionCost); 
    setCurrentView(ViewState.EXECUTION);
  };

  const handleBackToMarketplace = () => {
    setSelectedSOP(null);
    setCurrentView(ViewState.MARKETPLACE);
  };

  const handleCreateProtocol = () => {
    if (TIER_LEVELS[userTier] < 1) {
        alert("Protocol Creation requires an Operator license or higher.");
        setCurrentView(ViewState.PRICING);
        return;
    }
    setMobileMenuOpen(false);
    setCurrentView(ViewState.CREATE_PROTOCOL);
  };

  const handleEnterpriseAccess = () => {
      if (userTier !== 'Sovereign') {
          alert("Access to the Enterprise Vault is restricted to Sovereign subscribers.");
          setCurrentView(ViewState.PRICING);
          return;
      }
      setCurrentView(ViewState.ENTERPRISE);
  }

  // --- CREATOR & ADMIN HANDLERS (DB INTEGRATED) ---

  const handleSaveProtocol = async (newSop: SOP) => {
    // Save to DB
    const saved = await db.createSop({ ...newSop, status: userTier === 'Sovereign' ? 'Active' : 'Draft' });
    
    if (saved) {
        alert(userTier === 'Sovereign' ? "Protocol published directly to vault." : "Protocol submitted to Quality Assurance Queue.");
        fetchData(); // Refresh lists
        setCurrentView(ViewState.MARKETPLACE);
    } else {
        alert("Failed to save protocol. Please try again.");
    }
  };

  const handleSubmitApplication = async (app: CreatorApplication) => {
      const success = await db.createApplication(app);
      if (success) {
          // alert("Application submitted successfully."); 
          // Handled in CreatorStudio UI flow already
          fetchData(); // Refresh admin queue
      }
  };

  const handleAdminApproveSOP = async (sop: ReviewSOP) => {
      const success = await db.updateSopStatus(sop.id, 'Active');
      if (success) {
          fetchData();
      }
  };

  const handleAdminRejectSOP = async (id: string) => {
      const success = await db.updateSopStatus(id, 'Rejected');
      if (success) fetchData();
  };

  const handleAdminDeleteSOP = async (id: string) => {
      const success = await db.deleteSop(id);
      if (success) fetchData();
  };

  const handleAdminApproveApp = async (app: ReviewApplication) => {
      const success = await db.updateAppStatus(app.id, 'approved');
      if (success) fetchData();
  };

  const handleLegalNav = (tab: string) => {
    setLegalTab(tab);
    setCurrentView(ViewState.LEGAL);
  };

  const handleLogOut = async () => {
      await supabase.auth.signOut();
      setCurrentView(ViewState.LANDING);
  };

  // Full Screen Views (No Sidebar)
  switch (currentView) {
    case ViewState.LANDING:
      return <LandingPage onEnterApp={handleEnterApp} onEnterpriseStart={handleEnterpriseStart} />;
    case ViewState.SIGN_UP:
      return <SignUp onComplete={handleSignUpComplete} onBack={() => setCurrentView(ViewState.LANDING)} />;
    case ViewState.PRICING_SELECTION:
      return <PricingSelection onSelect={handlePricingComplete} onBack={() => setCurrentView(ViewState.HOME)} />;
    case ViewState.SUBSCRIPTION_CHECKOUT:
      if (pendingTier) {
          return (
              <SubscriptionCheckout 
                planName={pendingTier} 
                price={pendingPrice} 
                onComplete={handleSubscriptionPaymentComplete}
                onCancel={() => setCurrentView(ViewState.PRICING_SELECTION)}
              />
          );
      }
      break;
    case ViewState.CREATE_PROTOCOL:
        return (
            <CreatorStudio 
                onCancel={() => setCurrentView(ViewState.HOME)} 
                onSave={handleSaveProtocol}
                onSubmitApplication={handleSubmitApplication}
            />
        );
    case ViewState.EXECUTION:
        if (selectedSOP) {
            return <ExecutionEngine sop={selectedSOP} onBack={handleBackToMarketplace} />;
        }
        break;
    case ViewState.ADMIN:
        return (
            <AdminDashboard 
                onExit={() => setCurrentView(ViewState.HOME)}
                activeSops={sops}
                pendingSops={pendingSops}
                applications={applications}
                onApproveSop={handleAdminApproveSOP}
                onRejectSop={handleAdminRejectSOP}
                onDeleteSop={handleAdminDeleteSOP}
                onApproveApp={handleAdminApproveApp}
                onRejectApp={(id) => setApplications(prev => prev.filter(a => a.id !== id))}
            />
        );
    case ViewState.CREATOR_DASHBOARD:
        return <CreatorDashboard onBack={() => setCurrentView(ViewState.HOME)} />;
    case ViewState.ENTERPRISE_SALES:
        return <EnterpriseSalesPage onLogin={() => setCurrentView(ViewState.PRICING)} onBack={() => setCurrentView(ViewState.HOME)} />;
    case ViewState.ENTERPRISE:
        if (userTier !== 'Sovereign') {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                    <div className="bg-white p-8 rounded-xl border border-red-200 shadow-xl max-w-md text-center">
                        <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
                        <p className="text-slate-600 mb-6">This area is restricted to Sovereign license holders. Please upgrade your plan to access the Private Vault.</p>
                        <button onClick={() => setCurrentView(ViewState.PRICING)} className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-bold">Upgrade License</button>
                        <button onClick={() => setCurrentView(ViewState.HOME)} className="block w-full mt-2 text-slate-500 text-sm hover:underline">Return Home</button>
                    </div>
                </div>
            )
        }
        return (
          <EnterpriseDashboard 
            onExit={() => setCurrentView(ViewState.HOME)} 
            onCreateSOP={() => setCurrentView(ViewState.CREATE_PROTOCOL)}
            onOpenSOP={(sop) => { setSelectedSOP(sop); setCurrentView(ViewState.EXECUTION); }}
          />
        );
  }

  // Helper Components for Simple Views
  const HomeView = () => (
    <div className="min-h-full flex flex-col p-6 md:p-8 max-w-7xl mx-auto space-y-12 animate-fade-in flex-1">
      {/* Hero Description */}
      <div className="text-center max-w-4xl mx-auto py-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-slate-900">
            Documents don’t run businesses. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">Execution systems do.</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            PROTOCOLLY Enterprise converts your static SOPs into private, executable workflows with built-in compliance and real-time intelligence.
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={() => setCurrentView(ViewState.MARKETPLACE)} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gold-500 hover:text-slate-900 transition-all shadow-xl shadow-slate-200">
                Explore The Marketplace
            </button>
            {sops.length === 0 && !seedProgress && (
                <button onClick={handleSeedDb} className="bg-white border border-slate-200 text-slate-600 px-6 py-4 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center">
                    <RefreshCw className="w-4 h-4 mr-2" /> Manual Database Restore
                </button>
            )}
          </div>
      </div>

      {/* Interactive Slides - Gold Gradient */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Static Decay', desc: "PDFs and Wikis are outdated the moment they are saved. Employees guess which version is 'current'.", icon: Clock },
            { title: 'Unverifiable Compliance', desc: "You can't prove who read the doc, let alone who followed the steps correctly during the incident.", icon: Shield },
            { title: 'Execution Variance', desc: "Top performers carry tribal knowledge in their heads. New hires fail despite having 'access' to the docs.", icon: Activity },
            { title: 'Audit Panic', desc: "Audits rely on after-the-fact interviews and scattered emails instead of immutable system logs.", icon: AlertOctagon }
          ].map((slide, i) => (
            <div key={i} className="group p-6 rounded-2xl bg-gradient-to-br from-amber-600 to-slate-900 text-white shadow-lg hover:scale-105 transition-all duration-300 cursor-default border border-amber-500/20">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 text-gold-400 group-hover:bg-gold-500 group-hover:text-slate-900 transition-colors">
                  <slide.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-white group-hover:text-gold-200">{slide.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed group-hover:text-white transition-colors">{slide.desc}</p>
            </div>
          ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div>
                {isLoading || seedProgress ? (
                    <div className="p-12 text-center text-slate-400">
                        <RefreshCw className="w-8 h-8 mx-auto animate-spin mb-4 text-brand-600" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Restoring Protocol Library...</h3>
                        <p>Syncing 1,103+ Standard Operating Procedures to your secure database.</p>
                        <p className="text-xs mt-2 text-slate-400">This may take a moment.</p>
                    </div>
                ) : sops.length > 0 ? (
                    <>
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Recommended Protocols</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                        {sops.slice(0, 2).map(sop => (
                            <div key={sop.id} onClick={() => handleSelectSOP(sop)} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-500 group-hover:bg-gold-50 group-hover:text-gold-600 transition-colors">
                                    {sop.title.charAt(0)}
                                    </div>
                                    <span className="text-xs font-bold bg-green-50 text-green-700 px-2 py-1 rounded">98% Match</span>
                                </div>
                                <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-gold-600 line-clamp-1">{sop.title}</h3>
                                <p className="text-xs text-slate-500 line-clamp-2">{sop.description}</p>
                            </div>
                        ))}
                        </div>
                    </>
                ) : (
                     <div className="p-8 bg-white border border-slate-200 rounded-xl text-center">
                        <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900">Protocol Library Empty</h3>
                        <p className="text-slate-500 text-sm mt-2">Please refresh or click "Manual Database Restore" above.</p>
                     </div>
                )}
            </div>
          </div>

          {/* Side Widgets */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
               <h3 className="font-bold text-slate-900 text-sm mb-2">Execution Capacity</h3>
               <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500">{executionBalance > 9000 ? 'Unlimited' : executionBalance} credits remaining</span>
                  <span className="text-xs font-bold text-gold-600 uppercase">{userTier} License</span>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-900 to-amber-600 h-full" style={{ width: executionBalance > 9000 ? '100%' : `${(executionBalance/60)*100}%` }}></div>
               </div>
               <button onClick={() => setCurrentView(ViewState.PRICING)} className="mt-3 text-xs font-bold text-slate-900 hover:underline w-full text-center">Manage License</button>
            </div>
            
            {/* Demo Link to Admin Dashboard */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 shadow-sm p-4">
               <h3 className="font-bold text-slate-900 text-sm mb-2">Internal Tools</h3>
               <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setCurrentView(ViewState.ADMIN)} className="w-full text-xs font-bold text-slate-600 bg-white border border-slate-200 py-2 rounded hover:bg-slate-100 transition-colors">
                     Reviewer Admin
                  </button>
                  <button onClick={() => setCurrentView(ViewState.CREATOR_DASHBOARD)} className="w-full text-xs font-bold text-white bg-slate-900 border border-slate-900 py-2 rounded hover:bg-slate-800 transition-colors">
                     Creator Portal
                  </button>
               </div>
            </div>
          </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(currentView) {
        case ViewState.MARKETPLACE:
           return <Marketplace sops={sops} onSelectSOP={handleSelectSOP} userTier={userTier} />;
        case ViewState.DASHBOARD:
           return <Dashboard />;
        case ViewState.SETTINGS:
           return <SettingsView />;
        case ViewState.SUPPORT:
           return <SupportView />;
        case ViewState.LEGAL:
           return <LegalView defaultTab={legalTab} />;
        case ViewState.COMMUNITIES:
           return <Communities sops={sops} />;
        case ViewState.PRICING:
           return <PricingSelection onSelect={handlePricingComplete} onBack={() => setCurrentView(ViewState.HOME)} />;
        case ViewState.HOME:
        default:
           return <HomeView />;
    }
  };

  const NavItem = ({ icon: Icon, label, active, onClick }: any) => (
      <button 
          onClick={onClick}
          className={`w-full flex items-center px-4 py-3 text-sm font-bold transition-all border-l-4 ${
              active 
              ? 'border-amber-500 bg-white text-slate-900' 
              : 'border-transparent text-slate-600 hover:bg-white/50 hover:text-slate-900'
          }`}
      >
          <Icon className={`w-5 h-5 mr-3 ${active ? 'text-amber-600' : 'text-slate-500'}`} />
          {label}
      </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
            <div className="fixed inset-0 z-40 bg-slate-900/50 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
        )}

        {/* Updated Sidebar: Light Gold Gradient */}
        <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-r from-amber-100/60 via-amber-50/50 to-white border-r border-amber-100/50 transform transition-transform duration-300 md:transform-none flex flex-col ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView(ViewState.HOME)}>
                    <Logo className="h-6 w-6" />
                </div>
                <button className="md:hidden text-slate-400" onClick={() => setMobileMenuOpen(false)}><X className="w-5 h-5" /></button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 space-y-1">
                <NavItem icon={Home} label="Home" active={currentView === ViewState.HOME} onClick={() => setCurrentView(ViewState.HOME)} />
                <NavItem icon={ShoppingBag} label="Marketplace" active={currentView === ViewState.MARKETPLACE} onClick={() => setCurrentView(ViewState.MARKETPLACE)} />
                <NavItem icon={PlusCircle} label="Create Protocol" active={false} onClick={handleCreateProtocol} />
                <NavItem icon={Building2} label="Enterprise Vault" active={false} onClick={handleEnterpriseAccess} />
                <NavItem icon={Users} label="Communities" active={currentView === ViewState.COMMUNITIES} onClick={() => setCurrentView(ViewState.COMMUNITIES)} />
                <NavItem icon={DollarSign} label="Pricing" active={currentView === ViewState.PRICING} onClick={() => setCurrentView(ViewState.PRICING)} />
                <NavItem icon={BarChart3} label="Analytics" active={currentView === ViewState.DASHBOARD} onClick={() => setCurrentView(ViewState.DASHBOARD)} />
                <NavItem icon={Settings} label="Settings" active={currentView === ViewState.SETTINGS} onClick={() => setCurrentView(ViewState.SETTINGS)} />
                
                <div className="pt-4 mt-4 border-t border-amber-100">
                    <NavItem icon={LogOut} label="Log Out" active={false} onClick={handleLogOut} />
                </div>
            </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
            
            {/* Top Navigation Header */}
            <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm relative">
                <button className="md:hidden text-slate-600" onClick={() => setMobileMenuOpen(true)}><Menu className="w-6 h-6" /></button>
                
                {/* Left Side of Header - ADDED Categories */}
                <div className="hidden md:flex items-center space-x-6 text-sm font-bold text-slate-600">
                   <button onClick={() => setCurrentView(ViewState.HOME)} className="hover:text-amber-600 transition-colors">How it Works</button>
                   <button onClick={() => setCurrentView(ViewState.PRICING)} className="hover:text-amber-600 transition-colors">Pricing</button>
                   <button onClick={() => setCurrentView(ViewState.MARKETPLACE)} className="hover:text-amber-600 transition-colors flex items-center gap-1">
                      <Grid className="w-4 h-4" /> Categories
                   </button>
                </div>

                {/* Right Side of Header */}
                <div className="flex items-center space-x-4">
                    {/* Responsive Notification Bell with Dropdown */}
                    <div className="relative" ref={notificationRef}>
                        <button 
                            className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                            onClick={() => setShowNotifications(!showNotifications)}
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
                        </button>

                        {/* Notification Dropdown UI */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-fade-in-down">
                                <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Notifications</span>
                                    {unreadCount > 0 && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">{unreadCount} New</span>}
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((note) => (
                                            <div 
                                                key={note.id} 
                                                onClick={() => handleNotificationClick(note.id)}
                                                className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${!note.read ? 'bg-blue-50/30' : ''}`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${!note.read ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                                                    <div>
                                                        <p className={`text-xs mb-1 ${!note.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                                                            {note.title}
                                                        </p>
                                                        <p className="text-xs text-slate-500 leading-snug">{note.message}</p>
                                                        <p className="text-[10px] text-slate-400 mt-2">{note.timestamp}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-slate-400 text-xs">No notifications</div>
                                    )}
                                </div>
                                <div className="p-2 border-t border-slate-100 text-center">
                                    <button className="text-xs font-bold text-brand-600 hover:text-brand-700">Mark all read</button>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="h-6 w-px bg-slate-200 mx-2"></div>
                    
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <div className="text-xs font-bold text-slate-900">{userName}</div>
                            <div className="text-[10px] text-amber-600 uppercase font-bold tracking-wider">{userTier}</div>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold shadow-md">
                            {userName.charAt(0)}
                        </div>
                    </div>

                    <button 
                        onClick={handleLogOut}
                        className="ml-2 text-slate-400 hover:text-red-500 transition-colors"
                        title="Sign Out"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Scrollable Main Content */}
            <main className="flex-1 overflow-y-auto bg-slate-50 relative flex flex-col">
                <div className="flex-1">
                    {renderContent()}
                </div>

                {/* New Bottom Footer (Post-Login) with Contact Info */}
                <footer className="bg-white border-t border-slate-200 py-12 px-8 mt-auto">
                    <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-1">
                             <Logo className="h-8 w-8 mb-4" />
                             <p className="text-sm text-slate-500 max-w-sm">
                                The AI-Powered SOP & Process Marketplace. A living operating system for business execution, not just documentation.
                             </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Services Offered</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li><button onClick={() => setCurrentView(ViewState.MARKETPLACE)} className="hover:text-amber-600">SOP Marketplace</button></li>
                                <li><button onClick={() => setCurrentView(ViewState.ENTERPRISE_SALES)} className="hover:text-amber-600">Enterprise Solutions</button></li>
                                <li><button onClick={() => setCurrentView(ViewState.CREATE_PROTOCOL)} className="hover:text-amber-600">Creator Studio</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Support & Legal</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li><button onClick={() => setCurrentView(ViewState.SUPPORT)} className="hover:text-amber-600">Help Center</button></li>
                                <li><button onClick={() => handleLegalNav('Privacy Policy')} className="hover:text-amber-600">Privacy Policy</button></li>
                                <li><button onClick={() => handleLegalNav('Terms of Service')} className="hover:text-amber-600">Terms of Service</button></li>
                            </ul>
                        </div>
                        {/* New Contact Info Section */}
                        <div>
                            <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
                            <ul className="space-y-3 text-sm text-slate-600">
                                <li className="flex items-start">
                                    <MapPin className="w-4 h-4 mr-2 text-amber-500 shrink-0 mt-0.5" />
                                    <span>100 Pine Street, Suite 1250<br/>San Francisco, CA 94111</span>
                                </li>
                                <li className="flex items-center">
                                    <Phone className="w-4 h-4 mr-2 text-amber-500 shrink-0" />
                                    <span>+1 (415) 555-0123</span>
                                </li>
                                <li className="flex items-center">
                                    <Mail className="w-4 h-4 mr-2 text-amber-500 shrink-0" />
                                    <span>enterprise@protocolly.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="max-w-7xl mx-auto pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
                        <p>© 2026 PROTOCOLLY Inc. All rights reserved.</p>
                        <div className="flex gap-4 mt-4 md:mt-0">
                            <span>US Headquarters</span>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    </div>
  );
};

export default App;
