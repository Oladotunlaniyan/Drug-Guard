import React, { useState, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { SearchBar } from './components/SearchBar';
import { QuickExamples } from './components/QuickExamples';
import { SearchResults } from './components/SearchResults';
import { MedicineDetail } from './components/MedicineDetail';
import { NoResults } from './components/NoResults';
import { ErrorState } from './components/ErrorState';
import { SafetyModal } from './components/SafetyModal';
import { MedicineScanner } from './components/MedicineScanner';
import { Footer } from './components/Footer';
import { medicineService } from './services/medicineService';
import { Medicine } from './types/medicine';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { pageVariants, tapScale } from './utils/motion';

export default function App() {
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<Medicine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Perform search via the medicineService abstraction layer
  const executeSearch = useCallback(
    async (searchTerm: string) => {
      const trimmed = searchTerm.trim();
      if (!trimmed) return;

      setView('app');
      setIsLoading(true);
      setError(null);
      setSelectedMedicine(null);
      setHasSearched(true);
      setActiveQuery(trimmed);

      try {
        const matches = await medicineService.searchMedicines(trimmed);
        setResults(matches);
      } catch (err: any) {
        setError(
          err?.message ||
            'Unable to connect to the medicine information service. Please check your connection and try again.'
        );
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleSearchSubmit = (customQuery?: string) => {
    const targetQuery = customQuery !== undefined ? customQuery : query;
    if (customQuery !== undefined) {
      setQuery(customQuery);
    }
    executeSearch(targetQuery);
  };

  const handleSelectExample = (exampleText: string) => {
    setQuery(exampleText);
    executeSearch(exampleText);
  };

  const handleOcrConfirmedSearch = (confirmedText: string) => {
    setQuery(confirmedText);
    executeSearch(confirmedText);
  };

  const handleNavigateToSearch = (prefill?: string) => {
    setView('app');
    if (prefill) {
      setQuery(prefill);
      executeSearch(prefill);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClear = () => {
    setQuery('');
    setActiveQuery('');
    setHasSearched(false);
    setResults([]);
    setError(null);
    setSelectedMedicine(null);
  };

  const handleGoHome = () => {
    handleClear();
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectMedicine = (med: Medicine) => {
    setSelectedMedicine(med);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToResults = () => {
    setSelectedMedicine(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f6f8f4] flex flex-col font-sans text-[#16352a] selection:bg-[#52b788]/20 selection:text-[#1b4332]">
      {/* Navigation */}
      <Navbar
        onCheckMedicine={() => handleNavigateToSearch()}
        onScanMedicine={() => setIsScannerOpen(true)}
        onOpenSafety={() => setIsSafetyModalOpen(true)}
        activeView={view}
        onNavigateHome={handleGoHome}
      />

      {/* Main View Router with AnimatePresence */}
      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <motion.div
            key="landing-view"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <LandingPage
              onCheckMedicine={handleNavigateToSearch}
              onScanMedicine={() => setIsScannerOpen(true)}
              onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
              onViewSampleMedicine={handleSelectMedicine}
            />
          </motion.div>
        ) : (
          <motion.main
            key="app-view"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-7 space-y-4"
          >
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
              <motion.button
                whileTap={tapScale}
                onClick={handleGoHome}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1b4332] hover:underline min-h-[44px] px-2 -ml-2 rounded-full cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to overview</span>
              </motion.button>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eef6ed] border border-[#cbd9cc] text-[11px] font-bold text-[#1b4332]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#52b788]" />
                Live Database
              </div>
            </div>

            {/* Search Card (Streamlined & Clean with WCAG AA text) */}
            <div className="bg-white border border-[#cbd9cc] rounded-[24px] p-5 sm:p-6 shadow-2xs space-y-3.5">
              <div className="space-y-1">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#16352a]">
                  Check your medicine before you take it.
                </h1>
                <p className="text-xs sm:text-sm text-[#2d4f3b] font-medium">
                  Search a commercial name or NAFDAC code to view registration and safety information.
                </p>
              </div>

              <SearchBar
                query={query}
                onQueryChange={setQuery}
                onSearch={handleSearchSubmit}
                onOpenScanner={() => setIsScannerOpen(true)}
                isLoading={isLoading}
                autoFocus={!hasSearched}
              />

              <QuickExamples
                onSelectExample={handleSelectExample}
                disabled={isLoading}
              />
            </div>

            {/* View States */}
            <AnimatePresence mode="wait">
              {/* State 1: Loading State */}
              {isLoading && (
                <motion.div
                  key="loading-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border border-[#cbd9cc] rounded-[22px] p-8 text-center space-y-2.5 shadow-2xs"
                  aria-live="polite"
                >
                  <div className="w-7 h-7 mx-auto border-2 border-[#1b4332] border-t-transparent rounded-full animate-spin" />
                  <div className="text-xs font-bold text-[#16352a]">
                    Searching medicine records...
                  </div>
                </motion.div>
              )}

              {/* State 2: API Error */}
              {!isLoading && error && (
                <motion.div key="error-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ErrorState
                    errorMessage={error}
                    onRetry={() => executeSearch(activeQuery)}
                    onClear={handleClear}
                  />
                </motion.div>
              )}

              {/* State 3: Detail View */}
              {!isLoading && !error && selectedMedicine && (
                <motion.div key="detail-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <MedicineDetail
                    medicine={selectedMedicine}
                    onBack={handleBackToResults}
                    onSearchAnother={handleClear}
                  />
                </motion.div>
              )}

              {/* State 4: Search Results List */}
              {!isLoading && !error && !selectedMedicine && hasSearched && results.length > 0 && (
                <motion.div key="results-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <SearchResults
                    results={results}
                    searchQuery={activeQuery}
                    onSelectMedicine={handleSelectMedicine}
                    onClearSearch={handleClear}
                  />
                </motion.div>
              )}

              {/* State 5: No Results State */}
              {!isLoading && !error && !selectedMedicine && hasSearched && results.length === 0 && (
                <motion.div key="no-results-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <NoResults
                    searchQuery={activeQuery}
                    onClear={handleClear}
                    onTryExample={handleSelectExample}
                  />
                </motion.div>
              )}

              {/* State 6: Empty Search / Clean Guide */}
              {!isLoading && !error && !hasSearched && (
                <motion.div
                  key="guide-state"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="border border-[#cbd9cc] rounded-[22px] bg-white p-5 space-y-3 text-xs text-[#204030] shadow-2xs"
                >
                  <div className="font-bold text-[#16352a] text-sm">
                    How to look up a medicine
                  </div>
                  <p className="leading-relaxed">
                    Enter the brand name (e.g., <span className="font-bold text-[#16352a]">P-Alaxin</span>), active drug (e.g., <span className="font-bold text-[#16352a]">Paracetamol</span>), or registration code (e.g., <span className="font-mono text-[#16352a] font-bold">B4-8892</span>). Or tap <span className="font-bold text-[#16352a]">Scan packaging</span> to extract text with your camera or photo upload.
                  </p>
                  <div className="pt-2 text-xs text-[#2d4f3b] font-medium border-t border-[#edf1eb]">
                    A registration record does not guarantee that the specific pack in your hand is genuine. Always buy from licensed pharmacies and check the pack for NAFDAC details.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Footer onOpenSafetyGuide={() => setIsSafetyModalOpen(true)} />
          </motion.main>
        )}
      </AnimatePresence>

      {/* Modals with smooth motion */}
      <SafetyModal
        isOpen={isSafetyModalOpen}
        onClose={() => setIsSafetyModalOpen(false)}
      />

      <MedicineScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onConfirmSearch={handleOcrConfirmedSearch}
      />
    </div>
  );
}
