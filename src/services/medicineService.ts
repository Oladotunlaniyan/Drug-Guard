import {
  Medicine,
  BackendMedicineItem,
  BackendSearchResponse,
  BackendNafdacResponse,
  BackendAllResponse,
  RegistrationStatus,
  MedicineSourceType,
} from '../types/medicine';
import { MOCK_MEDICINES } from '../data/mockMedicines';

// Configurable base URL: prefers VITE_API_BASE_URL, falls back to the live deployed DrugGuard backend
const DEFAULT_BACKEND_URL = 'https://druggard-backend.onrender.com';
const API_BASE_URL: string =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE) ||
  DEFAULT_BACKEND_URL;

/**
 * Normalizes raw backend medicine JSON item into the frontend Medicine model.
 * Maps only fields that actually exist in the backend response.
 * Does NOT fabricate medical information or registration claims.
 */
export function normalizeBackendMedicine(item: BackendMedicineItem): Medicine {
  // Active ingredients: backend provides string array e.g. ["Dihydroartemisinin 40mg", "Piperaquine Phosphate 320mg"]
  const ingredientsString = Array.isArray(item.activeIngredients)
    ? item.activeIngredients.join(', ')
    : typeof item.activeIngredients === 'string'
    ? item.activeIngredients
    : '';

  // Registration status mapping
  let regStatus: RegistrationStatus = 'UNKNOWN';
  if (item.registrationStatus) {
    const norm = item.registrationStatus.toUpperCase();
    if (norm === 'REGISTERED') regStatus = 'REGISTERED';
    else if (norm === 'EXPIRED') regStatus = 'EXPIRED';
    else if (norm === 'SUSPENDED') regStatus = 'SUSPENDED';
    else if (norm === 'PROVISIONAL') regStatus = 'PROVISIONAL';
  }

  // Uses / Indications: backend provides string `indication`
  const usesList: string[] = [];
  if (item.indication && item.indication.trim()) {
    usesList.push(item.indication.trim());
  }

  // Safety warnings: backend provides string array `warnings`
  const warningsList: string[] = Array.isArray(item.warnings)
    ? item.warnings.filter((w) => Boolean(w && w.trim()))
    : [];

  // Data source / provenance
  let sourceType: MedicineSourceType = 'backend';
  if (item.dataSource === 'manual-seed') {
    sourceType = 'backend';
  }

  // Formatted NAFDAC display
  const nafdacNum = item.nafdacNumber || undefined;
  const isPendingNafdac = nafdacNum ? nafdacNum.startsWith('PENDING-') : false;
  const nafdacDisplay = nafdacNum
    ? isPendingNafdac
      ? `${nafdacNum} (Reference)`
      : nafdacNum
    : undefined;

  return {
    id: item.id || `med-${item.nafdacNumber || item.productName}`,
    name: item.productName || 'Unnamed Medicine',
    brandName: item.productName || undefined,
    genericName: ingredientsString || undefined,
    activeIngredients: ingredientsString,
    strength: item.strength || undefined,
    dosageForm: item.form || undefined,
    route: item.route || undefined,
    manufacturer: item.manufacturer || undefined,
    countryOfOrigin: undefined, // Leave undefined when not provided by backend
    nafdacNumber: nafdacNum,
    nafdacFormattedNumber: nafdacDisplay,
    registrationStatus: regStatus,
    registrationDate: undefined, // Leave undefined if not present
    expiryDate: undefined,
    category: item.category || undefined,
    sourceType,
    uses: usesList,
    dosageReference: {
      general: item.dosageReference || undefined,
      administrationNotes: undefined,
    },
    safetyInformation: {
      warnings: warningsList,
      contraindications: undefined,
      adverseEffects: undefined,
      pregnancyLactation: undefined,
    },
    source: {
      name: item.dataSource ? `DrugGuard Registry (${item.dataSource})` : 'DrugGuard Registry',
      url: item.sourceUrl || undefined,
      lastUpdated: item.updatedAt ? new Date(item.updatedAt).toISOString().split('T')[0] : undefined,
    },
  };
}

/**
 * MedicineService layer.
 * 
 * Interacts with the deployed DrugGuard backend:
 *   - GET /api/v1/medicines?q={query}
 *   - GET /api/v1/medicines/nafdac/{nafdacNumber}
 *   - GET /api/v1/medicines/all
 * 
 * In case the user query looks like a NAFDAC number or if the network is temporarily offline,
 * it provides resilient fallbacks without breaking the UI flow.
 */
class MedicineService {
  private inMemoryCache = new Map<string, Medicine>();

  /**
   * Caches normalized medicine records so getMedicineById can retrieve them
   * without creating fake endpoints.
   */
  private cacheMedicines(medicines: Medicine[]) {
    for (const med of medicines) {
      if (med.id) {
        this.inMemoryCache.set(med.id, med);
      }
    }
  }

