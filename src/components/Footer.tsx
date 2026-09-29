import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenSafetyGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSafetyGuide }) => {
  return (
    <footer className="mt-14 border-t border-[#dce8dc] bg-[#fcfdfc]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Core disclaimer banner */}
        <div className="p-5 bg-[#eef6ed] border border-[#cbd9cc] rounded-[22px] text-xs sm:text-sm text-[#204030] leading-relaxed">
          <p className="font-bold text-[#16352a] mb-1">
            Statutory Reference & Non-Medical Notice
          </p>
          <p>
            DrugGuard provides medicine information for educational purposes. It does not replace advice from a pharmacist or doctor. DrugGuard does not authenticate physical products, endorse brand selections, or calculate clinical dosages.
          </p>
        </div>

        {/* Links and copyright */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-semibold text-[#355845] pt-2 border-t border-[#edf1eb]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#16352a]">DrugGuard Nigeria</span>
            <span aria-hidden="true" className="text-[#cbd9cc]">·</span>
            <span>Public Health Educational Utility</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <button
              onClick={onOpenSafetyGuide}
              className="hover:text-[#1b4332] underline underline-offset-2 cursor-pointer min-h-[44px] sm:min-h-0 flex items-center font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332] rounded p-1"
            >
              Safety Limits
            </button>
            <a
              href="https://www.nafdac.gov.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1b4332] inline-flex items-center gap-1 min-h-[44px] sm:min-h-0 items-center font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332] rounded p-1"
            >
              <span>NAFDAC Official</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://pcn.gov.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1b4332] inline-flex items-center gap-1 min-h-[44px] sm:min-h-0 items-center font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332] rounded p-1"
            >
              <span>Pharmacy Council</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
