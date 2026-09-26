import React from 'react';

interface QuickExamplesProps {
  onSelectExample: (example: string) => void;
  disabled?: boolean;
}

export const QuickExamples: React.FC<QuickExamplesProps> = ({
  onSelectExample,
  disabled = false,
}) => {
  const primaryExamples = [
    { label: 'P-Alaxin', query: 'P-Alaxin' },
    { label: 'Paracetamol', query: 'Paracetamol' },
    { label: 'Amoxicillin', query: 'Amoxicillin' },
  ];

  const secondaryExamples = [
    { label: 'NAFDAC: B4-8892', query: 'B4-8892' },
    { label: 'Unmatched: Artemisin-X', query: 'Artemisin-X' },
  ];

  return (
    <div className="pt-2">
      <div className="text-xs font-medium text-slate-500 mb-2">
        Try searching for:
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {primaryExamples.map((item) => (
          <button
            key={item.label}
            type="button"
            disabled={disabled}
            onClick={() => onSelectExample(item.query)}
            className="min-h-[44px] px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {item.label}
          </button>
        ))}

        <span className="text-slate-300 text-xs hidden sm:inline" aria-hidden="true">|</span>

        {secondaryExamples.map((item) => (
          <button
            key={item.label}
            type="button"
            disabled={disabled}
            onClick={() => onSelectExample(item.query)}
            className="min-h-[44px] px-3 py-2 text-xs text-slate-500 bg-slate-50/70 border border-slate-200/80 rounded-md hover:bg-white hover:text-slate-700 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
