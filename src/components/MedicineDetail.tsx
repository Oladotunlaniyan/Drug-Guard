import React from 'react';
import { Medicine } from '../types/medicine';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
  Activity,
  HeartPulse,
  AlertCircle,
  Database
} from 'lucide-react';

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
  const isRegistered = medicine.registrationStatus === 'REGISTERED';

  const provenanceLabel = {
    demo: 'Demo Reference Record',
    nafdac: 'NAFDAC Official Registry Record',
    medical_reference: 'Standard Medical Reference',
  }[medicine.sourceType] || 'Reference Record';

  return (
    <div className="space-y-6">
      {/* Back button & top navigation breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 min-h-[44px] px-2 -ml-2 rounded cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to results</span>
        </button>

        <button
          onClick={onSearchAnother}
          className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-2 min-h-[44px] flex items-center px-2 cursor-pointer"
        >
          Search another medicine
        </button>
      </div>

      {/* Main product header card */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
        {/* Status banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Product Record
              </span>
              <span className="text-slate-300">·</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                <Database className="w-3 h-3 text-slate-400" />
                <span>{provenanceLabel}</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {medicine.name}
            </h1>
            <div className="text-xs text-slate-500 mt-0.5">
              {medicine.genericName}
            </div>
          </div>

          {/* Registration Status Indicator - required exact label: "Registered product found" */}
          <div className="flex items-center gap-2 shrink-0">
            {isRegistered ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Registered product found</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-xs font-semibold">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>Status: {medicine.registrationStatus}</span>
              </div>
            )}
          </div>
        </div>

        {/* Public safety authority boundary note */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p>
            <strong>Reference notice:</strong> This entry reflects product information on file. DrugGuard does not inspect physical packaging in hand, verify supply-chain authenticity, or certify physical batches as genuine.
          </p>
        </div>

        {/* Product Information Table / Grid */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
            Product Information
          </h2>
          <div className="border border-slate-200 rounded-md divide-y divide-slate-100 bg-white overflow-hidden text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 p-3 bg-slate-50/50">
              <span className="text-xs font-medium text-slate-500">Active Ingredients</span>
              <span className="sm:col-span-2 font-medium text-slate-900 mt-0.5 sm:mt-0">
                {medicine.activeIngredients}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 p-3">
              <span className="text-xs font-medium text-slate-500">Strength</span>
              <span className="sm:col-span-2 text-slate-800 font-mono text-xs tabular-nums mt-0.5 sm:mt-0">
                {medicine.strength}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 p-3 bg-slate-50/50">
              <span className="text-xs font-medium text-slate-500">Dosage Form</span>
              <span className="sm:col-span-2 text-slate-800 mt-0.5 sm:mt-0">
                {medicine.dosageForm}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 p-3">
              <span className="text-xs font-medium text-slate-500">Route</span>
              <span className="sm:col-span-2 text-slate-800 mt-0.5 sm:mt-0">
                {medicine.route}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 p-3 bg-slate-50/50">
              <span className="text-xs font-medium text-slate-500">Manufacturer</span>
              <span className="sm:col-span-2 text-slate-800 mt-0.5 sm:mt-0">
                {medicine.manufacturer}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 p-3">
              <span className="text-xs font-medium text-slate-500">NAFDAC Number</span>
              <span className="sm:col-span-2 font-mono font-semibold text-slate-900 text-xs tabular-nums mt-0.5 sm:mt-0">
                {medicine.nafdacFormattedNumber}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 p-3 bg-slate-50/50">
              <span className="text-xs font-medium text-slate-500">Registration Date</span>
              <span className="sm:col-span-2 text-slate-800 text-xs font-mono tabular-nums mt-0.5 sm:mt-0">
                {medicine.registrationDate}
                {medicine.expiryDate && (
                  <span className="text-slate-500 ml-2">
                    (Valid to: {medicine.expiryDate})
                  </span>
                )}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 p-3">
              <span className="text-xs font-medium text-slate-500">Status</span>
              <span className="sm:col-span-2 text-xs font-medium text-emerald-800 mt-0.5 sm:mt-0">
                {medicine.registrationStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 p-3 bg-slate-50/50">
              <span className="text-xs font-medium text-slate-500">Data Provenance</span>
              <span className="sm:col-span-2 text-xs text-slate-700 mt-0.5 sm:mt-0">
                <span className="font-mono">{medicine.sourceType}</span> — {provenanceLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* What is it used for? */}
      <section className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-800" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              What is it used for?
            </h2>
          </div>
          {medicine.source.name && (
            <span className="text-[11px] text-slate-500">
              Source: {medicine.source.name}
            </span>
          )}
        </div>

        <ul className="space-y-2 pt-1">
          {medicine.uses.map((use, index) => (
            <li key={index} className="flex items-start gap-2.5 text-sm text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 mt-2 shrink-0" />
              <span>{use}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Dosage Information */}
      <section className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-slate-700" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Dosage information
            </h2>
          </div>
          {medicine.source.name && (
            <span className="text-[11px] text-slate-500">
              Source: {medicine.source.name}
            </span>
          )}
        </div>

        {/* Required disclaimer line */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded p-3 text-xs text-amber-900 font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>This is reference information, not personalized medical advice.</span>
        </div>

        <div className="text-sm text-slate-700 space-y-2 pt-1">
          <div>
            <strong className="text-slate-900">Reference: </strong>
            {medicine.dosageReference.general}
          </div>
          {medicine.dosageReference.administrationNotes && (
            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded border border-slate-200/70">
              <strong className="text-slate-800">Administration reference: </strong>
              {medicine.dosageReference.administrationNotes}
            </div>
          )}
        </div>
      </section>

      {/* Safety Information */}
      <section className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-700" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Safety information
            </h2>
          </div>
          {medicine.source.name && (
            <span className="text-[11px] text-slate-500">
              Source: {medicine.source.name}
            </span>
          )}
        </div>

        <div className="space-y-4 pt-1 text-sm">
          {/* Warnings */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900">
              Warnings & Precautions
            </h3>
            <ul className="space-y-1.5">
              {medicine.safetyInformation.warnings.map((warn, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                  <span className="text-rose-600 font-bold shrink-0">!</span>
                  <span>{warn}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contraindications */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Contraindications
            </h3>
            <ul className="space-y-1.5">
              {medicine.safetyInformation.contraindications.map((contra, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                  <span>{contra}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Adverse Effects */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Reported Adverse Effects
            </h3>
            <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-slate-600">
              {medicine.safetyInformation.adverseEffects.map((effect, i) => (
                <span key={i}>
                  {effect}
                  {i < medicine.safetyInformation.adverseEffects.length - 1 && (
                    <span className="text-slate-300 ml-2" aria-hidden="true">·</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Pregnancy and Lactation */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">
              Pregnancy & Breastfeeding Reference
            </h3>
            <p className="text-xs text-slate-700">
              {medicine.safetyInformation.pregnancyLactation}
            </p>
          </div>
        </div>
      </section>

      {/* Source Citation */}
      <section className="bg-slate-50 border border-slate-200 rounded-lg p-4 sm:p-5 text-xs text-slate-600 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="font-semibold text-slate-900">Source: </span>
            <span>{medicine.source.name}</span>
          </div>
          {medicine.source.url && (
            <a
              href={medicine.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-medium underline underline-offset-2 min-h-[44px] sm:min-h-0 items-center"
            >
              <span>{medicine.source.url}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
        <div className="text-slate-500">
          Last updated: <span className="font-mono tabular-nums">{medicine.source.lastUpdated}</span>
          {medicine.sourceType === 'demo' && ' · Demo reference dataset'}
        </div>
      </section>
    </div>
  );
};
