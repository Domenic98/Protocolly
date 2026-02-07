import React from 'react';

export const Logo: React.FC<{ className?: string, light?: boolean }> = ({ className = "h-8 w-8", light = false }) => {
  return (
    <div className="flex items-center gap-2">
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={`${className} ${light ? 'text-white' : 'text-brand-600'}`}
      >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
        <polyline points="7.5 19.79 7.5 14.6 3 12" />
        <polyline points="21 12 16.5 14.6 16.5 19.79" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
      <span className={`font-bold tracking-tight text-xl ${light ? 'text-white' : 'text-slate-900'}`}>
        PROTOCOLLY<span className="text-brand-500">™</span>
      </span>
    </div>
  );
};