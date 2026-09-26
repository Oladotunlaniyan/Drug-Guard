import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenSafetyGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSafetyGuide }) => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Core disclaimer banner */}
        <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-md text-xs text-slate-600 leading-relaxed">
          <p className="font-semibold text-slate-900 mb-1">
            Statutory Reference & Non-Medical Notice
          </p>
          <p>
            DrugGuard provides medicine information for educational purposes. It does not replace advice from a pharmacist or doctor. DrugGuard does not authenticate physical products, endorse brand selections, or calculate clinical dosages.
          </p>
        </div>

        {/* Links and copyright */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">DrugGuard Nigeria</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Public Health Educational Utility</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <button
              onClick={onOpenSafetyGuide}
              className="hover:text-slate-900 underline underline-offset-2 cursor-pointer min-h-[44px] sm:min-h-0 flex items-center"
            >
              Safety Limits
            </button>
            <a
              href="https://www.nafdac.gov.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 inline-flex items-center gap-1 min-h-[44px] sm:min-h-0 items-center"
            >
              <span>NAFDAC Official</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://pcn.gov.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 inline-flex items-center gap-1 min-h-[44px] sm:min-h-0 items-center"
            >
              <span>Pharmacy Council</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
