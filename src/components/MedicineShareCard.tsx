import React, { useRef, useState } from 'react';
import { Medicine } from '../types/medicine';
import {
  X,
  Share2,
  Download,
  Copy,
  Check,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { modalBackdropVariants, modalPanelVariants, tapScale } from '../utils/motion';

interface MedicineShareCardProps {
  medicine: Medicine;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Builds clean plain-text information string for copying or sharing.
 * Only includes fields that actually exist. Never fabricates values.
 */
export function buildMedicineShareText(medicine: Medicine): string {
  const lines: string[] = [];

  lines.push('DRUGGUARD — MEDICINE INFORMATION\n');
  lines.push(medicine.name);
  if (medicine.category) {
    lines.push(medicine.category);
  }

  if (medicine.uses && medicine.uses.length > 0) {
    lines.push('\nUsed for:');
    lines.push(medicine.uses.join(' '));
  }

  const specs: string[] = [];
  if (medicine.dosageForm) specs.push(`Form: ${medicine.dosageForm}`);
  if (medicine.strength) specs.push(`Strength: ${medicine.strength}`);
  if (medicine.route) specs.push(`Route: ${medicine.route}`);
  if (medicine.nafdacFormattedNumber || medicine.nafdacNumber) {
    specs.push(`NAFDAC: ${medicine.nafdacFormattedNumber || medicine.nafdacNumber}`);
  }

  if (medicine.registrationStatus === 'REGISTERED') {
    specs.push('Registration: Registered product found');
  } else if (medicine.registrationStatus && medicine.registrationStatus !== 'UNKNOWN') {
    specs.push(`Registration: ${medicine.registrationStatus}`);
  }

  if (specs.length > 0) {
    lines.push('\n' + specs.join('\n'));
  }

  const warningsCount = medicine.safetyInformation?.warnings?.length || 0;
  if (warningsCount > 0) {
    lines.push('\nSafety:');
    lines.push(`${warningsCount} ${warningsCount === 1 ? 'warning' : 'warnings'} available`);
  }

  lines.push(`\nSource: ${medicine.source?.name || 'DrugGuard'}`);
  if (medicine.source?.lastUpdated) {
    lines.push(`Updated: ${medicine.source.lastUpdated}`);
  }

  lines.push('\nReference information only.');
  lines.push('DrugGuard does not certify physical package authenticity.');

  return lines.join('\n');
}

/**
 * High-performance Canvas Renderer for instant PNG card export.
 */
function renderCardToCanvas(medicine: Medicine): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const width = 760;
      const height = 1040;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas 2D context not available');
      }

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Card border
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 3;
      ctx.strokeRect(32, 32, width - 64, height - 64);

      let y = 84;

      // Header Bar
      ctx.fillStyle = '#1b4332';
      ctx.fillRect(64, y, 44, 44);

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(86, y + 18, 9, Math.PI, 0, false);
      ctx.lineTo(86, y + 33);
      ctx.closePath();
      ctx.fill();

      // Brand Title
      ctx.fillStyle = '#16352a';
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
      ctx.fillText('DRUGGUARD', 122, y + 20);

      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
      ctx.fillText('MEDICINE INFORMATION', 122, y + 38);

      // Reference tag
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(width - 194, y + 8, 130, 28);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(width - 194, y + 8, 130, 28);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('REFERENCE', width - 129, y + 27);
      ctx.textAlign = 'left';

      y += 72;

      // Divider
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(64, y);
      ctx.lineTo(width - 64, y);
      ctx.stroke();

      y += 42;

      // Medicine Name
      ctx.fillStyle = '#16352a';
      ctx.font = 'bold 32px system-ui, -apple-system, sans-serif';
      ctx.fillText(medicine.name, 64, y);

      y += 28;

      // Category
      if (medicine.category) {
        ctx.fillStyle = '#1b4332';
        ctx.font = '600 18px system-ui, -apple-system, sans-serif';
        ctx.fillText(medicine.category, 64, y);
        y += 32;
      }

      // Active Ingredients
      if (medicine.activeIngredients) {
        ctx.fillStyle = '#334155';
        ctx.font = '16px system-ui, -apple-system, sans-serif';
        ctx.fillText(`Active Ingredient: ${medicine.activeIngredients}`, 64, y);
        y += 32;
      }

      // Used For Box
      if (medicine.uses && medicine.uses.length > 0) {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(64, y, width - 128, 90);
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(64, y, width - 128, 90);

        ctx.fillStyle = '#475569';
        ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
        ctx.fillText('USED FOR', 82, y + 26);

        ctx.fillStyle = '#1e293b';
        ctx.font = '16px system-ui, -apple-system, sans-serif';

        let useText = medicine.uses[0];
        if (useText.length > 80) {
          useText = useText.substring(0, 77) + '...';
        }
        ctx.fillText(useText, 82, y + 58);

        y += 116;
      }

      // Form & Strength Grid
      if (medicine.dosageForm || medicine.strength) {
        ctx.strokeStyle = '#f1f5f9';
        ctx.beginPath();
        ctx.moveTo(64, y);
        ctx.lineTo(width - 64, y);
        ctx.stroke();
        y += 26;

        if (medicine.dosageForm) {
          ctx.fillStyle = '#64748b';
          ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
          ctx.fillText('FORM', 64, y);

          ctx.fillStyle = '#1e293b';
          ctx.font = '600 18px system-ui, -apple-system, sans-serif';
          ctx.fillText(medicine.dosageForm, 64, y + 24);
        }

        if (medicine.strength) {
          ctx.fillStyle = '#64748b';
          ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
          ctx.fillText('STRENGTH', 380, y);

          ctx.fillStyle = '#1e293b';
          ctx.font = '600 18px monospace';
          ctx.fillText(medicine.strength, 380, y + 24);
        }

        y += 50;
      }

      // NAFDAC Number
      const nafdacVal = medicine.nafdacFormattedNumber || medicine.nafdacNumber;
      if (nafdacVal) {
        ctx.strokeStyle = '#f1f5f9';
        ctx.beginPath();
        ctx.moveTo(64, y);
        ctx.lineTo(width - 64, y);
        ctx.stroke();
        y += 26;

        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
        ctx.fillText('NAFDAC NUMBER', 64, y);

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 20px monospace';
        ctx.fillText(nafdacVal, 64, y + 24);

        y += 50;
      }

      // Registration Status
      ctx.strokeStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.moveTo(64, y);
      ctx.lineTo(width - 64, y);
      ctx.stroke();
      y += 26;

      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
      ctx.fillText('REGISTRATION', 64, y);

      if (medicine.registrationStatus === 'REGISTERED') {
        ctx.fillStyle = '#ecfdf5';
        ctx.fillRect(64, y + 8, 250, 32);
        ctx.strokeStyle = '#a7f3d0';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(64, y + 8, 250, 32);

        ctx.fillStyle = '#1b4332';
        ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
        ctx.fillText('✓ Registered product found', 76, y + 30);
      } else {
        ctx.fillStyle = '#92400e';
        ctx.font = '600 16px system-ui, -apple-system, sans-serif';
        ctx.fillText(`Status: ${medicine.registrationStatus || 'Unknown'}`, 64, y + 24);
      }

      y += 60;

      // Mandatory Notice Footer
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(64, y);
      ctx.lineTo(width - 64, y);
      ctx.stroke();
      y += 26;

      ctx.fillStyle = '#64748b';
      ctx.font = '13px system-ui, -apple-system, sans-serif';
      ctx.fillText(
        'Reference information only. DrugGuard does not certify physical package authenticity.',
        64,
        y
      );

      resolve(canvas.toDataURL('image/png'));
    } catch (err) {
      reject(err);
    }
  });
}

