import React from 'react';
import { HelpCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { tapScale } from '../utils/motion';

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
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white border border-[#dce8dc] rounded-[24px] p-6 sm:p-7 shadow-2xs space-y-4 text-center sm:text-left"
    >
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#81a18e]">
          <HelpCircle className="w-4 h-4 text-[#81a18e]" />
          <span>Search Result</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-[#16352a] tracking-tight">
          No matching medicine record found
        </h2>
        <p className="text-xs sm:text-sm text-[#729080]">
          We could not find an entry matching <span className="font-semibold text-[#16352a]">"{searchQuery}"</span> in the database.
        </p>
      </div>

      {/* Safety Notice */}
      <div className="bg-[#eef6ed] border border-[#dce8dc] rounded-2xl p-4 text-xs text-[#2d6a4f] space-y-1 text-left">
        <div className="flex items-center gap-1.5 font-bold text-[#16352a]">
          <AlertTriangle className="w-3.5 h-3.5 text-[#52b788] shrink-0" />
          <span>Notice</span>
        </div>
        <p className="leading-relaxed">
          The absence of a record does not automatically mean a medicine is counterfeit. Check spelling, search by generic active ingredient (e.g. "Paracetamol"), or consult a licensed pharmacist.
        </p>
      </div>

      {/* Actions */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#edf1eb]">
        <div className="flex items-center gap-1.5 text-xs text-[#81a18e]">
          <span>Try:</span>
          {['P-Alaxin', 'Paracetamol', 'Amoxicillin'].map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => onTryExample(ex)}
              className="text-xs font-semibold text-[#2d6a4f] hover:underline cursor-pointer"
            >
              {ex}
            </button>
          ))}
        </div>

        <motion.button
          whileTap={tapScale}
          onClick={onClear}
          className="text-xs font-semibold text-[#1b4332] hover:underline cursor-pointer"
        >
          Clear search
        </motion.button>
      </div>
    </motion.div>
  );
};
