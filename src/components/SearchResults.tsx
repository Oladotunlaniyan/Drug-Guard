import React from 'react';
import { Medicine } from '../types/medicine';
import { ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';

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
    <div className="space-y-4">
      {/* Search summary header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
            Search Results
          </div>
          <div className="text-sm text-slate-700 mt-0.5">
            Found <span className="font-semibold text-slate-900">{results.length}</span> {results.length === 1 ? 'record' : 'records'} matching "{searchQuery}"
          </div>
        </div>
        <button
          onClick={onClearSearch}
          className="text-xs font-medium text-emerald-800 hover:text-emerald-950 underline underline-offset-2 min-h-[44px] flex items-center px-1 cursor-pointer"
        >
          New search
        </button>
      </div>

      {/* Results list - highly scannable */}
      <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg bg-white overflow-hidden shadow-xs">
        {results.map((med) => {
          const isRegistered = med.registrationStatus === 'REGISTERED';

          return (
            <button
              key={med.id}
              onClick={() => onSelectMedicine(med)}
              className="w-full text-left p-4 sm:p-5 hover:bg-slate-50 active:bg-slate-100 transition-colors flex items-start justify-between gap-4 cursor-pointer focus:outline-none focus-visible:bg-slate-50"
            >
              <div className="flex-1 min-w-0 space-y-2">
                {/* Product Name & Category */}
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    {med.name}
                  </h3>
                  {med.category && (
                    <span className="text-xs text-slate-500">
                      ({med.category})
                    </span>
                  )}
                </div>

                {/* Primary Specifications: Active Ingredients */}
                {med.activeIngredients && (
                  <div className="text-sm text-slate-700">
                    <span className="font-medium text-slate-900">Active Ingredient: </span>
                    {med.activeIngredients}
                  </div>
                )}

                {/* Metadata with typographic separator */}
                {(med.dosageForm || med.strength || med.route || med.manufacturer) && (
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                    {(med.dosageForm || med.strength) && (
                      <span>
                        <strong className="font-medium text-slate-700">Form: </strong>
                        {med.dosageForm || ''}
                        {med.strength ? ` (${med.strength})` : ''}
                      </span>
                    )}
                    {med.route && (
                      <>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span>
                          <strong className="font-medium text-slate-700">Route: </strong>
                          {med.route}
                        </span>
                      </>
                    )}
                    {med.manufacturer && (
                      <>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="truncate">
                          <strong className="font-medium text-slate-700">Manufacturer: </strong>
                          {med.manufacturer}
                        </span>
                      </>
                    )}
                  </div>
                )}

                {/* Registration reference identifier and registration status */}
                <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
                  {med.nafdacFormattedNumber && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">Registration Reference:</span>
                      <span className="font-mono font-medium text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[11px] tabular-nums">
                        {med.nafdacFormattedNumber}
                      </span>
                    </div>
                  )}

                  {med.nafdacFormattedNumber && (
                    <span aria-hidden="true" className="text-slate-300">·</span>
                  )}

                  {/* Registration Status - requirement: "Registered product found" */}
                  <div className="flex items-center gap-1">
                    {isRegistered ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="font-medium text-emerald-800">
                          Registered product found
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                        <span className="font-medium text-amber-800">
                          {med.registrationStatus}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Provenance Tag */}
                  {med.sourceType === 'demo' && (
                    <>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        Demo Data
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Action affordance */}
              <div className="flex items-center self-center text-slate-400 shrink-0 min-h-[44px] min-w-[32px] justify-end">
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
