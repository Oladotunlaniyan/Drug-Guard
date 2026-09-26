import React from 'react';
import { ShieldCheck, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onGoHome: () => void;
  onOpenSafetyGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onGoHome,
  onOpenSafetyGuide,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Wordmark */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded cursor-pointer"
          aria-label="DrugGuard Home"
        >
          <div className="w-8 h-8 rounded bg-emerald-800 flex items-center justify-center text-white shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-100" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-emerald-900 transition-colors">
            DrugGuard
          </span>
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={onGoHome}
            className="hover:text-slate-900 transition-colors py-1 cursor-pointer"
          >
            Medicine Search
          </button>
          <button
            onClick={onOpenSafetyGuide}
            className="hover:text-slate-900 transition-colors py-1 cursor-pointer"
          >
            Safety & Boundaries
          </button>
          <a
            href="https://www.nafdac.gov.ng"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-900 transition-colors py-1 inline-flex items-center gap-1"
          >
            NAFDAC Portal
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSafetyGuide}
            className="min-h-[38px] px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            aria-label="View Safety Guidelines and Boundaries"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>About</span>
          </button>
        </div>
      </div>
    </header>
  );
};
