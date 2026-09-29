import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Camera,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Activity,
  ArrowRight,
  ExternalLink,
  Clock,
  Check,
  Share2,
  Copy,
  Download,
  Smartphone,
  Info,
  ShieldAlert,
  FileWarning,
  CheckSquare
} from 'lucide-react';
import { motion } from 'motion/react';
import { Medicine } from '../types/medicine';
import { MOCK_MEDICINES } from '../data/mockMedicines';
import { MedicineShareCard } from './MedicineShareCard';
import { tapScale } from '../utils/motion';

interface LandingPageProps {
  onCheckMedicine: (prefill?: string) => void;
  onScanMedicine: () => void;
  onOpenSafetyModal: () => void;
  onViewSampleMedicine: (medicine: Medicine) => void;
  featuredMedicine?: Medicine | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onCheckMedicine,
  onScanMedicine,
  onOpenSafetyModal,
  onViewSampleMedicine,
  featuredMedicine,
}) => {
  const pAlaxinRealMed: Medicine = featuredMedicine || MOCK_MEDICINES[0];
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [heroSearchQuery, setHeroSearchQuery] = useState('');

  const examplePills = [
    { label: 'P-Alaxin', query: 'P-Alaxin', tag: 'Antimalarial' },
    { label: 'Paracetamol', query: 'Paracetamol', tag: 'Analgesic' },
    { label: 'Amoxicillin', query: 'Amoxicillin', tag: 'Antibiotic' },
    { label: 'B4-8892', query: 'B4-8892', tag: 'Registration No' },
  ];

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearchQuery.trim()) {
      onCheckMedicine(heroSearchQuery.trim());
    } else {
      onCheckMedicine();
    }
  };

  return (
    <div className="flex flex-col min-h-screen selection:bg-[#52b788]/20 selection:text-[#1b4332] text-[#16352a] overflow-x-hidden w-full">
      {/* =========================================================================
          1. HERO SECTION
          - Fluid typography using clamp()
          - Mobile: Stack buttons vertically at full width; wrap trust chips; reduced top/bottom padding
          - Tablet: Buttons side by side, centered
          - Max content capped at ~1200px centered
         ========================================================================= */}
      <section className="relative overflow-hidden pt-3 pb-8 sm:pt-6 sm:pb-12 lg:pt-10 lg:pb-16 px-4 sm:px-6 lg:px-8 w-full">
        {/* Subtle radial ambient glow */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[600px] h-[350px] bg-[#d8f0dc]/30 rounded-full blur-2xl pointer-events-none -z-10"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-[1200px] w-full">
          <div className="text-center max-w-3xl mx-auto z-10">
            {/* Confident Headline with clamp() */}
            <h1 className="text-[clamp(2.25rem,5vw+1rem,5rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-[#16352a] mb-3 sm:mb-4 max-w-full">
              Know what you're taking.
            </h1>

            {/* Supporting Paragraph with clamp() (1rem to 1.25rem)ow */}
            <p className="text-[clamp(1rem,2vw+0.5rem,1.25rem)] text-[#2d4f3b] leading-relaxed mb-5 sm:mb-6 max-w-2xl mx-auto font-medium">
              Search medicines, scan their packaging, and find clear information about their uses, ingredients, dosage, and safety.
            </p>

            {/* Hero Search Bar - Full width on mobile */}
            <form onSubmit={handleHeroSearchSubmit} className="max-w-xl mx-auto mb-4 w-full">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white border-2 border-[#cbd9cc] focus-within:border-[#1b4332] rounded-2xl sm:rounded-full p-1.5 sm:p-2 shadow-2xs transition-all w-full">
                <div className="flex items-center flex-1 px-3 py-1 min-w-0">
                  <Search className="w-5 h-5 text-[#355845] shrink-0 mr-2" />
                  <input
                    type="text"
                    value={heroSearchQuery}
                    onChange={(e) => setHeroSearchQuery(e.target.value)}
                    placeholder="Search a medicine name, e.g. Paracetamol or P-Alaxin"
                    aria-label="Search medicine name or NAFDAC code"
                    className="w-full bg-transparent text-[#16352a] placeholder:text-[#527460] font-medium text-sm sm:text-base focus:outline-none min-h-[44px]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={tapScale}
                    type="submit"
                    className="min-h-[46px] w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#1b4332] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#24563f] transition-colors cursor-pointer shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332]"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-4 h-4 text-[#9bdfb1]" />
                  </motion.button>
                </div>
              </div>
            </form>

            {/* Mobile: Stack buttons vertically at full width
                Tablet/Laptop: Buttons centered
            */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 w-full max-w-xl mx-auto">
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={tapScale}
                type="button"
                onClick={() => onCheckMedicine()}
                className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 rounded-full bg-[#1b4332] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#24563f] cursor-pointer shadow-2xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332]"
              >
                <Search className="w-4 h-4 text-[#9bdfb1]" />
                <span>Check a medicine</span>
              </motion.button>

              <motion.button
                whileHover={{ y: -1 }}
                whileTap={tapScale}
                type="button"
                onClick={onScanMedicine}
                className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2.5 rounded-full bg-white border border-[#cbd9cc] px-6 py-2.5 text-sm font-bold text-[#1b4332] hover:bg-[#eef6ed] cursor-pointer shadow-2xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332]"
              >
                <Camera className="w-4 h-4 text-[#2d6a4f]" />
                <span>Scan medicine packaging</span>
              </motion.button>
            </div>
          </div>
          <div className="max-w-4xl mx-auto relative w-full">
            {/* SAMPLE RESULT banner directly above card */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 mb-2 px-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#eef6ed] border border-[#cbd9cc] px-3 py-1 text-xs font-bold text-[#1b4332] shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#e1775b] shrink-0" />
                <span>SAMPLE RESULT — DEMONSTRATION RECORD</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#355845]">
                Illustrative Example
              </span>
            </div>

            {/* Card with subtle dashed border and light tint */}
            <div className="relative rounded-[22px] sm:rounded-[28px] border-2 border-dashed border-[#b8ceba] bg-[#fbfdfb] p-4 sm:p-6 lg:p-7 shadow-xs w-full">
              {/* Card Header:
                  Mobile: Flex-col with status badge moved below product name.
                  Tablet/Desktop: Flex-row with status badge on the right.
              */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-[#edf1eb]">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef6ed] px-2.5 py-0.5 text-[11px] font-bold text-[#1b4332]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#52b788]" />
                      Registration on File
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#355845] break-all">
                      NAFDAC: {pAlaxinRealMed.nafdacFormattedNumber || 'A4-100927'}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#16352a] break-words">
                    {pAlaxinRealMed.brandName || 'P-Alaxin'}
                  </h2>
                  <p className="text-xs sm:text-sm font-medium text-[#2d4f3b] break-words">
                    {pAlaxinRealMed.genericName || 'Dihydroartemisinin 40mg + Piperaquine Phosphate 320mg'}
                  </p>
                </div>

                {/* Status Badge: below title on mobile, right on tablet/desktop */}
                <div className="self-start sm:self-auto shrink-0 pt-1 sm:pt-0">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#eef6ed] text-[#1b4332] border border-[#cbd9cc] rounded-full text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2d6a4f] shrink-0" />
                    <span>Sample: registration record found</span>
                  </div>
                </div>
              </div>

              {/* Disclaimer under registration badge */}
              <div className="my-3 p-3 rounded-xl bg-[#f2f7f3] border border-[#d5e4d7] flex items-start gap-2.5 text-xs text-[#204030] leading-relaxed">
                <Info className="w-4 h-4 text-[#2d6a4f] shrink-0 mt-0.5" />
                <p className="break-words">
                  A registration record does not guarantee that the specific pack in your hand is genuine. Always buy from licensed pharmacies and check the pack for NAFDAC details.
                </p>
              </div>

              {/* Product preview cards:
                  Mobile: 1 column (stacked)
                  Tablet (640px-1023px): 2 columns, with 3rd card spanning full width
                  Laptop (1024px+): 3 columns
              */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                {/* 1. Uses */}
                <div className="rounded-2xl bg-white border border-[#edf1eb] p-3.5 sm:p-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1b4332]">
                    <Activity className="w-3.5 h-3.5 text-[#2d6a4f] shrink-0" />
                    <span>Used For</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#16352a] font-medium leading-relaxed break-words">
                    Treatment of uncomplicated malaria infections caused by Plasmodium falciparum.
                  </p>
                </div>

                {/* 2. Reference Dosage */}
                <div className="rounded-2xl bg-white border border-[#edf1eb] p-3.5 sm:p-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1b4332]">
                    <Clock className="w-3.5 h-3.5 text-[#2d6a4f] shrink-0" />
                    <span>Reference Dosage</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#16352a] font-medium leading-relaxed break-words">
                    Standard adult reference: 1 dose daily for 3 consecutive days, separated by 3 hours from meals.
                  </p>
                  <p className="text-xs text-[#16352a] font-bold pt-1 leading-snug break-words">
                    Always follow the dosing schedule on your pack insert or your doctor's instructions.
                  </p>
                </div>

                {/* 3. Safety Warning (Spans 2 cols on tablet for balanced layout, 1 col on desktop) */}
                <div className="rounded-2xl bg-white border border-[#edf1eb] p-3.5 sm:p-4 space-y-1.5 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#e1775b]">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Safety Warning</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#16352a] font-medium leading-relaxed break-words">
                    Consult a doctor or pharmacist before use if pregnant, especially in 1st trimester. Complete the full course.
                  </p>
                </div>
              </div>

              {/* Action row at bottom of hero preview */}
              <div className="mt-4 pt-3.5 border-t border-[#edf1eb] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#2d4f3b] font-medium">
                <div className="flex items-center gap-1.5 text-left">
                  <span>Illustrative reference sample · Not an authentication certificate</span>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileTap={tapScale}
                    type="button"
                    onClick={() => setIsShareModalOpen(true)}
                    className="min-h-[44px] font-bold text-[#1b4332] hover:underline inline-flex items-center gap-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332] rounded p-1"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#2d6a4f]" />
                    <span>Share sample card</span>
                  </motion.button>
                  <span className="text-[#cbd9cc]">·</span>
                  <button
                    type="button"
                    onClick={() => onCheckMedicine('P-Alaxin')}
                    className="min-h-[44px] font-bold text-[#1b4332] hover:text-[#24563f] underline underline-offset-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332] rounded p-1 flex items-center"
                  >
                    View monograph &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-y border-[#dce8dc] bg-white w-full">
        <div className="max-w-[1200px] mx-auto text-center space-y-6">
          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-[clamp(1.75rem,3.5vw+0.5rem,2.75rem)] font-semibold tracking-[-0.04em] text-[#16352a] leading-[1.15]">
              Medicine information shouldn't be difficult to understand.
            </h2>
            <p className="text-[clamp(1rem,1.5vw+0.5rem,1.2rem)] text-[#2d4f3b] max-w-2xl mx-auto leading-relaxed font-medium">
              DrugGuard brings available medicine registration records, packaging OCR, active ingredient data, and safety information into one simple place, so you can search, scan, and understand what you're looking at.
            </p>
          </div>

          {/* 3 Fact / Stat Tiles: 1 col on mobile, 2 on tablet, 3 on laptop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-3 text-left">
            {/* Tile 1 */}
            <div className="rounded-2xl border border-[#dce8dc] bg-[#fcfdfc] p-4 sm:p-5 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#fef2f2] text-[#e1775b] flex items-center justify-center">
                <FileWarning className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#16352a]">
                Counterfeit Medicine Risk
              </h3>
              <p className="text-xs sm:text-sm text-[#2d4f3b] leading-relaxed">
                Substandard and falsified medicines remain a critical challenge in West Africa. Clear packaging awareness and buying from registered pharmacies are essential first lines of defense.
              </p>
            </div>

            {/* Tile 2 */}
            <div className="rounded-2xl border border-[#dce8dc] bg-[#fcfdfc] p-4 sm:p-5 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#eef6ed] text-[#2d6a4f] flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#16352a]">
                Difficulty Reading Drug Labels
              </h3>
              <p className="text-xs sm:text-sm text-[#2d4f3b] leading-relaxed">
                Tiny font sizes, blister foil glare, and complex medical jargon make it hard to confirm active ingredients and safe dosing when in a rush.
              </p>
            </div>

            {/* Tile 3 (Spans 2 cols on tablet, 1 on laptop) */}
            <div className="rounded-2xl border border-[#dce8dc] bg-[#fcfdfc] p-4 sm:p-5 space-y-2 sm:col-span-2 lg:col-span-1">
              <div className="w-8 h-8 rounded-lg bg-[#eef6ed] text-[#2d6a4f] flex items-center justify-center">
                <CheckSquare className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#16352a]">
                Importance of Registration Codes
              </h3>
              <p className="text-xs sm:text-sm text-[#2d4f3b] leading-relaxed">
                NAFDAC registration numbers indicate that a product was reviewed and registered on record. Checking details helps consumers identify missing or questionable markings.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="how-it-works" className="py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <h2 className="text-[clamp(1.75rem,3.5vw+0.5rem,2.5rem)] font-semibold tracking-[-0.04em] text-[#16352a]">
            How DrugGuard Works
          </h2>
          <p className="text-[#2d4f3b] mt-2 text-sm sm:text-base leading-relaxed font-medium">
            Search, scan, and understand available information about your medicine.
          </p>
        </div>

        {/* 1 col on mobile, 2 on tablet, 3 on laptop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* STEP 01: SEARCH */}
          <div className="rounded-[24px] sm:rounded-[26px] border border-[#dce8dc] bg-white p-5 sm:p-7 shadow-2xs flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl sm:text-4xl font-bold font-mono tracking-tighter text-[#bfd9c3] block">
                  01
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#355845] bg-[#eef6ed] px-2.5 py-0.5 rounded-full">
                  Step 1
                </span>
              </div>
              <div className="h-11 w-11 rounded-xl bg-[#eef6ed] text-[#52b788] flex items-center justify-center mb-4">
                <Search className="w-5 h-5 text-[#2d6a4f]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#16352a]">
                SEARCH
              </h3>
              <p className="text-sm text-[#2d4f3b] leading-relaxed">
                Search for a medicine by brand name (e.g., P-Alaxin), active ingredient (e.g., Paracetamol), or reference registration number.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[#edf1eb]">
              <button
                type="button"
                onClick={() => onCheckMedicine()}
                className="min-h-[44px] text-xs font-bold text-[#1b4332] flex items-center gap-1 group-hover:gap-1.5 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332] rounded p-1"
              >
                Search medicines <ArrowRight className="w-3.5 h-3.5 text-[#2d6a4f]" />
              </button>
            </div>
          </div>

          {/* STEP 02: SCAN */}
          <div className="rounded-[24px] sm:rounded-[26px] border border-[#dce8dc] bg-white p-5 sm:p-7 shadow-2xs flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl sm:text-4xl font-bold font-mono tracking-tighter text-[#bfd9c3] block">
                  02
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#355845] bg-[#eef6ed] px-2.5 py-0.5 rounded-full">
                  Step 2
                </span>
              </div>
              <div className="h-11 w-11 rounded-xl bg-[#eef6ed] text-[#52b788] flex items-center justify-center mb-4">
                <Camera className="w-5 h-5 text-[#2d6a4f]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#16352a]">
                SCAN
              </h3>
              <p className="text-sm text-[#2d4f3b] leading-relaxed">
                Scan or upload a photo of the packaging. Our private on-device OCR reads the printed text right on your phone or computer.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[#edf1eb]">
              <button
                type="button"
                onClick={onScanMedicine}
                className="min-h-[44px] text-xs font-bold text-[#1b4332] flex items-center gap-1 group-hover:gap-1.5 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332] rounded p-1"
              >
                Scan packaging <ArrowRight className="w-3.5 h-3.5 text-[#2d6a4f]" />
              </button>
            </div>
          </div>

          {/* STEP 03: UNDERSTAND (Spans 2 cols on tablet, 1 col on laptop) */}
          <div className="rounded-[24px] sm:rounded-[26px] border border-[#dce8dc] bg-[#1b4332] text-white p-5 sm:p-7 shadow-xs flex flex-col justify-between group relative overflow-hidden sm:col-span-2 lg:col-span-1">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl sm:text-4xl font-bold font-mono tracking-tighter text-[#52b788] block">
                  03
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#9bdfb1] bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20">
                  Key Result
                </span>
              </div>
              <div className="h-11 w-11 rounded-xl bg-white/10 text-[#9bdfb1] flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 text-[#9bdfb1]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">
                UNDERSTAND
              </h3>
              <p className="text-sm text-[#d0e5d6] leading-relaxed">
                Review available information about uses, strength, reference dosage notes, and safety warnings—and share or save summary cards.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[#2a6046]">
              <button
                type="button"
                onClick={() => onCheckMedicine('P-Alaxin')}
                className="min-h-[44px] text-xs font-bold text-[#9bdfb1] flex items-center gap-1 group-hover:gap-1.5 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded p-1"
              >
                Review sample details <ArrowRight className="w-3.5 h-3.5 text-[#9bdfb1]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. INTERACTIVE MEDICINE SEARCH EXPERIENCE SECTION
         ========================================================================= */}
      <section id="features" className="py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-y border-[#dce8dc] bg-white w-full">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <h2 className="text-[clamp(1.5rem,3vw+0.5rem,2.25rem)] font-semibold tracking-[-0.04em] text-[#16352a]">
              Looking for a medicine?
            </h2>
            <p className="text-[#2d4f3b] mt-1.5 text-sm sm:text-base font-medium">
              Search a medicine name or click an example below.
            </p>
          </div>

          {/* Interactive Search Container */}
          <div className="max-w-xl mx-auto bg-[#fcfdfc] border border-[#dce8dc] rounded-[22px] sm:rounded-[26px] p-4 sm:p-6 shadow-2xs space-y-4 w-full">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white border border-[#cbd9cc] rounded-2xl sm:rounded-full p-1.5 sm:px-4 sm:py-2 shadow-2xs focus-within:border-[#1b4332]">
              <div className="flex items-center flex-1 px-2">
                <Search className="w-4.5 h-4.5 text-[#355845] shrink-0 mr-2" />
                <input
                  type="text"
                  readOnly
                  value="Paracetamol"
                  onClick={() => onCheckMedicine('Paracetamol')}
                  className="w-full bg-transparent text-[#16352a] font-medium text-sm focus:outline-none cursor-pointer min-h-[44px]"
                  placeholder="Type medicine name or NAFDAC number..."
                />
              </div>
              <motion.button
                whileTap={tapScale}
                type="button"
                onClick={() => onCheckMedicine('Paracetamol')}
                className="min-h-[44px] rounded-full bg-[#1b4332] px-5 py-2 text-xs font-bold text-white hover:bg-[#24563f] transition-colors cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332]"
              >
                Search
              </motion.button>
            </div>

            {/* Quick Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-0.5">
              <span className="text-xs font-bold text-[#355845] mr-1">Popular:</span>
              {examplePills.map((p) => (
                <motion.button
                  key={p.query}
                  whileHover={{ y: -1 }}
                  whileTap={tapScale}
                  type="button"
                  onClick={() => onCheckMedicine(p.query)}
                  className="rounded-full bg-[#f4f8f3] hover:bg-[#e7f0e8] border border-[#cbd9cc] px-3.5 py-1.5 text-xs font-bold text-[#1b4332] transition-all cursor-pointer min-h-[44px] flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332]"
                >
                  {p.label}
                </motion.button>
              ))}
            </div>

            {/* Result Preview Card */}
            <div className="rounded-2xl bg-white border border-[#edf1eb] p-4 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-[#16352a]">Emzor Paracetamol 500mg</h4>
                  <p className="text-xs text-[#2d4f3b] font-medium">Analgesic · Oral Tablet</p>
                </div>
                <span className="self-start sm:self-auto inline-flex items-center gap-1 text-[11px] font-bold text-[#1b4332] bg-[#eef6ed] px-2.5 py-0.5 rounded-full border border-[#cbd9cc]">
                  <CheckCircle2 className="w-3 h-3 text-[#2d6a4f]" />
                  Registered
                </span>
              </div>
              <p className="text-xs text-[#2d4f3b] leading-relaxed">
                Active Ingredient: Paracetamol 500mg. Indicated for relief of mild to moderate pain and fever.
              </p>
              <div className="pt-1 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-[#355845] text-[11px]">REF: EMZOR-PARA-500</span>
                <button
                  type="button"
                  onClick={() => onCheckMedicine('Paracetamol')}
                  className="min-h-[44px] font-bold text-[#1b4332] hover:text-[#24563f] flex items-center gap-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332] rounded p-1"
                >
                  View Details &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. SCANNER SECTION
          - Responsive: 1 column on mobile/tablet, 2 columns on laptop
         ========================================================================= */}
      <section id="scanner" className="py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column: Message */}
          <div className="space-y-4 text-left">
            <h2 className="text-[clamp(1.75rem,3.5vw+0.5rem,2.75rem)] font-semibold tracking-[-0.04em] text-[#16352a] leading-[1.1]">
              Don't know the name? <br />
              <span className="text-[#1b4332] underline decoration-[#9bdfb1] decoration-3 underline-offset-6">
                Scan the package.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-[#2d4f3b] leading-relaxed font-medium">
              When packaging text is small or difficult to read, DrugGuard's scanner uses optical character recognition (OCR) to read information from packaging and help you find the right record.
            </p>

            <div className="space-y-2.5 pt-1 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <span className="h-5 w-5 rounded-full bg-[#eef6ed] text-[#1b4332] flex items-center justify-center shrink-0 mt-0.5 font-bold text-[11px]">
                  ✓
                </span>
                <p className="text-[#2d4f3b]">
                  <strong className="text-[#16352a]">Blisters & Boxes:</strong> Works with live camera feed or uploaded packaging photos.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="h-5 w-5 rounded-full bg-[#eef6ed] text-[#1b4332] flex items-center justify-center shrink-0 mt-0.5 font-bold text-[11px]">
                  ✓
                </span>
                <p className="text-[#2d4f3b]">
                  <strong className="text-[#16352a]">Client-Side & Private:</strong> Images are processed locally in your browser using Tesseract.js and are never uploaded.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="h-5 w-5 rounded-full bg-[#fef2f2] text-[#e1775b] flex items-center justify-center shrink-0 mt-0.5 font-bold text-[11px]">
                  !
                </span>
                <p className="text-[#2d4f3b]">
                  <strong className="text-[#16352a]">Text input tool:</strong> Does not physically authenticate the medicine.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={tapScale}
                type="button"
                onClick={onScanMedicine}
                className="min-h-[46px] w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#1b4332] px-7 py-3 text-sm font-bold text-white shadow-2xs hover:bg-[#24563f] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332]"
              >
                <Camera className="w-4 h-4 text-[#9bdfb1]" />
                <span>Try the scanner</span>
                <ArrowRight className="w-4 h-4 text-[#9bdfb1]" />
              </motion.button>
            </div>
          </div>

          {/* Right Column: Visual Mockup */}
          <div className="relative w-full max-w-full">
            <div className="rounded-[24px] sm:rounded-[28px] bg-[#16352a] p-4 sm:p-6 text-white shadow-xs relative overflow-hidden w-full">
              <div className="rounded-2xl border-2 border-dashed border-[#52b788]/60 bg-[#0d221b] p-4 sm:p-5 relative min-h-[240px] sm:min-h-[280px] flex flex-col justify-between">
                <div className="flex items-center justify-between text-[11px] text-[#9bdfb1]">
                  <span className="flex items-center gap-1.5 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e1775b] animate-ping" />
                    CAMERA READY
                  </span>
                  <span className="font-mono text-[10px]">LOCAL OCR</span>
                </div>

                <div className="my-auto py-4 text-center">
                  <div className="inline-block bg-white/10 border border-white/20 rounded-xl px-3 sm:px-4 py-2 text-left max-w-full">
                    <span className="text-[10px] uppercase font-mono text-[#9bdfb1] block">
                      Text Detected
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-white font-mono break-all">
                      "P-ALAXIN TAB · NAFDAC A4-100927"
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-white/10 border border-white/15 p-2.5 flex items-center justify-between text-xs">
                  <span className="text-white font-medium text-[11px] sm:text-xs">Detected text ready</span>
                  <button
                    type="button"
                    onClick={onScanMedicine}
                    className="min-h-[44px] font-bold text-[#9bdfb1] hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded p-1 flex items-center"
                  >
                    Open Scanner &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-y border-[#dce8dc] bg-[#fcfdfc] w-full">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column: Copy */}
            <div className="space-y-4 text-left">
              <h2 className="text-[clamp(1.75rem,3.5vw+0.5rem,2.5rem)] font-semibold tracking-[-0.04em] text-[#16352a] leading-[1.12]">
                Found useful information? <br />
                <span className="text-[#1b4332]">Take it with you.</span>
              </h2>

              <p className="text-sm sm:text-base text-[#2d4f3b] leading-relaxed font-medium">
                Turn a medicine result into a simple card you can save or share.
              </p>

              <div className="space-y-2 pt-1 text-xs sm:text-sm text-[#1b4332] font-semibold">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#2d6a4f] shrink-0" />
                  <span>Mobile-friendly card for WhatsApp & messaging</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#2d6a4f] shrink-0" />
                  <span>High-resolution PNG download with zero remote dependencies</span>
                </div>
                <div className="flex items-center gap-2">
                  <Copy className="w-4 h-4 text-[#2d6a4f] shrink-0" />
                  <span>One-click plain text copy with reference disclaimer</span>
                </div>
              </div>

              <div className="pt-2">
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={tapScale}
                  type="button"
                  onClick={() => setIsShareModalOpen(true)}
                  className="min-h-[46px] w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#1b4332] px-6 py-2.5 text-sm font-bold text-white shadow-2xs hover:bg-[#24563f] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332]"
                >
                  <Share2 className="w-4 h-4 text-[#9bdfb1]" />
                  <span>Preview shareable card</span>
                </motion.button>
              </div>
            </div>

            {/* Right Column: Clean Preview Card */}
            <div className="flex justify-center w-full">
              <div className="w-full max-w-[340px] bg-white rounded-2xl border border-[#dce8dc] p-4.5 shadow-2xs space-y-3 text-slate-900 select-none text-xs">
                <div className="flex items-center justify-between border-b border-[#edf1eb] pb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded bg-[#1b4332] flex items-center justify-center text-white shrink-0">
                      <ShieldCheck className="w-3 h-3 text-emerald-200" />
                    </div>
                    <span className="font-bold text-[#16352a]">DRUGGUARD</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                    Reference
                  </span>
                </div>

                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    P-Alaxin
                  </h3>
                  <div className="text-[11px] font-bold text-emerald-950">
                    Antimalarial
                  </div>
                </div>

                <div className="text-xs text-slate-800">
                  <span className="font-bold text-slate-900">Active: </span>
                  <span>Dihydroartemisinin 40mg, Piperaquine 320mg</span>
                </div>

                <div className="border-t border-[#edf1eb] pt-2 text-xs">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1b4332] bg-[#eef6ed] px-2.5 py-0.5 rounded-full border border-[#cbd9cc]">
                    <CheckCircle2 className="w-3 h-3 text-[#2d6a4f]" />
                    <span>✓ Sample: registration record found</span>
                  </div>
                </div>

                <div className="border-t border-[#edf1eb] pt-2 text-[11px] leading-relaxed text-slate-600 font-medium">
                  Reference information only. DrugGuard does not certify physical package authenticity.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. INFORMATION SECTION (Uses, Dosage, Safety)
          - Responsive: 1 col on mobile, 2 on tablet, 3 on laptop
         ========================================================================= */}
      <section className="py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#dce8dc] bg-white w-full">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-[clamp(1.5rem,3vw+0.5rem,2.25rem)] font-semibold tracking-[-0.04em] text-[#16352a]">
              Clear Product Information
            </h2>
            <p className="text-[#2d4f3b] mt-1.5 text-sm sm:text-base font-medium">
              DrugGuard organizes available details into simple, readable sections.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {/* USES */}
            <div className="rounded-2xl border border-[#dce8dc] bg-[#fcfdfc] p-5 sm:p-6 space-y-2.5 hover:shadow-2xs transition-all">
              <div className="h-10 w-10 rounded-xl bg-[#eef6ed] text-[#2d6a4f] flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#2d6a4f]" />
              </div>
              <h3 className="text-lg font-bold text-[#16352a]">
                USES
              </h3>
              <p className="text-xs font-bold text-[#1b4332]">
                "What is this medicine commonly used for?"
              </p>
              <p className="text-xs sm:text-sm text-[#2d4f3b] leading-relaxed">
                Clear indications from reference records describing what the medicine is approved to treat.
              </p>
            </div>

            {/* DOSAGE */}
            <div className="rounded-2xl border border-[#dce8dc] bg-[#fcfdfc] p-5 sm:p-6 space-y-2.5 hover:shadow-2xs transition-all">
              <div className="h-10 w-10 rounded-xl bg-[#eef6ed] text-[#2d6a4f] flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#2d6a4f]" />
              </div>
              <h3 className="text-lg font-bold text-[#16352a]">
                DOSAGE
              </h3>
              <p className="text-xs font-bold text-[#1b4332]">
                "Available reference dosage information."
              </p>
              <p className="text-xs sm:text-sm text-[#2d4f3b] leading-relaxed">
                Standard reference information from product literature. Always follow professional advice.
              </p>
            </div>

            {/* SAFETY (Spans 2 cols on tablet, 1 on laptop) */}
            <div className="rounded-2xl border border-[#dce8dc] bg-[#fcfdfc] p-5 sm:p-6 space-y-2.5 hover:shadow-2xs transition-all sm:col-span-2 lg:col-span-1">
              <div className="h-10 w-10 rounded-xl bg-[#fef2f2] text-[#e1775b] flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-[#e1775b]" />
              </div>
              <h3 className="text-lg font-bold text-[#16352a]">
                SAFETY
              </h3>
              <p className="text-xs font-bold text-[#e1775b]">
                "Important warnings and safety information."
              </p>
              <p className="text-xs sm:text-sm text-[#2d4f3b] leading-relaxed">
                Key warnings, contraindications, and precautions recorded on file to help keep you informed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. NIGERIAN CONTEXT SECTION
         ========================================================================= */}
      <section className="py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto w-full">
        <div className="rounded-[24px] sm:rounded-[32px] bg-[#eef6ed] border border-[#dce8dc] p-5 sm:p-8 lg:p-10 relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-3 sm:space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1b4332]">
              Designed For Nigeria
            </span>
            <h2 className="text-[clamp(1.5rem,3vw+0.5rem,2.25rem)] font-semibold tracking-[-0.04em] text-[#16352a] leading-[1.15]">
              Medicine information, made easier to access.
            </h2>
            <p className="text-sm sm:text-base text-[#204030] leading-relaxed font-medium">
              DrugGuard is designed to make useful medicine information easier to find and understand for people in Nigeria. Explore available registration information alongside medicine details such as active ingredients, dosage forms, and manufacturer records.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. SAFETY / TRUST / BOUNDARIES
         ========================================================================= */}
      <section className="py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-y border-[#dce8dc] bg-white w-full">
        <div className="max-w-[1040px] mx-auto text-center space-y-4 sm:space-y-5">
          <h2 className="text-[clamp(1.5rem,3vw+0.5rem,2.25rem)] font-semibold tracking-[-0.04em] text-[#16352a]">
            Know the information. Know the limits.
          </h2>
          <div className="max-w-xl mx-auto p-3 sm:p-4 rounded-xl bg-[#f8faf8] border border-[#dce8dc] text-xs sm:text-sm text-[#1b4332] font-bold">
            "Reference information, not personalized medical advice."
          </div>
          <p className="text-xs sm:text-sm text-[#2d4f3b] max-w-xl mx-auto leading-relaxed font-medium">
            DrugGuard provides reference information and is not a replacement for professional medical advice from a doctor or pharmacist. Looking up a medicine record does not certify physical packaging authenticity.
          </p>
          <div>
            <button
              type="button"
              onClick={onOpenSafetyModal}
              className="min-h-[44px] inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1b4332] hover:text-[#24563f] underline underline-offset-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332] rounded p-1"
            >
              <span>Read safety boundaries guide</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          10. FINAL MEMORABLE CTA SECTION
         ========================================================================= */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto w-full">
        <div className="rounded-[24px] sm:rounded-[32px] bg-[#1b4332] text-white p-6 sm:p-10 lg:p-12 text-center relative overflow-hidden shadow-xs">
          <div className="max-w-2xl mx-auto relative z-10 space-y-4">
            <h2 className="text-[clamp(1.75rem,3.5vw+0.5rem,2.75rem)] font-semibold tracking-[-0.04em] leading-[1.1]">
              Have a medicine in front of you?
            </h2>
            <p className="text-[clamp(1rem,2vw+0.25rem,1.25rem)] text-[#9bdfb1] font-medium">
              Search it. Scan it. Understand it.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto">
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={tapScale}
                type="button"
                onClick={() => onCheckMedicine()}
                className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 rounded-full bg-white text-[#1b4332] px-7 py-3 text-sm font-bold shadow-xs hover:bg-[#f6f8f4] cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Search className="w-4 h-4 text-[#1b4332]" />
                <span>Check a medicine</span>
              </motion.button>

              <motion.button
                whileHover={{ y: -1 }}
                whileTap={tapScale}
                type="button"
                onClick={onScanMedicine}
                className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white px-7 py-3 text-sm font-bold cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Camera className="w-4 h-4 text-[#9bdfb1]" />
                <span>Scan a medicine</span>
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          11. MINIMAL BRAND FOOTER
         ========================================================================= */}
      <footer className="border-t border-[#dce8dc] bg-[#fcfdfc] py-6 sm:py-8 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#2d4f3b] font-medium">
          <div className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#1b4332] text-white shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-[#9bdfb1]" />
            </span>
            <div>
              <span className="font-bold text-[#16352a] text-xs block">DrugGuard</span>
              <span className="text-[10px] text-[#355845]">Medicine information, made easier.</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <button
              type="button"
              onClick={() => onCheckMedicine()}
              className="min-h-[44px] hover:text-[#1b4332] transition-colors cursor-pointer flex items-center font-bold"
            >
              Product
            </button>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="min-h-[44px] hover:text-[#1b4332] transition-colors cursor-pointer flex items-center font-bold"
            >
              How it works
            </button>
            <button
              type="button"
              onClick={onOpenSafetyModal}
              className="min-h-[44px] hover:text-[#1b4332] transition-colors cursor-pointer flex items-center font-bold"
            >
              Safety
            </button>
            <a
              href="https://www.nafdac.gov.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] hover:text-[#1b4332] inline-flex items-center gap-1 font-bold"
              title="Official external regulatory portal"
            >
              <span>NAFDAC Official</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="text-center md:text-right text-[11px] text-[#355845]">
            Reference information, not personalized medical advice.
          </div>
        </div>
      </footer>

      {/* Share Card Modal from Landing Page */}
      <MedicineShareCard
        medicine={pAlaxinRealMed}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};
