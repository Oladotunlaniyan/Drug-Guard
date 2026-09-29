import React from 'react';
import { Medicine } from '../types/medicine';
import { ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { itemVariants, tapScale } from '../utils/motion';

interface SearchResultsProps {
  results: Medicine[];
  searchQuery: string;
  onSelectMedicine: (medicine: Medicine) => void;
  onClearSearch: () => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  searchQuery,
  onSelectMedicine,
  onClearSearch,
}) => {
  return (
    <div className="space-y-3">
      {/* Search summary header */}
      <div className="flex items-center justify-between px-1">
        <div className="text-sm font-medium text-[#2d4f3b]">
          Found <span className="font-bold text-[#16352a]">{results.length}</span> {results.length === 1 ? 'record' : 'records'} matching "{searchQuery}"
        </div>
        <button
          onClick={onClearSearch}
          className="text-xs font-bold text-[#1b4332] hover:underline underline-offset-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332] rounded p-1"
        >
          Clear
        </button>
      </div>

      {/* Results list - clean, uncluttered, WCAG AA contrast */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
        className="divide-y divide-[#edf1eb] border border-[#cbd9cc] rounded-[22px] bg-white overflow-hidden shadow-2xs"
      >
        {results.map((med) => {
          const isRegistered = med.registrationStatus === 'REGISTERED';

          return (
            <motion.button
              key={med.id}
              variants={itemVariants}
              whileHover={{ backgroundColor: '#fcfdfc' }}
              whileTap={tapScale}
              onClick={() => onSelectMedicine(med)}
              className="w-full text-left p-4 sm:p-4.5 transition-colors flex items-start justify-between gap-3.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332]"
            >
              <div className="flex-1 min-w-0 space-y-1.5">
                {/* Product Name & Category */}
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h3 className="text-[16px] font-bold text-[#16352a] tracking-tight leading-snug">
                    {med.name}
                  </h3>
                  {med.category && (
                    <span className="text-xs font-semibold text-[#2d4f3b]">
                      · {med.category}
                    </span>
                  )}
                </div>

                {/* Primary Specifications: Active Ingredients */}
                {med.activeIngredients && (
                  <div className="text-xs sm:text-sm text-[#204030] leading-relaxed">
                    <span className="font-bold text-[#16352a]">Active: </span>
                    {med.activeIngredients}
                  </div>
                )}

                {/* Clean Metadata Row */}
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#2d4f3b] font-medium pt-0.5">
                  {(med.dosageForm || med.strength) && (
                    <span>
                      {med.dosageForm || ''}
                      {med.strength ? ` (${med.strength})` : ''}
                    </span>
                  )}
                  {med.nafdacFormattedNumber && (
                    <>
                      <span aria-hidden="true" className="text-[#cbd9cc]">·</span>
                      <span className="font-mono text-[#16352a] font-bold text-[11px] bg-[#eef6ed] px-1.5 py-0.5 rounded">
                        {med.nafdacFormattedNumber}
                      </span>
                    </>
                  )}
                  <span aria-hidden="true" className="text-[#cbd9cc]">·</span>
                  <div className="inline-flex items-center gap-1 font-bold">
                    {isRegistered ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2d6a4f]" />
                        <span className="text-[#1b4332]">Registered</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-[#e1775b]" />
                        <span className="text-[#e1775b]">{med.registrationStatus}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action affordance */}
              <div className="flex items-center self-center text-[#2d6a4f] shrink-0">
                <ChevronRight className="w-4 h-4 text-[#2d6a4f]" />
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};
