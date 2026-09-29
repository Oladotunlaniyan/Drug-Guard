import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  Upload,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Search,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { createWorker } from 'tesseract.js';
import { parseOcrText, ParsedOcrResult } from '../utils/ocrParser';
import { modalBackdropVariants, modalPanelVariants, tapScale } from '../utils/motion';

interface MedicineScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSearch: (query: string) => void;
}

type ScanStatus =
  | 'idle'
  | 'scanning_camera'
  | 'processing'
  | 'text_detected'
  | 'no_text_detected'
  | 'ocr_error';

export const MedicineScanner: React.FC<MedicineScannerProps> = ({
  isOpen,
  onClose,
  onConfirmSearch,
}) => {
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [progressMessage, setProgressMessage] = useState<string>('Initializing OCR...');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<ParsedOcrResult | null>(null);
  const [editedQuery, setEditedQuery] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showRawText, setShowRawText] = useState(false);

  // Camera stream refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop active camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Cleanup on modal close or unmount
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setStatus('idle');
      setImagePreviewUrl(null);
      setParsedResult(null);
      setErrorMessage(null);
      setProgress(0);
    }
  }, [isOpen, stopCamera]);

  // Start device camera
  const startCamera = async () => {
    try {
      stopCamera();
      setErrorMessage(null);
      setStatus('scanning_camera');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn('Camera access unavailable:', err);
      stopCamera();
      setStatus('ocr_error');
      setErrorMessage(
        'Unable to access camera. Please allow camera permissions or upload a package photo instead.'
      );
    }
  };

  // Run Tesseract.js client-side OCR
  const runOcrOnImage = async (imageSource: string | HTMLCanvasElement) => {
    setStatus('processing');
    setProgress(0);
    setProgressMessage('Reading text from package...');

    let worker: any = null;
    try {
      worker = await createWorker('eng', 1, {
        logger: (m: any) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
            setProgressMessage(`Extracting printed text (${Math.round(m.progress * 100)}%)...`);
          }
        },
      });

      const ret = await worker.recognize(imageSource);
      const text = ret.data.text || '';

      await worker.terminate();
      worker = null;

      if (!text.trim()) {
        setStatus('no_text_detected');
        return;
      }

      const parsed = parseOcrText(text);

      if (!parsed.suggestedQuery && !parsed.detectedNafdac && !parsed.detectedName) {
        setStatus('no_text_detected');
      } else {
        setParsedResult(parsed);
        setEditedQuery(parsed.suggestedQuery);
        setStatus('text_detected');
      }
    } catch (err: any) {
      console.error('OCR processing error:', err);
      if (worker) {
        try {
          await worker.terminate();
        } catch (_) {}
      }
      setStatus('ocr_error');
      setErrorMessage('Failed to read text from the image. Please try again with clear lighting or enter the medicine name manually.');
    }
  };

  // Capture photo from video
  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setImagePreviewUrl(dataUrl);

    stopCamera();
    runOcrOnImage(canvas);
  };

  // Handle uploaded file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = '';
    stopCamera();
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImagePreviewUrl(dataUrl);
      runOcrOnImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    stopCamera();
    setStatus('idle');
    setImagePreviewUrl(null);
    setParsedResult(null);
    setEditedQuery('');
    setErrorMessage(null);
    setProgress(0);
  };

  const handleConfirm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalQuery = editedQuery.trim();
    if (!finalQuery) return;
    onConfirmSearch(finalQuery);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="scanner-modal-title"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs"
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

          {/* Panel: Responsive Full-width on mobile with bottom sheet feel, centered modal on tablet/desktop */}
          <motion.div
            variants={modalPanelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-full sm:max-w-xl bg-white rounded-t-[28px] sm:rounded-[28px] border-t sm:border border-[#dce8dc] shadow-xl overflow-hidden max-h-[92vh] sm:max-h-[88vh] flex flex-col z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#edf1eb] bg-[#fcfdfc] shrink-0">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#1b4332]" />
                <h2 id="scanner-modal-title" className="text-sm sm:text-base font-bold text-[#16352a]">
                  Medicine Package Scanner
                </h2>
              </div>
              <motion.button
                whileTap={tapScale}
                onClick={onClose}
                className="text-[#355845] hover:text-[#16352a] min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-[#eef6ed] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332]"
                aria-label="Close scanner"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Hidden canvas */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              {/* Notice Banner */}
              <div className="p-3 bg-[#eef6ed] border border-[#cbd9cc] rounded-2xl text-xs text-[#204030] flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#2d6a4f] shrink-0 mt-0.5" />
                <p>
                  <strong>Private & Client-Side:</strong> OCR reads printed text right on your device. Images are never uploaded. This tool assists text entry and does not certify physical medicine authenticity.
                </p>
              </div>

              {/* State 1: IDLE */}
              {status === 'idle' && (
                <div className="space-y-4 py-2">
                  <div className="text-center space-y-1">
                    <h3 className="text-base font-bold text-[#16352a]">
                      How would you like to scan?
                    </h3>
                    <p className="text-xs sm:text-sm text-[#2d4f3b]">
                      Hold the blister pack, label, or box steady in good light.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={tapScale}
                      type="button"
                      onClick={startCamera}
                      className="min-h-[110px] p-5 rounded-2xl border-2 border-[#cbd9cc] hover:border-[#1b4332] hover:bg-[#f6f8f4] text-center space-y-2 cursor-pointer transition-colors shadow-2xs group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332]"
                    >
                      <div className="w-10 h-10 mx-auto rounded-full bg-[#eef6ed] text-[#2d6a4f] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Camera className="w-5 h-5 text-[#2d6a4f]" />
                      </div>
                      <div className="font-bold text-sm text-[#16352a]">Use Camera</div>
                      <div className="text-xs text-[#2d4f3b]">Scan live with phone or webcam</div>
                    </motion.button>

                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={tapScale}
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="min-h-[110px] p-5 rounded-2xl border-2 border-[#cbd9cc] hover:border-[#1b4332] hover:bg-[#f6f8f4] text-center space-y-2 cursor-pointer transition-colors shadow-2xs group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332]"
                    >
                      <div className="w-10 h-10 mx-auto rounded-full bg-[#eef6ed] text-[#2d6a4f] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Upload className="w-5 h-5 text-[#2d6a4f]" />
                      </div>
                      <div className="font-bold text-sm text-[#16352a]">Upload Photo</div>
                      <div className="text-xs text-[#2d4f3b]">Select packaging from gallery</div>
                    </motion.button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}

              {/* State 2: CAMERA STREAM (Requirement 5)
                  - Mobile: Camera takes full width with large, thumb-friendly capture button pinned near bottom.
                  - Tablet/Laptop: Centered container with sensible max-width keeping aspect-ratio, video never stretching/distorting.
              */}
              {status === 'scanning_camera' && (
                <div className="space-y-4">
                  <div className="w-full max-w-full sm:max-w-[480px] mx-auto relative rounded-2xl overflow-hidden bg-black aspect-[4/3] flex items-center justify-center shadow-xs">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className="w-full h-full object-cover max-w-full"
                    />

                    {/* Animated Reticle Overlay */}
                    <div className="absolute inset-4 sm:inset-6 border-2 border-dashed border-[#52b788]/80 rounded-xl pointer-events-none">
                      <motion.div
                        animate={{ top: ['5%', '90%', '5%'] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute left-2 right-2 h-0.5 bg-[#52b788] shadow-[0_0_10px_#52b788]"
                      />
                    </div>
                  </div>

                  {/* Large thumb-friendly capture button and cancel */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 max-w-[480px] mx-auto">
                    <motion.button
                      whileTap={tapScale}
                      type="button"
                      onClick={handleCapturePhoto}
                      className="order-1 sm:order-2 w-full sm:w-auto min-h-[50px] px-8 py-3 bg-[#1b4332] text-white font-bold text-sm sm:text-base rounded-full hover:bg-[#24563f] flex items-center justify-center gap-2 cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332]"
                    >
                      <Camera className="w-5 h-5 text-[#9bdfb1]" />
                      <span>Capture & Read Text</span>
                    </motion.button>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="order-2 sm:order-1 min-h-[44px] px-4 text-xs sm:text-sm font-bold text-[#355845] hover:text-[#16352a] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332] rounded-full text-center"
                    >
                      Cancel camera
                    </button>
                  </div>
                </div>
              )}

              {/* State 3: PROCESSING */}
              {status === 'processing' && (
                <div className="space-y-4 py-8 text-center">
                  <Loader2 className="w-9 h-9 mx-auto animate-spin text-[#1b4332]" />
                  <div className="space-y-1">
                    <div className="text-sm sm:text-base font-bold text-[#16352a]">
                      {progressMessage}
                    </div>
                    <div className="text-xs sm:text-sm text-[#2d4f3b]">
                      Processing packaging image locally on device...
                    </div>
                  </div>

                  {progress > 0 && (
                    <div className="w-48 sm:w-64 mx-auto bg-[#edf1eb] rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#2d6a4f] h-full transition-all duration-200"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* State 4: TEXT DETECTED */}
              {status === 'text_detected' && (
                <div className="space-y-4 py-1">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1b4332] bg-[#eef6ed] p-3 rounded-2xl border border-[#cbd9cc]">
                    <CheckCircle2 className="w-4 h-4 text-[#2d6a4f] shrink-0" />
                    <span>Packaging text extracted successfully</span>
                  </div>

                  {/* Suggestion pills if detected */}
                  <div className="space-y-2 text-xs sm:text-sm">
                    {parsedResult?.detectedNafdac && (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-[#fcfdfc] rounded-xl border border-[#edf1eb]">
                        <span className="text-[#2d4f3b] font-medium break-all">
                          NAFDAC: <strong className="text-[#16352a] font-mono">{parsedResult.detectedNafdac}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => setEditedQuery(parsedResult.detectedNafdac || '')}
                          className="min-h-[44px] sm:min-h-0 text-[#1b4332] hover:underline font-bold text-xs cursor-pointer self-start sm:self-auto flex items-center"
                        >
                          Use this code
                        </button>
                      </div>
                    )}

                    {parsedResult?.detectedName && (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-[#fcfdfc] rounded-xl border border-[#edf1eb]">
                        <span className="text-[#2d4f3b] font-medium break-all">
                          Medicine: <strong className="text-[#16352a]">{parsedResult.detectedName}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => setEditedQuery(parsedResult.detectedName || '')}
                          className="min-h-[44px] sm:min-h-0 text-[#1b4332] hover:underline font-bold text-xs cursor-pointer self-start sm:self-auto flex items-center"
                        >
                          Use this name
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Search query input */}
                  <form onSubmit={handleConfirm} className="space-y-2">
                    <label
                      htmlFor="ocr-confirm-input"
                      className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#355845]"
                    >
                      Confirm query to check:
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        id="ocr-confirm-input"
                        type="text"
                        value={editedQuery}
                        onChange={(e) => setEditedQuery(e.target.value)}
                        placeholder="Confirm medicine name or NAFDAC code"
                        className="flex-1 px-4 py-2.5 text-sm bg-white border border-[#cbd9cc] rounded-full text-[#16352a] focus:outline-none focus:ring-2 focus:ring-[#1b4332] min-h-[46px]"
                      />
                      <motion.button
                        whileTap={tapScale}
                        type="submit"
                        disabled={!editedQuery.trim()}
                        className="min-h-[46px] px-6 bg-[#1b4332] text-white font-bold text-xs sm:text-sm rounded-full hover:bg-[#24563f] disabled:bg-[#d5e2d6] disabled:text-[#4a6b54] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Search className="w-4 h-4" />
                        <span>Search</span>
                      </motion.button>
                    </div>
                  </form>

                  {/* Rescan or Cancel */}
                  <div className="pt-2 border-t border-[#edf1eb] flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="min-h-[44px] text-[#2d4f3b] hover:text-[#16352a] flex items-center gap-1.5 cursor-pointer font-bold"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Rescan package</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRawText(!showRawText)}
                      className="min-h-[44px] text-[#355845] hover:text-[#16352a] underline text-xs cursor-pointer flex items-center"
                    >
                      {showRawText ? 'Hide raw OCR' : 'View raw OCR'}
                    </button>
                  </div>

                  {showRawText && parsedResult?.rawText && (
                    <pre className="p-3 bg-[#f6f8f4] border border-[#cbd9cc] rounded-xl text-xs font-mono text-[#204030] whitespace-pre-wrap max-h-28 overflow-y-auto break-all">
                      {parsedResult.rawText}
                    </pre>
                  )}
                </div>
              )}

              {/* State 5: NO TEXT DETECTED / ERROR */}
              {(status === 'no_text_detected' || status === 'ocr_error') && (
                <div className="space-y-4 py-6 text-center">
                  <div className="w-10 h-10 mx-auto rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-[#16352a]">
                      {status === 'no_text_detected' ? 'No clear medicine text detected' : 'Scan error'}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#2d4f3b] max-w-sm mx-auto">
                      {errorMessage || 'Try capturing with steady lighting or search for the medicine name directly.'}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                    <motion.button
                      whileTap={tapScale}
                      type="button"
                      onClick={handleReset}
                      className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-[#1b4332] text-white font-bold text-xs sm:text-sm rounded-full hover:bg-[#24563f] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Try again</span>
                    </motion.button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 text-xs sm:text-sm font-bold text-[#355845] hover:text-[#16352a] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