export const MedicineShareCard: React.FC<MedicineShareCardProps> = ({
  medicine,
  isOpen,
  onClose,
}) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const shareText = buildMedicineShareText(medicine);
  const isRegistered = medicine.registrationStatus === 'REGISTERED';

  // Handle native Web Share API
  const handleNativeShare = async () => {
    setImageError(null);
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${medicine.name} | DrugGuard Medicine Information`,
          text: shareText,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2500);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          handleCopyText();
        }
      }
    } else {
      handleCopyText();
    }
  };

  // Handle plain text copying
  const handleCopyText = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (_) {
      setImageError("Couldn't copy text to clipboard.");
    }
  };

  // Handle PNG Image Download
  const handleDownloadCard = async () => {
    setIsGeneratingImage(true);
    setImageError(null);

    try {
      const dataUrl = await renderCardToCanvas(medicine);
      const filename = `DrugGuard_${medicine.name.replace(/[^a-zA-Z0-9]/g, '_')}_Card.png`;
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.warn('Canvas card image generation error:', err);
      setImageError("Couldn't generate the image. You can still copy the medicine information.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-card-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs"
        >
          {/* Backdrop */}
          <motion.div
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0"
          />

          {/* Modal Card */}
          <motion.div
            variants={modalPanelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-sm bg-white rounded-[24px] border border-[#dce8dc] shadow-xl overflow-hidden max-h-[90vh] flex flex-col z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#edf1eb] bg-[#fcfdfc]">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#1b4332]" />
                <h2 id="share-card-title" className="text-sm font-bold text-[#16352a]">
                  Share Medicine Card
                </h2>
              </div>
              <motion.button
                whileTap={tapScale}
                onClick={onClose}
                className="text-[#81a18e] hover:text-[#16352a] min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full hover:bg-[#eef6ed] transition-colors cursor-pointer"
                aria-label="Close share preview"
              >
                <X className="w-4.5 h-4.5" />
              </motion.button>
            </div>

            {/* Scrollable Card Preview Container */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 bg-[#f6f8f4]/60">
              {imageError && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>{imageError}</span>
                </div>
              )}

              {/* CARD PREVIEW */}
              <div className="w-full bg-white rounded-2xl border border-[#dce8dc] p-4.5 shadow-2xs space-y-3 text-[#16352a] select-none text-xs">
                {/* Brand Header */}
                <div className="flex items-center justify-between border-b border-[#edf1eb] pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-[#1b4332] flex items-center justify-center text-white shrink-0">
                      <ShieldCheck className="w-3 h-3 text-[#9bdfb1]" />
                    </div>
                    <span className="text-xs font-bold text-[#16352a]">
                      DRUGGUARD
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#81a18e] bg-[#f4f8f3] px-2 py-0.5 rounded-full border border-[#dce8dc]">
                    Reference
                  </span>
                </div>

                {/* Medicine Identity */}
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-[#16352a] tracking-tight">
                    {medicine.name}
                  </h3>
                  {medicine.category && (
                    <div className="text-[11px] font-medium text-[#2d6a4f]">
                      {medicine.category}
                    </div>
                  )}
                </div>

                {/* Active Ingredients */}
                {medicine.activeIngredients && (
                  <div className="text-xs text-[#526a5c]">
                    <span className="font-semibold text-[#16352a]">Active: </span>
                    <span>{medicine.activeIngredients}</span>
                  </div>
                )}

                {/* Form & Strength */}
                {(medicine.dosageForm || medicine.strength) && (
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#edf1eb]">
                    {medicine.dosageForm && (
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#81a18e] block">
                          Form
                        </span>
                        <span className="font-medium text-[#16352a]">{medicine.dosageForm}</span>
                      </div>
                    )}
                    {medicine.strength && (
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#81a18e] block">
                          Strength
                        </span>
                        <span className="font-mono text-xs font-medium text-[#16352a]">
                          {medicine.strength}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Registration Status */}
                <div className="border-t border-[#edf1eb] pt-2 text-xs">
                  {isRegistered ? (
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1b4332] bg-[#eef6ed] px-2.5 py-0.5 rounded-full border border-[#dce8dc]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#52b788]" />
                      <span>✓ Registered product found</span>
                    </div>
                  ) : (
                    <div className="text-xs font-medium text-amber-800">
                      Status: {medicine.registrationStatus}
                    </div>
                  )}
                </div>

                {/* Statutory Notice */}
                <div className="border-t border-[#edf1eb] pt-2 text-[10px] leading-relaxed text-[#81a18e]">
                  Reference information only. DrugGuard does not certify physical package authenticity.
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-4 py-3 border-t border-[#edf1eb] bg-white flex items-center justify-between gap-2">
              <motion.button
                whileTap={tapScale}
                type="button"
                onClick={handleNativeShare}
                className="flex-1 min-h-[40px] px-3.5 py-2 bg-[#1b4332] text-white font-bold text-xs rounded-full hover:bg-[#24563f] flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                {shared ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Shared!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </>
                )}
              </motion.button>

              <motion.button
                whileTap={tapScale}
                type="button"
                disabled={isGeneratingImage}
                onClick={handleDownloadCard}
                className="min-h-[40px] px-3.5 py-2 bg-white border border-[#dce8dc] text-[#16352a] hover:bg-[#eef6ed] font-bold text-xs rounded-full flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
                title="Download PNG image"
              >
                {isGeneratingImage ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1b4332]" />
                ) : (
                  <Download className="w-3.5 h-3.5 text-[#52b788]" />
                )}
                <span>PNG</span>
              </motion.button>

              <motion.button
                whileTap={tapScale}
                type="button"
                onClick={handleCopyText}
                className="min-h-[40px] px-3.5 py-2 bg-white border border-[#dce8dc] text-[#16352a] hover:bg-[#eef6ed] font-bold text-xs rounded-full flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                title="Copy text"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-[#52b788]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-[#81a18e]" />
                )}
                <span>Copy</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
