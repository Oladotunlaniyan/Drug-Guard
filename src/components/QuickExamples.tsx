import React from 'react';
import { motion } from 'motion/react';
import { tapScale } from '../utils/motion';

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
    { label: 'B4-8892', query: 'B4-8892' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1.5 pt-1">
      <span className="text-xs font-bold text-[#355845] mr-1">
        Try:
      </span>
      {primaryExamples.map((item) => (
        <motion.button
          key={item.label}
          type="button"
          whileHover={{ y: -1 }}
          whileTap={tapScale}
          disabled={disabled}
          onClick={() => onSelectExample(item.query)}
          className="min-h-[36px] px-3.5 py-1 text-xs font-bold text-[#1b4332] bg-[#eef6ed] border border-[#cbd9cc] rounded-full hover:bg-[#dceadd] disabled:opacity-50 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332]"
        >
          {item.label}
        </motion.button>
      ))}
    </div>
  );
};
