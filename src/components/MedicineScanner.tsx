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
  FileText,
  Info,
  ChevronRight
} from 'lucide-react';
import { createWorker } from 'tesseract.js';
import { parseOcrText, ParsedOcrResult } from '../utils/ocrParser';

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
  const [progressMessage, setProgressMessage] = useState<string>('Initializing OCR engine...');
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

  // Perform Tesseract client-side OCR
  const runOcrOnImage = async (imageSource: string | HTMLCanvasElement) => {
    setStatus('processing');
    setProgress(10);
    setProgressMessage('Reading text from medicine packaging...');
    setErrorMessage(null);

    let worker: any = null;
    try {
      worker = await createWorker('eng');

      setProgress(40);
      setProgressMessage('Recognizing medicine characters...');

      const ret = await worker.recognize(imageSource);
      const text = ret.data.text || '';

      setProgress(100);

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

  // Capture current frame from video stream
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

  // Handle uploaded file (blister pack, carton photo)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so same file can be reselected if needed
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

  const handleConfirm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = editedQuery.trim();
    if (!trimmed) return;
    onClose();
    onConfirmSearch(trimmed);
  };

  const handleReset = () => {
    stopCamera();
    setImagePreviewUrl(null);
    setParsedResult(null);
    setEditedQuery('');
    setErrorMessage(null);
    setStatus('idle');
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="scanner-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-lg bg-white rounded-lg border border-slate-200 shadow-xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-800" />
            <div>
              <h2 id="scanner-modal-title" className="text-base font-bold text-slate-900">
                Scan Medicine Package
              </h2>
              <p className="text-[11px] text-slate-500">
                Camera or photo text recognition (OCR)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2 cursor-pointer"
            aria-label="Close scanner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hidden inputs & canvas */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileUpload}
          className="hidden"
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-slate-700">
          {/* Statutory boundary banner */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p>
              <strong>Input method notice:</strong> OCR assists by extracting text from packaging. Scanning does not verify physical authenticity or certify genuine batches. Images are processed locally on your device and are never stored.
            </p>
          </div>

          {/* State 1: IDLE (Choose Camera or Upload) */}
          {status === 'idle' && (
            <div className="space-y-4 py-2">
              <div className="text-center space-y-1">
                <p className="text-sm font-semibold text-slate-900">
                  Select how to capture your medicine package
                </p>
                <p className="text-xs text-slate-500">
                  Ensure the medicine brand name or NAFDAC registration number is well lit and clearly visible.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={startCamera}
                  className="min-h-[52px] p-4 bg-emerald-800 text-white font-medium text-xs rounded-lg hover:bg-emerald-900 active:bg-emerald-950 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Camera className="w-5 h-5" />
                  <span>Use Device Camera</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="min-h-[52px] p-4 bg-white border border-slate-300 text-slate-800 font-medium text-xs rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Upload className="w-5 h-5 text-slate-600" />
                  <span>Upload Package Photo</span>
                </button>
              </div>

              {/* Tips for best results */}
              <div className="bg-slate-50 border border-slate-200/80 rounded p-3 text-xs text-slate-600 space-y-1.5">
                <div className="font-semibold text-slate-800">Tips for clear scanning:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-500 text-[11px]">
                  <li>Point directly at the product name (e.g. <em>P-Alaxin</em>) or the NAFDAC number (e.g. <em>04-7493</em>).</li>
                  <li>Avoid heavy glare from foil blisters or shiny carton laminates.</li>
                  <li>You will be able to confirm or edit detected text before searching.</li>
                </ul>
              </div>
            </div>
          )}

          {/* State 2: CAMERA STREAM */}
          {status === 'scanning_camera' && (
            <div className="space-y-3">
              <div className="relative rounded-lg overflow-hidden bg-black aspect-4/3 flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Target overlay reticle */}
                <div className="absolute inset-6 border-2 border-dashed border-white/70 rounded-md pointer-events-none flex items-center justify-center">
                  <span className="text-[11px] font-medium text-white/90 bg-black/60 px-2 py-1 rounded">
                    Position medicine name or NAFDAC number here
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCapturePhoto}
                  className="flex-1 min-h-[46px] bg-emerald-800 text-white font-medium text-xs rounded-lg hover:bg-emerald-900 active:bg-emerald-950 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capture Photo</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="min-h-[46px] px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* State 3: PROCESSING OCR */}
          {status === 'processing' && (
            <div className="py-8 text-center space-y-3">
              <div className="w-10 h-10 mx-auto border-3 border-emerald-800 border-t-transparent rounded-full animate-spin" />
              <div className="text-sm font-bold text-slate-900">
                Processing package image...
              </div>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {progressMessage}
              </p>
              {imagePreviewUrl && (
                <div className="pt-2 flex justify-center">
                  <img
                    src={imagePreviewUrl}
                    alt="Scanned medicine preview"
                    className="w-32 h-20 object-cover rounded border border-slate-200 opacity-75"
                  />
                </div>
              )}
            </div>
          )}

          {/* State 4: TEXT DETECTED (CONFIRMATION / EDITING) */}
          {status === 'text_detected' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs bg-emerald-50 p-2.5 rounded border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Text detected on packaging. Confirm or edit before searching.</span>
              </div>

              {/* Detected candidates badges */}
              <div className="space-y-2 text-xs">
                {parsedResult?.detectedNafdac && (
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-200">
                    <div>
                      <span className="text-slate-500 text-[11px]">Detected Registration No: </span>
                      <strong className="font-mono text-slate-900">{parsedResult.detectedNafdac}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditedQuery(parsedResult.detectedNafdac || '')}
                      className="text-emerald-800 hover:text-emerald-950 font-medium underline text-[11px] cursor-pointer"
                    >
                      Use this
                    </button>
                  </div>
                )}

                {parsedResult?.detectedName && (
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-200">
                    <div>
                      <span className="text-slate-500 text-[11px]">Detected Product / Ingredient: </span>
                      <strong className="text-slate-900">{parsedResult.detectedName}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditedQuery(parsedResult.detectedName || '')}
                      className="text-emerald-800 hover:text-emerald-950 font-medium underline text-[11px] cursor-pointer"
                    >
                      Use this
                    </button>
                  </div>
                )}
              </div>

              {/* Editable search query input */}
              <form onSubmit={handleConfirm} className="space-y-2">
                <label
                  htmlFor="ocr-confirm-input"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Search Term to Check:
                </label>
                <div className="flex gap-2">
                  <input
                    id="ocr-confirm-input"
                    type="text"
                    value={editedQuery}
                    onChange={(e) => setEditedQuery(e.target.value)}
                    placeholder="Confirm medicine name or NAFDAC number"
                    className="flex-1 px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700"
                  />
                  <button
                    type="submit"
                    disabled={!editedQuery.trim()}
                    className="min-h-[44px] px-5 bg-emerald-800 text-white font-medium text-xs rounded-md hover:bg-emerald-900 disabled:bg-slate-200 disabled:text-slate-400 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Search</span>
                  </button>
                </div>
              </form>

              {/* Optional raw text toggle for transparency */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowRawText(!showRawText)}
                  className="text-[11px] text-slate-500 hover:text-slate-800 underline flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3 h-3" />
                  <span>{showRawText ? 'Hide detected raw text' : 'View detected raw text'}</span>
                </button>
                {showRawText && parsedResult?.rawText && (
                  <pre className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] font-mono text-slate-600 whitespace-pre-wrap max-h-28 overflow-y-auto">
                    {parsedResult.rawText}
                  </pre>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Rescan package</span>
                </button>
              </div>
            </div>
          )}

          {/* State 5: NO TEXT DETECTED */}
          {status === 'no_text_detected' && (
            <div className="space-y-4 py-3 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">
                  No clear medicine text detected
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  We could not reliably extract a product name or NAFDAC number from this image. This can occur with camera glare, motion blur, or low lighting.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto min-h-[42px] px-4 bg-emerald-800 text-white font-medium text-xs rounded-md hover:bg-emerald-900 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try another photo</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto min-h-[42px] px-4 bg-slate-100 text-slate-700 text-xs font-medium rounded-md hover:bg-slate-200 cursor-pointer"
                >
                  Type manually instead
                </button>
              </div>
            </div>
          )}

          {/* State 6: OCR ERROR */}
          {status === 'ocr_error' && (
            <div className="space-y-4 py-3 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Scan process error
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  {errorMessage || 'An error occurred during package image processing. Please try again or search manually.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto min-h-[42px] px-4 bg-emerald-800 text-white font-medium text-xs rounded-md hover:bg-emerald-900 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry scan</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto min-h-[42px] px-4 bg-slate-100 text-slate-700 text-xs font-medium rounded-md hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