  /**
   * Searches medicines by name or query string.
   * Calls: GET /api/v1/medicines?q={query}
   * If the query matches a NAFDAC registration format (or if search returns 0 results),
   * also checks the NAFDAC endpoint for direct registration matches.
   */
  async searchMedicines(query: string): Promise<Medicine[]> {
    const trimmed = query.trim();
    if (!trimmed) {
      return [];
    }

    try {
      const url = `${API_BASE_URL}/api/v1/medicines?q=${encodeURIComponent(trimmed)}`;
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Registry API error: ${response.status} ${response.statusText}`);
      }

      const data: BackendSearchResponse = await response.json();

      if (data.results && Array.isArray(data.results) && data.results.length > 0) {
        const normalized = data.results.map(normalizeBackendMedicine);
        this.cacheMedicines(normalized);
        return normalized;
      }

      // If the query looks like a NAFDAC number (e.g. B4-8892, 04-0130, A4-100927),
      // also try querying /api/v1/medicines/nafdac/{number}
      const isNafdacFormat = /^[A-Za-z0-9]{2,4}[-\s]?[0-9A-Za-z]{3,7}$/.test(trimmed);
      if (isNafdacFormat) {
        const nafdacDirect = await this.getMedicineByNafdac(trimmed);
        if (nafdacDirect) {
          return [nafdacDirect];
        }
      }

      return [];
    } catch (networkError: any) {
      console.warn('Backend API connection failed, attempting fallback:', networkError);

      // If network fails completely (e.g. backend temporarily sleeping or user offline),
      // we check local demo dataset as a graceful fallback clearly marked as demo
      const localMatches = MOCK_MEDICINES.filter((med) => {
        const q = trimmed.toLowerCase();
        return (
          med.name.toLowerCase().includes(q) ||
          med.activeIngredients.toLowerCase().includes(q) ||
          med.nafdacNumber?.toLowerCase().includes(q)
        );
      });

      if (localMatches.length > 0) {
        this.cacheMedicines(localMatches);
        return localMatches;
      }

      // Re-throw if no match to show user-friendly retry
      throw new Error(
        'Unable to connect to the DrugGuard database. Please check your internet connection and try again.'
      );
    }
  }

  /**
   * Retrieves a medicine record directly by its NAFDAC registration number.
   * Calls: GET /api/v1/medicines/nafdac/{nafdacNumber}
   */
  async getMedicineByNafdac(nafdacNumber: string): Promise<Medicine | null> {
    const trimmed = nafdacNumber.trim();
    if (!trimmed) return null;

    try {
      const url = `${API_BASE_URL}/api/v1/medicines/nafdac/${encodeURIComponent(trimmed)}`;
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`NAFDAC lookup error: ${response.status} ${response.statusText}`);
      }

      const data: BackendNafdacResponse = await response.json();

      if (data.status === 'registered' && data.medicine) {
        const normalized = normalizeBackendMedicine(data.medicine);
        this.cacheMedicines([normalized]);
        return normalized;
      }

      return null;
    } catch (err: any) {
      console.warn('Error in getMedicineByNafdac:', err);
      // Fallback to cache/mock if available
      const cached = Array.from(this.inMemoryCache.values()).find(
        (m) => m.nafdacNumber?.toLowerCase() === trimmed.toLowerCase()
      );
      if (cached) return cached;
      return null;
    }
  }

  /**
   * Retrieves a single medicine by its ID.
   * Since there is NO confirmed /medicines/{id} endpoint on the backend,
   * we use the in-memory cache populated by search/all queries.
   * If not in cache, we query /api/v1/medicines/all to locate the medicine by ID.
   */
  async getMedicineById(id: string): Promise<Medicine | null> {
    if (!id) return null;

    // 1. Check in-memory cache
    if (this.inMemoryCache.has(id)) {
      return this.inMemoryCache.get(id) || null;
    }

    // 2. Fetch all medicines to populate cache and find by ID
    try {
      const all = await this.getAllMedicines();
      const found = all.find((m) => m.id === id);
      return found || null;
    } catch (_) {
      return null;
    }
  }

  /**
   * Retrieves all medicines from the backend.
   * Calls: GET /api/v1/medicines/all
   */
  async getAllMedicines(): Promise<Medicine[]> {
    try {
      const url = `${API_BASE_URL}/api/v1/medicines/all`;
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch all medicines: ${response.status}`);
      }

      const data: BackendAllResponse = await response.json();

      if (data.results && Array.isArray(data.results)) {
        const normalized = data.results.map(normalizeBackendMedicine);
        this.cacheMedicines(normalized);
        return normalized;
      }

      return [];
    } catch (err) {
      console.warn('Error in getAllMedicines, using fallback:', err);
      return [...MOCK_MEDICINES];
    }
  }

  /**
   * Health check for backend availability
   * Calls: GET /api/v1/health
   */
  async checkHealth(): Promise<{ status: string; service?: string }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }
    return await response.json();
  }
}

export const medicineService = new MedicineService();
