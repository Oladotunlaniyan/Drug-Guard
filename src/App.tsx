import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
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
import { ShieldCheck } from 'lucide-react';

export default function App() {
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

  // Called after user confirms/edits OCR detected medicine text
  const handleOcrConfirmedSearch = (confirmedText: string) => {
    setQuery(confirmedText);
    executeSearch(confirmedText);
  };

  const handleClear = () => {
    setQuery('');
    setActiveQuery('');
    setHasSearched(false);
    setResults([]);
    setError(null);
    setSelectedMedicine(null);
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Header
        onGoHome={handleClear}
        onOpenSafetyGuide={() => setIsSafetyModalOpen(true)}
      />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Search Header Form - always accessible at top */}
        <section className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Check your medicine before you take it.
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Search a medicine or NAFDAC registration number to view trusted product information.
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

          {/* Small required statutory disclaimer under search */}
          <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
            DrugGuard provides medicine information for educational purposes. It does not replace advice from a pharmacist or doctor.
          </div>
        </section>

        {/* View Switcher based on UX state */}

        {/* State 1: Loading State */}
        {isLoading && (
          <div
            className="bg-white border border-slate-200 rounded-lg p-8 text-center space-y-3"
            aria-live="polite"
          >
            <div className="w-8 h-8 mx-auto border-2 border-emerald-800 border-t-transparent rounded-full animate-spin" />
            <div className="text-sm font-medium text-slate-900">
              Searching medicine records...
            </div>
            <p className="text-xs text-slate-500">
              Retrieving product information and safety details.
            </p>
          </div>
        )}

        {/* State 2: API Error & Retry */}
        {!isLoading && error && (
          <ErrorState
            errorMessage={error}
            onRetry={() => executeSearch(activeQuery)}
            onClear={handleClear}
          />
        )}

        {/* State 3: Detail View */}
        {!isLoading && !error && selectedMedicine && (
          <MedicineDetail
            medicine={selectedMedicine}
            onBack={handleBackToResults}
            onSearchAnother={handleClear}
          />
        )}

        {/* State 4: Search Results List (when not currently in detail view) */}
        {!isLoading && !error && !selectedMedicine && hasSearched && results.length > 0 && (
          <SearchResults
            results={results}
            searchQuery={activeQuery}
            onSelectMedicine={handleSelectMedicine}
            onClearSearch={handleClear}
          />
        )}

        {/* State 5: No Results State */}
        {!isLoading && !error && !selectedMedicine && hasSearched && results.length === 0 && (
          <NoResults
            searchQuery={activeQuery}
            onClear={handleClear}
            onTryExample={handleSelectExample}
          />
        )}

        {/* State 6: Empty Search / Home initial guidance info */}
        {!isLoading && !error && !hasSearched && (
          <div className="space-y-4 pt-2">
            <div className="border border-slate-200 rounded-lg bg-white p-5 space-y-3 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-800" />
                <span>How to search medicine records</span>
              </div>
              <p className="leading-relaxed">
                Enter either the brand name (e.g., <span className="font-semibold text-slate-800">P-Alaxin</span>), the generic active drug (e.g., <span className="font-semibold text-slate-800">Paracetamol</span> or <span className="font-semibold text-slate-800">Amoxicillin</span>), or a reference registration identifier (e.g., <span className="font-mono text-slate-800 font-semibold">B4-8892</span>). You can also click <span className="font-semibold text-slate-800">Scan medicine</span> to detect text from packaging using your camera or photo upload.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-slate-700">
                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                  <div className="font-semibold text-slate-900 mb-1">
                    What this tool shows
                  </div>
                  <ul className="space-y-1 list-disc list-inside text-slate-600">
                    <li>Active ingredients and strength</li>
                    <li>Dosage form and route</li>
                    <li>Manufacturer on record</li>
                    <li>Safety warnings and precautions</li>
                  </ul>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                  <div className="font-semibold text-slate-900 mb-1">
                    Safety boundaries
                  </div>
                  <ul className="space-y-1 list-disc list-inside text-slate-600">
                    <li>Not a substitute for a doctor or pharmacist</li>
                    <li>Does not certify physical packaging authenticity</li>
                    <li>Absence does not imply counterfeit</li>
                    <li>Does not provide personalized medical advice</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer onOpenSafetyGuide={() => setIsSafetyModalOpen(true)} />

      {/* Safety & Educational Boundaries Modal */}
      <SafetyModal
        isOpen={isSafetyModalOpen}
        onClose={() => setIsSafetyModalOpen(false)}
      />

      {/* OCR Medicine Scanner Modal */}
      <MedicineScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onConfirmSearch={handleOcrConfirmedSearch}
      />
    </div>
  );
}
