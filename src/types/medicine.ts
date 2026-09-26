export type RegistrationStatus = 'REGISTERED' | 'EXPIRED' | 'SUSPENDED' | 'PROVISIONAL';

export type MedicineSourceType = 'demo' | 'nafdac' | 'medical_reference';

export interface DosageReference {
  general: string;
  administrationNotes: string;
}

export interface SafetyInformation {
  contraindications: string[];
  warnings: string[];
  adverseEffects: string[];
  pregnancyLactation: string;
}

export interface ProductSource {
  name: string;
  url?: string;
  lastUpdated: string;
}

export interface Medicine {
  id: string;
  name: string;
  brandName: string;
  genericName: string;
  activeIngredients: string;
  strength: string;
  dosageForm: string;
  route: string;
  manufacturer: string;
  countryOfOrigin: string;
  nafdacNumber: string;
  nafdacFormattedNumber: string;
  registrationStatus: RegistrationStatus;
  registrationDate: string;
  expiryDate?: string;
  category: string;
  sourceType: MedicineSourceType;
  uses: string[];
  dosageReference: DosageReference;
  safetyInformation: SafetyInformation;
  source: ProductSource;
}

export interface SearchState {
  query: string;
  isLoading: boolean;
  hasSearched: boolean;
  results: Medicine[];
  error: string | null;
}
