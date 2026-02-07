import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Star, Download, ChevronRight, TrendingUp, Sparkles, 
  Zap, Award, Flame, Clock, Share2, ThumbsUp, Link, CheckCircle, 
  Lock, ShieldAlert, ShoppingBag, AlertTriangle, ChevronDown, XCircle,
  GitBranch, Shield, Activity, RefreshCw, Cpu, Globe, BrainCircuit,
  Layout, Server, AlertOctagon, Layers, GitFork, DollarSign, Scale, MessageCircle, BadgeCheck, User, Calendar
} from 'lucide-react';
import Fuse from 'fuse.js';
import { SOP } from '../types';

interface MarketplaceProps {
  sops: SOP[];
  onSelectSOP: (sop: SOP) => void;
  userTier: string;
}

const getSopTierRequirement = (sop: SOP): string => {
    if (sop.tierAccess) return sop.tierAccess;
    const priceWeight = sop.price;
    if (priceWeight === 0) return 'Observer';
    if (priceWeight < 100) return 'Operator';
    if (priceWeight < 200) return 'Commander';
    if (priceWeight < 500) return 'Authority';
    return 'Sovereign';
};

const getExecutionCost = (sop: SOP): number => {
    if (sop.executionWeight) return sop.executionWeight * 10;
    if (sop.price === 0) return 1;
    return Math.ceil(sop.price / 50) + 1;
};

const TIER_LEVELS: Record<string, number> = {
    'Observer': 0,
    'Operator': 1,
    'Commander': 2,
    'Authority': 3,
    'Sovereign': 4
};

const SOPCard: React.FC<{ sop: SOP, onClick: () => void, userTier: string }> = ({ sop, onClick, userTier }) => {
  const requiredTier = getSopTierRequirement(sop);
  const cost = getExecutionCost(sop);
  const isLocked = TIER_LEVELS[userTier] < TIER_LEVELS[requiredTier];

  return (
    <div onClick={onClick} className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer h-full flex flex-col bg-white border border-slate-200 hover:border-amber-300">
      
      {/* Title Slide: Gradient Goldish Black */}
      <div className="relative p-5 bg-gradient-to-r from-slate-900 via-amber-900 to-slate-900 min-h-[100px] flex items-center">
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-[40px] pointer-events-none group-hover:bg-amber-400/30 transition-all"></div>
        
        <div className="relative z-10 w-full">
            <div className="flex justify-between items-start mb-2">
                 <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded bg-black/20">
                    {sop.category}
                 </span>
                 {isLocked && <Lock className="w-4 h-4 text-amber-500" />}
            </div>
            <h3 className="font-bold text-lg text-white leading-tight line-clamp-2 group-hover:text-amber-200 transition-colors">
                {sop.title}
            </h3>
        </div>
      </div>

      {/* Content Body: Vibrant Light Tiles */}
      <div className="p-4 flex-1 flex flex-col bg-slate-50">
        {/* Metadata Tiles - Vibrant Colors */}
        <div className="grid grid-cols-2 gap-2 mb-4">
             <div className="bg-blue-50 border border-blue-100 p-2 rounded-lg flex flex-col justify-center">
                 <span className="text-[10px] text-blue-400 font-bold uppercase">Version</span>
                 <span className="text-xs font-bold text-blue-700">v{sop.version}</span>
             </div>
             <div className="bg-purple-50 border border-purple-100 p-2 rounded-lg flex flex-col justify-center">
                 <span className="text-[10px] text-purple-400 font-bold uppercase">Owner</span>
                 <span className="text-xs font-bold text-purple-700 truncate">{sop.sopOwner || 'System'}</span>
             </div>
             <div className={`border p-2 rounded-lg flex flex-col justify-center ${sop.riskClass === 'High' ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                 <span className={`text-[10px] font-bold uppercase ${sop.riskClass === 'High' ? 'text-red-400' : 'text-green-400'}`}>Risk Class</span>
                 <span className={`text-xs font-bold ${sop.riskClass === 'High' ? 'text-red-700' : 'text-green-700'}`}>{sop.riskClass}</span>
             </div>
             <div className="bg-orange-50 border border-orange-100 p-2 rounded-lg flex flex-col justify-center">
                 <span className="text-[10px] text-orange-400 font-bold uppercase">Cycle</span>
                 <span className="text-xs font-bold text-orange-700 truncate">{sop.reviewCycle}</span>
             </div>
        </div>

        {/* Detailed Metadata List */}
        <div className="space-y-2 mb-4 flex-1">
             <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-1">
                 <span className="text-slate-500 flex items-center"><User className="w-3 h-3 mr-1" /> Approved By</span>
                 <span className="font-medium text-slate-900 truncate max-w-[100px]">{sop.approvedBy || 'N/A'}</span>
             </div>
             <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-1">
                 <span className="text-slate-500 flex items-center"><Globe className="w-3 h-3 mr-1" /> Jurisdiction</span>
                 <span className="font-medium text-slate-900 truncate max-w-[100px]">{sop.jurisdiction}</span>
             </div>
             <div className="flex items-center justify-between text-xs pb-1">
                 <span className="text-slate-500 flex items-center"><Calendar className="w-3 h-3 mr-1" /> Effective</span>
                 <span className="font-medium text-slate-900">{sop.effectiveDate}</span>
             </div>
        </div>

        {/* Action Footer */}
        <div className="mt-auto pt-3 border-t border-slate-200 flex justify-between items-center">
             <div className="flex flex-col">
                 <span className="text-[10px] uppercase font-bold text-slate-400">Tier Access</span>
                 <span className="text-xs font-bold text-slate-900">{requiredTier}</span>
             </div>
             <button className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center shadow-md transition-all ${
                 isLocked ? 'bg-slate-200 text-slate-500' : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:shadow-lg'
             }`}>
                 {isLocked ? <Lock className="w-3 h-3" /> : <Zap className="w-3 h-3 mr-1" />}
                 {isLocked ? 'Locked' : 'Run'}
             </button>
        </div>
      </div>
    </div>
  );
};

