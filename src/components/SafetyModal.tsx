import React from 'react';
import { X, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="safety-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-lg bg-white rounded-lg border border-slate-200 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-800" />
            <h2 id="safety-modal-title" className="text-base font-bold text-slate-900">
              DrugGuard Principles & Safety Limits
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded text-emerald-950 font-medium">
            DrugGuard is an educational information tool. It helps Nigerians look up registered product details and safety summaries from reference records.
          </div>

          <div>
            <h3 className="font-bold text-slate-900 uppercase tracking-wider mb-1.5">
              What DrugGuard Is NOT
            </h3>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span><strong>Not a medical diagnostic or prescribing service:</strong> Never use this app to diagnose illnesses or select a medicine without professional consultation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span><strong>Not an physical authenticity certification:</strong> Matching a NAFDAC number online does NOT certify that the physical box in your hand is genuine or unadulterated.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span><strong>Not a counterfeit determinant:</strong> If a medicine is not found in this demonstrator, it does NOT automatically mean the medicine is fake.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span><strong>Not a pharmacy marketplace:</strong> DrugGuard does not sell, ship, or process orders for pharmaceuticals.</span>
              </li>
            </ul>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider mb-1.5">
              Physical Medicine Inspection Tips in Nigeria
            </h3>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span>Always purchase medicines from registered, licensed pharmacies (look for the Pharmacists Council of Nigeria green emblem).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span>On antimalarials and antibiotics, scratch the MAS panel and send the PIN free to the 4-digit shortcode (e.g. 38353) to verify before ingestion.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span>Inspect packaging for typos, broken tamper seals, missing batch numbers, or altered manufacturing/expiry dates.</span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-500">
            For official regulatory inquiries or adverse drug reactions, contact NAFDAC directly at <strong>0700-1-NAFDAC</strong> or report via the official Med Safety mobile application.
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="min-h-[44px] px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
