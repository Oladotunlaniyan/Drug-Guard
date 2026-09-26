import React, { useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  onSearch: (customQuery?: string) => void;
  isLoading: boolean;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  onSearch,
  isLoading,
  autoFocus = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  const handleClear = () => {
    onQueryChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5 sm:gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-emerald-700" />
            ) : (
              <Search className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search medicine or NAFDAC number"
            aria-label="Search medicine or NAFDAC number"
            className="w-full pl-11 pr-10 py-3.5 sm:py-3 text-base sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 shadow-xs transition-shadow min-h-[48px]"
          />
          {query.trim().length > 0 && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 min-h-[44px] min-w-[44px] justify-center cursor-pointer"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="min-h-[48px] px-6 py-3 bg-emerald-800 text-white font-medium text-sm rounded-lg hover:bg-emerald-900 active:bg-emerald-950 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors shrink-0 shadow-xs flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Checking...</span>
            </>
          ) : (
            <span>Check medicine</span>
          )}
        </button>
      </div>
    </form>
  );
};