export const Marketplace: React.FC<MarketplaceProps> = ({ sops, onSelectSOP, userTier }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [displayCount, setDisplayCount] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  
  const fuse = useMemo(() => new Fuse(sops, {
    keys: ['title', 'description', 'category', 'author'],
    threshold: 0.4,
    distance: 100,
  }), [sops]);

  // Get unique categories and sort them
  const categories = useMemo(() => {
    const cats = Array.from(new Set(sops.map(s => s.category)));
    return ['All', ...cats.sort()];
  }, [sops]);

  const filteredSops = useMemo(() => {
    let result = sops;
    if (searchQuery) {
        result = fuse.search(searchQuery).map(r => r.item);
    }
    if (activeCategory !== 'All') {
      result = result.filter(s => s.category === activeCategory);
    }
    return result;
  }, [sops, activeCategory, searchQuery, fuse]);

  const displayedSops = filteredSops.slice(0, displayCount);

  return (
    <div className="pb-24 bg-slate-50 min-h-full">
      {/* Search Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm/50 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
           <div className="flex flex-col md:flex-row md:items-center gap-4">
             <div className="relative flex-1 group">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-amber-500 transition-colors" />
               <input 
                type="text" 
                placeholder="Search protocols (e.g. 'onboarding' or 'compliance')..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-transparent rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
               />
             </div>
             <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide mask-image-linear-gradient">
               {categories.map(cat => (
                 <button
                   key={cat}
                   onClick={() => { setActiveCategory(cat); setDisplayCount(12); }}
                   className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all border
                     ${activeCategory === cat 
                       ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-105' 
                       : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                     }`}
                 >
                   {cat}
                 </button>
               ))}
             </div>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12 mt-8">
        
        {/* NEW GOLD GRADIENT BANNER */}
        <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-amber-100 via-amber-200 to-amber-300 shadow-xl relative border border-amber-300 animate-fade-in">
            <div className="relative z-10 p-8 md:p-12 text-center md:text-left">
                <div className="max-w-4xl mx-auto md:mx-0">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
                        PROTOCOLLY is a live marketplace of <br/>
                        <span className="text-amber-700">AI-Powered, continuously updating SOPs.</span>
                    </h1>
                    <div className="bg-white/40 inline-block px-6 py-3 rounded-xl backdrop-blur-sm border border-white/50">
                        <p className="text-lg md:text-xl font-bold text-slate-800 italic">
                            "This is where <span className="text-amber-700 underline decoration-amber-500/50">Value is created</span>. Users don’t just read SOPs. They run them."
                        </p>
                    </div>
                </div>
            </div>
            {/* Abstract Shine */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/40 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        </div>

        {/* Main Grid */}
        <section id="main-grid">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <Award className="h-5 w-5 text-amber-500 mr-2" /> 
              {activeCategory === 'All' ? 'Marketplace' : activeCategory}
              <span className="ml-3 text-sm font-normal text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">{filteredSops.length} Protocols</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedSops.map((sop) => (
              <SOPCard key={sop.id} sop={sop} onClick={() => onSelectSOP(sop)} userTier={userTier} />
            ))}
          </div>

          {/* Pagination / Load More */}
          {displayCount < filteredSops.length && (
            <div className="mt-12 text-center">
              <button 
                onClick={() => setDisplayCount(prev => prev + 12)}
                className="bg-white border border-slate-200 text-slate-600 px-8 py-3 rounded-full font-bold shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center mx-auto"
              >
                Load More Protocols <ChevronDown className="w-4 h-4 ml-2" />
              </button>
            </div>
          )}
        </section>

      </div>
    </div>
  );
};