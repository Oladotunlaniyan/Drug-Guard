import React, { useRef, useEffect } from 'react';
import { Search, X, Loader2, Camera } from 'lucide-react';
import { motion } from 'motion/react';
import { tapScale } from '../utils/motion';

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  onSearch: (customQuery?: string) => void;
  onOpenScanner?: () => void;
  isLoading: boolean;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  onSearch,
  onOpenScanner,
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
      <div className="relative flex flex-col sm:flex-row items-stretch gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#355845]">
            {isLoading ? (
              <Loader2 className="w-4.5 h-4.5 animate-spin text-[#1b4332]" />
            ) : (
              <Search className="w-4.5 h-4.5 text-[#355845]" />
            )}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search medicine name or NAFDAC code..."
            aria-label="Search medicine name or NAFDAC code"
            className="w-full pl-10.5 pr-9 py-3 text-sm sm:text-base bg-white border-2 border-[#cbd9cc] rounded-full text-[#16352a] placeholder:text-[#527460] focus:outline-none focus:border-[#1b4332] shadow-2xs transition-all min-h-[46px]"
          />
          {query.trim().length > 0 && !isLoading && (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileTap={tapScale}
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#355845] hover:text-[#16352a] min-h-[44px] min-w-[44px] justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332] rounded-full"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Primary Action: Check medicine (min 44px) */}
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={tapScale}
            type="submit"
            disabled={isLoading || !query.trim()}
            className="flex-1 sm:flex-none min-h-[46px] px-5 py-2.5 bg-[#1b4332] text-white font-bold text-xs sm:text-sm rounded-full hover:bg-[#24563f] active:bg-[#16352a] disabled:bg-[#d5e2d6] disabled:text-[#4a6b54] disabled:cursor-not-allowed transition-all shrink-0 shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#9bdfb1]" />
                <span>Checking...</span>
              </>
            ) : (
              <span>Check medicine</span>
            )}
          </motion.button>

          {/* Secondary Action: Scan medicine (min 44px) */}
          {onOpenScanner && (
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={tapScale}
              type="button"
              onClick={onOpenScanner}
              disabled={isLoading}
              title="Scan packaging with camera"
              className="min-h-[46px] px-4 py-2.5 bg-white border border-[#cbd9cc] hover:bg-[#eef6ed] active:bg-[#e0e9df] text-[#1b4332] font-bold text-xs sm:text-sm rounded-full transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332]"
            >
              <Camera className="w-4 h-4 text-[#2d6a4f]" />
              <span>Scan packaging</span>
            </motion.button>
          )}
        </div>
      </div>
    </form>
  );
};
