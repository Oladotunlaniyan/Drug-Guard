import React from 'react';
import { HelpCircle, ExternalLink, RefreshCw, AlertTriangle, PhoneCall } from 'lucide-react';

interface NoResultsProps {
  searchQuery: string;
  onClear: () => void;
  onTryExample: (example: string) => void;
}

export const NoResults: React.FC<NoResultsProps> = ({
  searchQuery,
  onClear,
  onTryExample,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-7 shadow-xs space-y-5">
      {/* Primary Status Banner */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Search Status</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          No matching product record found
        </h2>
        <p className="text-sm text-slate-600">
          We could not find an entry matching <span className="font-semibold text-slate-900">"{searchQuery}"</span> in our current reference database.
        </p>
      </div>

      {/* Crucial Public Safety Clarification */}
      <div className="bg-amber-50/70 border border-amber-200/90 rounded-md p-4 text-xs text-amber-900 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Important Safety Notice</span>
        </div>
        <p className="leading-relaxed">
          We couldn't find a matching product in our current database. This does not automatically mean the medicine is counterfeit.
        </p>
        <p className="text-amber-800">
          Some legitimate medicines may have newer registration batches, variations in brand spelling, or may not yet be indexed in this demonstration tool.
        </p>
      </div>

      {/* Recommended Next Steps */}
      <div className="space-y-3 pt-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          Recommended Next Steps
        </h3>
        <ul className="space-y-2.5 text-xs text-slate-700">
          <li className="flex items-start gap-2.5">
            <span className="font-bold text-slate-400">1.</span>
            <span>
              <strong>Check spelling or numbers:</strong> Verify the spelling on the physical blister pack or box, or search by just the generic active ingredient (e.g. "Paracetamol").
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="font-bold text-slate-400">2.</span>
            <span>
              <strong>Consult a registered pharmacist:</strong> Take the product packaging to a licensed community pharmacy. Pharmacists are trained to inspect packaging, batch numbers, and seal integrity.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="font-bold text-slate-400">3.</span>
            <span>
              <strong>Verify on the official NAFDAC registry:</strong> For complete legal verification or to report suspected substandard items, check the official National Agency for Food and Drug Administration and Control portal.
            </span>
          </li>
        </ul>
      </div>

      {/* Action buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 border-t border-slate-100">
        <button
          onClick={onClear}
          className="min-h-[44px] px-4 py-2.5 bg-slate-900 text-white text-xs font-medium rounded-md hover:bg-slate-800 active:bg-slate-950 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Clear & search again</span>
        </button>

        <a
          href="https://www.nafdac.gov.ng"
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] px-4 py-2.5 bg-white text-slate-700 border border-slate-200 text-xs font-medium rounded-md hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
        >
          <span>Open NAFDAC Official Portal</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>
      </div>

      {/* Quick recovery examples */}
      <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
        <span className="font-medium text-slate-700">Or try registered sample: </span>
        <button
          onClick={() => onTryExample('P-Alaxin')}
          className="text-emerald-800 hover:text-emerald-950 underline underline-offset-2 ml-1 cursor-pointer"
        >
          P-Alaxin
        </button>
        <span className="mx-1.5">·</span>
        <button
          onClick={() => onTryExample('Paracetamol')}
          className="text-emerald-800 hover:text-emerald-950 underline underline-offset-2 cursor-pointer"
        >
          Paracetamol
        </button>
        <span className="mx-1.5">·</span>
        <button
          onClick={() => onTryExample('Amoxicillin')}
          className="text-emerald-800 hover:text-emerald-950 underline underline-offset-2 cursor-pointer"
        >
          Amoxicillin
        </button>
      </div>
    </div>
  );
};
