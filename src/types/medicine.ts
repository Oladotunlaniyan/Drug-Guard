export type RegistrationStatus = 'REGISTERED' | 'EXPIRED' | 'SUSPENDED' | 'PROVISIONAL' | 'UNKNOWN';

export type MedicineSourceType = 'demo' | 'nafdac' | 'medical_reference' | 'backend';

export interface DosageReference {
  general?: string;
  administrationNotes?: string;
}

export interface SafetyInformation {
  contraindications?: string[];
  warnings?: string[];
  adverseEffects?: string[];
  pregnancyLactation?: string;
}

export interface ProductSource {
  name: string;
  url?: string;
  lastUpdated?: string;
}

/**
 * Normalized Frontend Medicine representation.
 * Compatible with both backend records (DrugGuard API v1) and fallback reference data.
 */
export interface Medicine {
  id: string;
  name: string;
  brandName?: string;
  genericName?: string;
  activeIngredients: string;
  strength?: string;
  dosageForm?: string;
  route?: string;
  manufacturer?: string;
  countryOfOrigin?: string;
  nafdacNumber?: string;
  nafdacFormattedNumber?: string;
  registrationStatus: RegistrationStatus;
  registrationDate?: string;
  expiryDate?: string;
  category?: string;
  sourceType: MedicineSourceType;
  uses: string[];
  dosageReference: DosageReference;
  safetyInformation: SafetyInformation;
  source: ProductSource;
}

/**
 * Raw Backend Medicine record returned by druggard-backend
 */
export interface BackendMedicineItem {
  id: string;
  productName: string;
  activeIngredients?: string[];
  category?: string;
  form?: string;
  route?: string;
  strength?: string;
  manufacturer?: string;
  nafdacNumber?: string;
  registrationStatus?: string;
  indication?: string;
  dosageReference?: string;
  warnings?: string[];
  sourceUrl?: string;
  dataSource?: string;
  updatedAt?: string;
}

export interface BackendSearchResponse {
  status: 'registered' | 'not_found' | 'error';
  query?: string;
  message?: string;
  results?: BackendMedicineItem[];
}

export interface BackendNafdacResponse {
  status: 'registered' | 'not_found' | 'error';
  nafdacNumber?: string;
  message?: string;
  medicine?: BackendMedicineItem;
  safetyAlerts?: any[];
}

export interface BackendAllResponse {
  status: string;
  count?: number;
  results?: BackendMedicineItem[];
}

export interface SearchState {
  query: string;
  isLoading: boolean;
  hasSearched: boolean;
  results: Medicine[];
  error: string | null;
}
