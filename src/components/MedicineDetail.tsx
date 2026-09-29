import React, { useState } from 'react';
import { Medicine } from '../types/medicine';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Info,
  Activity,
  Clock,
  AlertCircle,
  Share2
} from 'lucide-react';
import { motion } from 'motion/react';
import { MedicineShareCard } from './MedicineShareCard';
import { tapScale } from '../utils/motion';

interface MedicineDetailProps {
  medicine: Medicine;
  onBack: () => void;
  onSearchAnother: () => void;
}

export const MedicineDetail: React.FC<MedicineDetailProps> = ({
  medicine,
  onBack,
  onSearchAnother,
}) => {
  const [isShareOpen, setIsShareOpen] = useState(false);

  const isRegistered = medicine.registrationStatus === 'REGISTERED';

  const hasDosageInfo = Boolean(
    medicine.dosageReference?.general || medicine.dosageReference?.administrationNotes
  );

  const hasSafetyInfo = Boolean(
    (medicine.safetyInformation?.warnings && medicine.safetyInformation.warnings.length > 0) ||
    (medicine.safetyInformation?.contraindications && medicine.safetyInformation.contraindications.length > 0) ||
    (medicine.safetyInformation?.adverseEffects && medicine.safetyInformation.adverseEffects.length > 0) ||
    medicine.safetyInformation?.pregnancyLactation
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: [0.165, 0.84, 0.44, 1] }}
      className="space-y-4"
    >
      {/* Top breadcrumb action bar */}
      <div className="flex items-center justify-between">
        <motion.button
          whileTap={tapScale}
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1b4332] hover:underline min-h-[44px] px-2 -ml-2 rounded-full cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to results</span>
        </motion.button>

        <div className="flex items-center gap-2">
          <motion.button
            whileTap={tapScale}
            type="button"
            onClick={() => setIsShareOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1b4332] bg-white border border-[#cbd9cc] hover:bg-[#eef6ed] px-3.5 py-1.5 rounded-full min-h-[40px] transition-colors cursor-pointer shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332]"
            aria-label="Share medicine card"
          >
            <Share2 className="w-3.5 h-3.5 text-[#2d6a4f]" />
            <span>Share card</span>
          </motion.button>

          <button
            onClick={onSearchAnother}
            className="text-xs font-bold text-[#355845] hover:text-[#16352a] underline underline-offset-2 min-h-[40px] flex items-center px-1.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332] rounded"
          >
            New search
          </button>
        </div>
      </div>

      {/* Main Product Card */}
      <div className="bg-white border border-[#cbd9cc] rounded-[24px] p-5 sm:p-6 shadow-2xs space-y-4">
        {/* Status banner */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-[#edf1eb]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#355845]">
                Medicine Record
              </span>
              {medicine.nafdacFormattedNumber && (
                <>
                  <span className="text-[#cbd9cc]">·</span>
                  <span className="text-[11px] font-mono font-bold text-[#1b4332] bg-[#eef6ed] px-2 py-0.5 rounded-full">
                    NAFDAC: {medicine.nafdacFormattedNumber}
                  </span>
                </>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#16352a] tracking-tight">
              {medicine.name}
            </h1>
            {medicine.category && (
              <div className="text-xs font-semibold text-[#2d4f3b]">
                {medicine.category}
              </div>
            )}
          </div>

          {/* Registration Status Pill */}
          <div className="shrink-0">
            {isRegistered ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#eef6ed] text-[#1b4332] border border-[#cbd9cc] rounded-full text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2d6a4f]" />
                <span>Registered product found</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-full text-xs font-bold">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                <span>Status: {medicine.registrationStatus}</span>
              </div>
            )}
          </div>
        </div>

        {/* Essential Properties Grid (High contrast WCAG AA) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          {medicine.activeIngredients && (
            <div className="col-span-2 sm:col-span-4 bg-[#fcfdfc] border border-[#edf1eb] p-3 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-[#355845] block mb-0.5">
                Active Ingredient
              </span>
              <span className="font-bold text-[#16352a] text-sm">
                {medicine.activeIngredients}
              </span>
            </div>
          )}

          {medicine.dosageForm && (
            <div className="bg-[#fcfdfc] border border-[#edf1eb] p-3 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-[#355845] block mb-0.5">
                Form
              </span>
              <span className="font-semibold text-[#16352a]">
                {medicine.dosageForm}
              </span>
            </div>
          )}

          {medicine.strength && (
            <div className="bg-[#fcfdfc] border border-[#edf1eb] p-3 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-[#355845] block mb-0.5">
                Strength
              </span>
              <span className="font-mono font-bold text-[#16352a]">
                {medicine.strength}
              </span>
            </div>
          )}

          {medicine.route && (
            <div className="bg-[#fcfdfc] border border-[#edf1eb] p-3 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-[#355845] block mb-0.5">
                Route
              </span>
              <span className="font-semibold text-[#16352a]">
                {medicine.route}
              </span>
            </div>
          )}

          {medicine.manufacturer && (
            <div className="bg-[#fcfdfc] border border-[#edf1eb] p-3 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-[#355845] block mb-0.5">
                Manufacturer
              </span>
              <span className="font-semibold text-[#16352a] truncate block" title={medicine.manufacturer}>
                {medicine.manufacturer}
              </span>
            </div>
          )}
        </div>

        {/* Reference Boundary Note */}
        <div className="text-xs text-[#2d4f3b] font-medium border-t border-[#edf1eb] pt-3 flex items-start gap-1.5 leading-relaxed">
          <Info className="w-4 h-4 text-[#2d6a4f] shrink-0 mt-0.5" />
          <span>
            A registration record does not guarantee that the specific pack in your hand is genuine. Always buy from licensed pharmacies and check the pack for NAFDAC details.
          </span>
        </div>
      </div>

      {/* Uses Section */}
      {medicine.uses && medicine.uses.length > 0 && (
        <section className="bg-white border border-[#cbd9cc] rounded-[24px] p-5 sm:p-6 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#2d6a4f]" />
            <h2 className="text-sm font-bold text-[#16352a] uppercase tracking-wider">
              What is it used for?
            </h2>
          </div>
          <ul className="space-y-1.5 text-sm text-[#16352a] font-medium leading-relaxed">
            {medicine.uses.map((use, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-[#2d6a4f] font-bold mt-0.5">·</span>
                <span>{use}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Dosage Reference Section (Requirement 4 applied: dark text + bold instruction line) */}
      {hasDosageInfo && (
        <section className="bg-white border border-[#cbd9cc] rounded-[24px] p-5 sm:p-6 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#2d6a4f]" />
            <h2 className="text-sm font-bold text-[#16352a] uppercase tracking-wider">
              Reference Dosage Information
            </h2>
          </div>
          <div className="text-sm text-[#16352a] font-medium space-y-2 leading-relaxed">
            {medicine.dosageReference?.general && (
              <p>{medicine.dosageReference.general}</p>
            )}
            {medicine.dosageReference?.administrationNotes && (
              <p className="text-xs text-[#2d4f3b] italic">
                Note: {medicine.dosageReference.administrationNotes}
              </p>
            )}
            <p className="text-xs text-[#16352a] font-bold pt-1">
              Always follow the dosing schedule on your pack insert or your doctor's instructions.
            </p>
          </div>
        </section>
      )}

      {/* Safety & Precautions Section */}
      {hasSafetyInfo && (
        <section className="bg-white border border-[#cbd9cc] rounded-[24px] p-5 sm:p-6 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-[#e1775b]">
            <AlertTriangle className="w-4 h-4" />
            <h2 className="text-sm font-bold text-[#16352a] uppercase tracking-wider">
              Safety Information & Precautions
            </h2>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            {/* Warnings */}
            {medicine.safetyInformation?.warnings && medicine.safetyInformation.warnings.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#e1775b]">
                  Warnings
                </span>
                <ul className="space-y-1 text-[#2d4f3b] font-medium">
                  {medicine.safetyInformation.warnings.map((w, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#e1775b] font-bold">·</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pregnancy & Lactation */}
            {medicine.safetyInformation?.pregnancyLactation && (
              <div className="pt-2 border-t border-[#edf1eb]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#16352a] block mb-1">
                  Pregnancy & Lactation
                </span>
                <p className="text-xs sm:text-sm text-[#2d4f3b] font-medium leading-relaxed">
                  {medicine.safetyInformation.pregnancyLactation}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Share Modal Dialog */}
      <MedicineShareCard
        medicine={medicine}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </motion.div>
  );
};
