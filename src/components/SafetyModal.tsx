import React from 'react';
import { X, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { modalBackdropVariants, modalPanelVariants, tapScale } from '../utils/motion';

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="safety-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
        >
          {/* Backdrop click dismiss */}
          <motion.div
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0"
          />

          {/* Modal Panel */}
          <motion.div
            variants={modalPanelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-md bg-white rounded-[24px] border border-[#dce8dc] shadow-xl overflow-hidden max-h-[88vh] flex flex-col z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#edf1eb] bg-[#fcfdfc]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#2d6a4f]" />
                <h2 id="safety-modal-title" className="text-base font-bold text-[#16352a]">
                  Safety & Information Limits
                </h2>
              </div>
              <motion.button
                whileTap={tapScale}
                onClick={onClose}
                className="text-[#81a18e] hover:text-[#16352a] min-h-[38px] min-w-[38px] flex items-center justify-center rounded-full hover:bg-[#eef6ed] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto space-y-3.5 text-xs text-[#526a5c] leading-relaxed">
              <div className="p-3.5 bg-[#eef6ed] border border-[#dce8dc] rounded-2xl text-[#1b4332] font-medium leading-relaxed">
                DrugGuard provides medicine information for reference and educational purposes. It does not replace medical advice or prescription management by a licensed pharmacist or physician.
              </div>

              <div className="space-y-2 pt-1">
                <h3 className="font-bold text-[#16352a] uppercase tracking-wider text-[11px]">
                  Important Boundaries
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#e1775b] font-bold">·</span>
                    <span><strong>Not clinical medical advice:</strong> Never start, discontinue, or alter doses without professional clinical guidance.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#e1775b] font-bold">·</span>
                    <span><strong>Not physical authentication:</strong> Finding a registration code does not verify that a physical package in your hand is genuine or unadulterated.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#e1775b] font-bold">·</span>
                    <span><strong>Not counterfeit confirmation:</strong> Absence of a record in this tool does not automatically prove a medicine is fake.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#e1775b] font-bold">·</span>
                    <span><strong>OCR scanner limitation:</strong> OCR only transcribes printed text to assist searching. It cannot test chemical composition or authenticate barcodes.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 border-t border-[#edf1eb] bg-[#fcfdfc] flex justify-end">
              <motion.button
                whileTap={tapScale}
                onClick={onClose}
                className="px-5 py-2 bg-[#1b4332] text-white text-xs font-bold rounded-full hover:bg-[#24563f] transition-colors cursor-pointer"
              >
                Understood
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
