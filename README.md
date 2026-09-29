# DrugGuard

DrugGuard is a mobile-first public health information web application designed for Nigerians to look up medicines or NAFDAC registration numbers and review structured product specifications, reference indications, dosage references, and safety information.

---

## Core Purpose & Boundaries

DrugGuard is an **educational information utility**, not a doctor, diagnostic tool, prescribing system, pharmacy, or physical verification authority.

### Strict Safety & Legal Boundaries
- **No Authenticity Certification**: Finding a matching registered product record online does **not** certify that a physical carton, blister pack, or batch in hand is genuine or unadulterated.
- **No Counterfeit Determinant**: If a medicine or registration number is not found in the database, it does **not** automatically mean the product is fake or counterfeit. Legitimate products may have newly issued numbers or may not yet be indexed.
- **No Prescriptions or Medical Advice**: DrugGuard provides general reference data from published monographs and regulatory sources. It does not provide personalized dosages or recommend medication intake.
- **No Generative AI Claims**: The frontend never uses AI or LLMs to invent dosages, indications, or warnings. All data is rendered strictly from structured service responses.

---

## Core User Flow

```
Public Landing Page (Equilibrium-inspired Brand System & Visual Monograph)
       │
       ├─────────────────────────────────┐
       ▼                                 ▼
"Check a medicine" / Query       "Scan a medicine" (OCR)
       │                                 │
       ▼                                 ▼
Live Search (medicineService)    Camera / Blister Upload → Confirm
       │                                 │
       └────────────────┬────────────────┘
                        ▼
Matching Results List (Scannable Product Cards)
                        ▼
Medicine Details (Active Ingredients, Strength, Manufacturer, Registration Status, Uses, Dosage Reference, Warnings, Source Provenance, Share Card)
                        ▼
Safety Notices & Pharmacist Verification Guidance
```

---

## Key Features

1. **Brand Identity & Landing Page**:
   - Distinctive visual branding inspired by the modern Equilibrium design system:
     - Warm sage canvas (`#f6f8f4`), deep forest green (`#1b4332`, `#16352a`), mint accent (`#52b788`, `#9bdfb1`), terracotta alert (`#e1775b`), and sage borders (`#dce8dc`).
     - Large expressive display typography (`DM Sans` + `Plus Jakarta Sans`).
     - Minimal glassmorphism navigation with quick actions (*"Check a medicine"*, *"Scan package"*).
     - Product-focused hero featuring interactive DrugGuard monograph cards and floating status badges.
     - Editorial problem statement: *"Medicine information shouldn't be difficult to understand."*
     - 3-Step visual process with oversized numerals (01 Search, 02 Scan, 03 Understand).
     - Interactive product search section with one-click popular Nigerian queries (**P-Alaxin**, **Paracetamol**, **Amoxicillin**, **B4-8892**).
     - Major OCR package scanner showcase with simulated camera reticle and privacy reassurance.
     - Structured monograph section (Uses, Dosage, Safety).
     - Nigerian public health context (*"Designed For Nigeria"*).
     - Trust & boundaries banner: *"Reference information, not personalized medical advice."*
     - Memorable closing brand CTA: *"Have a medicine in front of you? Search it. Scan it. Understand it."*

2. **Search Engine & Live Database**:
   - Prominent search input with instant clear action and seamless back-navigation.
   - Quick one-tap examples: **P-Alaxin**, **Paracetamol**, **Amoxicillin**, and live NAFDAC code **B4-8892**.
   - Connected directly to the deployed backend (`https://druggard-backend.onrender.com`).

2. **OCR Medicine Package Scanner**:
   - Client-side text detection with support for device cameras (rear environment camera) and photo file uploads (cartons or blister packs).
   - Dedicated parser (`ocrParser.ts`) extracting NAFDAC registration numbers and drug names.
   - Complete state handling: *Scanning*, *Processing*, *Text detected*, *No useful text detected*, and *OCR error*.
   - Strict privacy & safety: OCR is purely an input method; images are never stored or uploaded, and scanning does not certify physical authenticity.

