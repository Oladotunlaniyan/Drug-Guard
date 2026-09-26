import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

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
    <div className="bg-white border border-rose-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center shrink-0 text-rose-700">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Unable to connect to service
          </h2>
          <p className="text-xs text-slate-600">
            {errorMessage || 'An error occurred while retrieving medicine information. Please check your connection and try again.'}
          </p>
        </div>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 border-t border-slate-100">
        <button
          onClick={onRetry}
          className="min-h-[44px] px-4 py-2 bg-emerald-800 text-white text-xs font-medium rounded-md hover:bg-emerald-900 active:bg-emerald-950 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Search</span>
        </button>

        <button
          onClick={onClear}
          className="min-h-[44px] px-4 py-2 bg-slate-100 text-slate-700 text-xs font-medium rounded-md hover:bg-slate-200 transition-colors flex items-center justify-center cursor-pointer"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
