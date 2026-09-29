import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { tapScale } from '../utils/motion';

interface ErrorStateProps {
  errorMessage: string;
  onRetry: () => void;
  onClear: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  errorMessage,
  onRetry,
  onClear,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white border border-rose-200 rounded-[22px] p-5 sm:p-6 shadow-2xs space-y-3.5"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center shrink-0 text-rose-600">
          <AlertCircle className="w-4.5 h-4.5" />
        </div>
        <div className="space-y-0.5">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Connection Issue
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {errorMessage || 'Unable to retrieve medicine records. Please check your internet connection.'}
          </p>
        </div>
      </div>

      <div className="pt-2 flex items-center gap-2.5 border-t border-slate-100">
        <motion.button
          whileTap={tapScale}
          onClick={onRetry}
          className="min-h-[38px] px-4 py-1.5 bg-[#1b4332] text-white text-xs font-semibold rounded-full hover:bg-[#24563f] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </motion.button>

        <button
          onClick={onClear}
          className="min-h-[38px] px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          Reset
        </button>
      </div>
    </motion.div>
  );
};