2. **Search Results**:
   - Scannable cards displaying Product Name, Active Ingredients, Strength, Dosage Form, Route, Manufacturer, Registration Reference, and Status.
   - Status badge: `"Registered product found"` with distinct status indicators.
   - Data provenance tag (e.g. `Demo Data`).

3. **Medicine Detail View**:
   - Structured product specifications table (Ingredients, Strength, Form, Route, Manufacturer, NAFDAC Number, Registration Date, Status, Data Provenance).
   - **Share medicine** button generating a clean, mobile-optimized information card.
   - Native Web Share API, high-resolution PNG download (`html-to-image`), and formatted plain text copy for WhatsApp and messaging apps.
   - **What is it used for?**: Reference indications supplied by source monographs.
   - **Dosage information**: Standard literature reference accompanied by mandatory notice: *"This is reference information, not personalized medical advice."*
   - **Safety information**: Contraindications, special warnings & precautions, adverse effects, and pregnancy/lactation guidelines.
   - **Source Citation**: Direct attribution to the regulatory or clinical reference source with last-updated date.

4. **No Results Safety State**:
   - Clear educational guidance: *"We couldn't find a matching product in our current database. This does not automatically mean the medicine is counterfeit."*
   - Practical next steps: checking spelling, consulting a licensed community pharmacist, and verifying through official NAFDAC channels.

5. **Safety & Boundaries Guide**:
   - In-app modal detailing statutory boundaries, Mobile Authentication Service (MAS) scratch-and-SMS advice in Nigeria, and physical inspection best practices.

---

## Tech Stack & Architecture

- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Typography**: Clean public-utility hierarchy using *Plus Jakarta Sans* and *IBM Plex Mono*

### Service & Data Architecture

```
src/
├── types/
│   └── medicine.ts          # Strongly typed models: Medicine, DosageReference, SafetyInformation, MedicineSourceType ('demo' | 'nafdac' | 'medical_reference')
├── data/
│   └── mockMedicines.ts     # Reference dataset with explicit demo identifiers (DEMO-*)
├── services/
│   └── medicineService.ts   # Clean abstraction layer for queries; connects to live endpoints when VITE_API_BASE is set
└── components/
    ├── Header.tsx           # Institutional header with navigation & safety modal trigger
    ├── SearchBar.tsx        # Accessible search input with loading states and reset
    ├── QuickExamples.tsx    # Clickable query presets
    ├── SearchResults.tsx    # High-density scannable results list
    ├── MedicineDetail.tsx   # Comprehensive product monograph view
    ├── NoResults.tsx        # Public safety guidance when records are unmatched
    ├── ErrorState.tsx       # Resilient network error & retry component
    ├── SafetyModal.tsx      # Comprehensive educational boundaries modal
    └── Footer.tsx           # Regulatory notice, disclaimer, and official links
```

### Backend API Integration

The UI interacts exclusively through `medicineService`. Configured via `VITE_API_BASE_URL` (defaulting to `https://druggard-backend.onrender.com`):

- `GET /api/v1/health` — Backend health check.
- `GET /api/v1/medicines?q={query}` — Search medicines by brand, active ingredient, or NAFDAC code.
- `GET /api/v1/medicines/all` — Retrieve all available medicine records.
- `GET /api/v1/medicines/nafdac/{nafdacNumber}` — Direct NAFDAC registration lookup.

---

## Development & Setup

### Prerequisites
- Node.js 18+
- pnpm or yarn

### Installation

```bash
# Clone the repository and install dependencies
pnpm install

# Start the local development server (runs on port 3000)
pnpm run dev

# Run TypeScript linting
pnpm run lint

# Build production bundle
pnpm run build
```

---

## Reference & Attribution

Official regulatory oversight of medicines and foods in Nigeria is managed exclusively by the [National Agency for Food and Drug Administration and Control (NAFDAC)](https://www.nafdac.gov.ng) and the [Pharmacy Council of Nigeria (PCN)](https://pcn.gov.ng).
