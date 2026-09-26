import { Medicine } from '../types/medicine';
import { MOCK_MEDICINES } from '../data/mockMedicines';

/**
 * Normalizes text for case-insensitive matching.
 */
function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

/**
 * Normalizes NAFDAC identification strings (stripping non-alphanumeric chars).
 */
function normalizeNafdac(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]/gi, '');
}

/**
 * MedicineService layer.
 * 
 * Provides a clean abstraction for medicine queries. The UI interacts solely with
 * this service layer, which is architected to transition to real endpoints:
 *   - GET /api/medicines?q={query}
 *   - GET /api/medicines/nafdac/{number}
 * 
 * If the environment variable VITE_API_BASE is provided or live API mode is enabled,
 * it routes queries to the backend. Otherwise, it searches the demo reference dataset.
 */
class MedicineService {
  private apiBaseUrl: string = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE) || '';

  /**
   * Searches medicines by name, brand, active ingredient, or NAFDAC registration number.
   * 
   * @param query Search query from user
   */
  async searchMedicines(query: string): Promise<Medicine[]> {
    const trimmed = query.trim();
    if (!trimmed) {
      return [];
    }

    if (this.apiBaseUrl) {
      const response = await fetch(`${this.apiBaseUrl}/api/medicines?q=${encodeURIComponent(trimmed)}`);
      if (!response.ok) {
        throw new Error(`Service request failed (${response.status}: ${response.statusText})`);
      }
      return (await response.json()) as Medicine[];
    }

    // Default reference dataset search with simulated network latency
    await new Promise((resolve) => setTimeout(resolve, 280));

    const qNorm = normalizeText(trimmed);
    const qNafdacNorm = normalizeNafdac(trimmed);

    const matches = MOCK_MEDICINES.filter((med) => {
      // 1. Match on NAFDAC number (raw or formatted)
      const medNafdacNorm = normalizeNafdac(med.nafdacNumber);
      const medNafdacFormattedNorm = normalizeNafdac(med.nafdacFormattedNumber);
      if (
        (qNafdacNorm.length >= 2 && (medNafdacNorm.includes(qNafdacNorm) || medNafdacFormattedNorm.includes(qNafdacNorm))) ||
        med.nafdacNumber.toLowerCase().includes(qNorm)
      ) {
        return true;
      }

      // 2. Match on Brand / Product Name
      if (
        med.name.toLowerCase().includes(qNorm) ||
        med.brandName.toLowerCase().includes(qNorm) ||
        med.genericName.toLowerCase().includes(qNorm)
      ) {
        return true;
      }

      // 3. Match on Active Ingredients
      if (med.activeIngredients.toLowerCase().includes(qNorm)) {
        return true;
      }

      // 4. Match on Manufacturer
      if (med.manufacturer.toLowerCase().includes(qNorm)) {
        return true;
      }

      // 5. Match on Category
      if (med.category.toLowerCase().includes(qNorm)) {
        return true;
      }

      return false;
    });

    return matches;
  }

  /**
   * Retrieves a single medicine record by its unique identifier.
   */
  async getMedicineById(id: string): Promise<Medicine | null> {
    if (this.apiBaseUrl) {
      const response = await fetch(`${this.apiBaseUrl}/api/medicines/${encodeURIComponent(id)}`);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error('Failed to retrieve product record');
      return (await response.json()) as Medicine;
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
    const found = MOCK_MEDICINES.find((med) => med.id === id);
    return found || null;
  }

  /**
   * Retrieves a medicine record directly by its NAFDAC registration number.
   * Maps to future GET /api/medicines/nafdac/{number}
   */
  async getMedicineByNafdac(nafdacNumber: string): Promise<Medicine | null> {
    const trimmed = nafdacNumber.trim();
    if (!trimmed) return null;

    if (this.apiBaseUrl) {
      const response = await fetch(`${this.apiBaseUrl}/api/medicines/nafdac/${encodeURIComponent(trimmed)}`);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error('Failed to query NAFDAC registration number');
      return (await response.json()) as Medicine;
    }

    await new Promise((resolve) => setTimeout(resolve, 150));

    const qNafdac = normalizeNafdac(trimmed);
    const found = MOCK_MEDICINES.find((med) => {
      return (
        normalizeNafdac(med.nafdacNumber) === qNafdac ||
        normalizeNafdac(med.nafdacFormattedNumber).includes(qNafdac)
      );
    });

    return found || null;
  }

  /**
   * Retrieves all reference medicines (for index/catalogue purposes).
   */
  async getAllReferenceMedicines(): Promise<Medicine[]> {
    if (this.apiBaseUrl) {
      const response = await fetch(`${this.apiBaseUrl}/api/medicines`);
      if (!response.ok) throw new Error('Failed to list medicines');
      return (await response.json()) as Medicine[];
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
    return [...MOCK_MEDICINES];
  }
}

export const medicineService = new MedicineService();
