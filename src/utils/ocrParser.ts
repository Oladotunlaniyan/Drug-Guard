/**
 * OCR Text Parsing Utilities for DrugGuard.
 * Extracts medicine name candidates and NAFDAC registration numbers
 * from raw scanned text.
 */

export interface ParsedOcrResult {
  rawText: string;
  detectedNafdac: string | null;
  detectedName: string | null;
  suggestedQuery: string;
}

// Known common generic and brand names in Nigeria for fuzzy pattern matching
const COMMON_MEDICINE_NAMES = [
  'P-Alaxin',
  'Paracetamol',
  'Amoxicillin',
  'Lonart',
  'Lonart DS',
  'Coartem',
  'Ciprofloxacin',
  'Ciprotav',
  'Metronidazole',
  'Artemether',
  'Lumefantrine',
  'Dihydroartemisinin',
  'Piperaquine',
  'Ibuprofen',
  'Cough Syrup',
  'Ampiclox',
  'Augmentin',
  'Emzor Paracetamol',
];

/**
 * Extracts NAFDAC registration numbers from OCR text.
 * Examples found on packages:
 * - "NAFDAC REG. NO. 04-7493"
 * - "NAFDAC NO: A4-5612"
 * - "Reg No: 01-0024"
 * - "NAFDAC REG NO: DEMO-04-7493"
 * - "04-7493", "A4-5612", "B4-2190"
 */
export function extractNafdacNumber(text: string): string | null {
  // Regex 1: Explicit prefix like NAFDAC REG NO: / NAFDAC NO: / NAFDAC:
  const explicitRegex = /(?:NAFDAC|REG\.?\s*NO|REGISTRATION\s*NO)[^\w\d]{0,5}(?:NO\.?)?[^\w\d]{0,5}([A-Z0-9]{1,4}[-\s][0-9]{3,5}|DEMO-[A-Z0-9-]{4,10})/i;
  const explicitMatch = text.match(explicitRegex);
  if (explicitMatch && explicitMatch[1]) {
    return explicitMatch[1].trim().replace(/\s+/g, '-');
  }

  // Regex 2: Pattern like 04-7493, A4-5612, B4-2190, 01-0024
  const codeRegex = /\b([A-Z0-9]{2}-[0-9]{4,5})\b/i;
  const codeMatch = text.match(codeRegex);
  if (codeMatch && codeMatch[1]) {
    return codeMatch[1].trim();
  }

  return null;
}

/**
 * Extracts a likely medicine name from OCR text.
 * Looks for known drug keywords, or prominent high-confidence title lines.
 */
export function extractMedicineName(text: string): string | null {
  // 1. Check for known names
  for (const name of COMMON_MEDICINE_NAMES) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(text)) {
      return name;
    }
  }

  // 2. Scan lines for a reasonable drug title line
  // Clean line and discard short or purely numerical/regulatory lines
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length >= 3 && l.length <= 40);

  for (const line of lines) {
    // Ignore lines that are purely dates, batch numbers, or NAFDAC labels
    if (
      /^(nafdac|mfg|exp|batch|b\.?no|bn|n\.?r|tablets?|capsules?|suspension|oral|bp|usp)/i.test(
        line
      )
    ) {
      continue;
    }

    // Ignore lines with too many numbers or symbols
    const lettersCount = (line.match(/[a-zA-Z]/g) || []).length;
    if (lettersCount / line.length > 0.6 && lettersCount >= 4) {
      // Clean up common OCR noise
      const cleaned = line
        .replace(/[^a-zA-Z0-9\s-+()]/g, '')
        .trim();
      if (cleaned.length >= 3) {
        return cleaned;
      }
    }
  }

  return null;
}

/**
 * Processes full OCR text into structured candidate values.
 */
export function parseOcrText(rawText: string): ParsedOcrResult {
  const clean = rawText.trim();
  const detectedNafdac = extractNafdacNumber(clean);
  const detectedName = extractMedicineName(clean);

  // Preference: NAFDAC number if detected (very specific), else detected name, else top valid line
  let suggestedQuery = '';
  if (detectedNafdac) {
    suggestedQuery = detectedNafdac;
  } else if (detectedName) {
    suggestedQuery = detectedName;
  } else {
    // Fallback to first non-empty line
    const firstLine = clean.split('\n').map((s) => s.trim()).find((s) => s.length > 2);
    suggestedQuery = firstLine || '';
  }

  return {
    rawText: clean,
    detectedNafdac,
    detectedName,
    suggestedQuery,
  };
}
