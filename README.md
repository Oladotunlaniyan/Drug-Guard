## NAFDAC Greenbook Data Integration

DrugGuard uses **NAFDAC's Greenbook** as the primary source for its registered medicine dataset. The NAFDAC Greenbook is Nigeria's public product registration database and contains thousands of registered products across multiple categories:

1. Drugs
2. Vaccines and biologics
3. Veterinary products
4. Medical devices
5. Herbals and nutraceuticals
6. Disinfectants

The Greenbook initially exposes approximately **8,941 total product entries** across these categories. These entries are not all human medicines, so DrugGuard filters the dataset to the relevant registered drug records. The current ingestion process collects approximately **7,443 registered drug records** for the DrugGuard database.

### How DrugGuard Gets the Data

NAFDAC does not provide a public API for its drug registry. Instead, the Greenbook provides a searchable web interface that communicates with NAFDAC's backend whenever a user searches for a product.

During development, DrugGuard's data pipeline was built by inspecting the network requests made by the Greenbook using browser developer tools. This revealed the request used by the Greenbook's own search functionality to retrieve product records.

DrugGuard then uses an automated ingestion script that reproduces this request programmatically. Instead of searching for medicines one at a time through the Greenbook interface, the script retrieves the available records page by page, processes them, and stores the relevant drug records in DrugGuard's own database.

```text
NAFDAC Greenbook
       │
       ▼
Greenbook search request
       │
       ▼
DrugGuard ingestion script
       │
       ├── Fetch records page by page
       ├── Pace requests
       ├── Filter human drug records
       ├── Clean and normalize data
       ├── Remove duplicates
       └── Preserve NAFDAC identifiers
       │
       ▼
DrugGuard MongoDB
       │
       ▼
DrugGuard API
       │
       ▼
DrugGuard Web Application
```

The ingestion script is paced to avoid overwhelming NAFDAC's servers with requests. Each retrieved record is cleaned and normalized before being stored in MongoDB.

This allows DrugGuard to maintain a structured and searchable dataset of registered medicines without manually entering thousands of individual records.

### Why DrugGuard Maintains Its Own Database

DrugGuard does not query the Greenbook manually every time a user searches for a medicine. The collected NAFDAC records are stored in DrugGuard's own MongoDB database and exposed through the DrugGuard API.

```text
NAFDAC Greenbook
       ↓
Data ingestion
       ↓
DrugGuard MongoDB
       ↓
DrugGuard API
       ↓
DrugGuard Web App
       ↓
User
```

This gives DrugGuard a consistent data structure for:

* Medicine search
* NAFDAC registration number lookup
* OCR-based medicine searches
* Medicine detail pages
* Shareable medicine cards
* Product filtering and retrieval

The database also allows DrugGuard to combine NAFDAC registration information with additional reference information without changing the underlying regulatory record.

### Data Scope

The initial Greenbook dataset contains multiple types of regulated products. DrugGuard specifically processes the records relevant to **human pharmaceutical products**.

The approximately 8,941 Greenbook entries therefore do not represent 8,941 medicines in DrugGuard.

After processing and filtering the Greenbook data, approximately **7,443 registered drug records** are stored in the DrugGuard database.

Products belonging to categories such as veterinary products, medical devices, disinfectants, and other non-drug categories are excluded from the core medicine dataset.

### Data Stored by DrugGuard

Each imported medicine record contains structured information obtained from the NAFDAC dataset, including fields such as:

* Product name
* Active ingredient(s)
* Strength
* Dosage form
* Route of administration
* Manufacturer
* NAFDAC registration number
* Registration date
* Registration status
* Product category
* Source information
* Data retrieval information

The NAFDAC registration information is kept separate from additional clinical reference information used by DrugGuard.

Information such as:

* Indications
* Dosage references
* Contraindications
* Warnings
* Precautions
* Adverse effects
* Pregnancy and lactation information

is handled as reference information and is not presented as part of the NAFDAC registration itself.

### Data Provenance

DrugGuard preserves the origin of its regulatory product records.

NAFDAC-sourced records are identified as:

```ts
type MedicineSourceType =
  | "demo"
  | "nafdac_greenbook"
  | "medical_reference";
```

A NAFDAC record can contain provenance information such as:

```ts
{
  source: "nafdac_greenbook",
  nafdacNumber: "...",
  sourceRetrievedAt: "...",
  productCategory: "drug"
}
```

This allows DrugGuard to distinguish between information retrieved from NAFDAC and information obtained from separate medical or clinical reference sources.

### Registration Does Not Mean Physical Authentication

A matching NAFDAC record means that DrugGuard found a corresponding registration record in the dataset. It does **not** mean that DrugGuard has physically inspected or authenticated the medicine in a user's possession.

```text
NAFDAC registration record exists
        ≠
Physical medicine is authentic
```

Likewise:

```text
No DrugGuard result
        ≠
Medicine is counterfeit
```

A medicine may not appear in DrugGuard because of changes to the source registry, data synchronization timing, search differences, incomplete ingestion, or other technical limitations.

DrugGuard therefore presents registration records as **reference information**, not as physical authenticity certification.

### Data Retrieval and Synchronization

DrugGuard's ingestion process retrieves records from the public data flow used by the Greenbook and stores a synchronized copy in MongoDB.

The ingestion process:

* Retrieves records page by page
* Uses controlled request pacing
* Filters the relevant drug category
* Cleans and normalizes records
* Removes duplicate records
* Preserves NAFDAC registration identifiers
* Records source information
* Stores the processed records in MongoDB

Because DrugGuard maintains its own copy of the dataset, the information displayed by DrugGuard represents the state of the data when it was collected and processed.

NAFDAC's Greenbook remains the authoritative regulatory source.

### Expanded Data Architecture

The complete data flow is:

```text
                 ┌──────────────────────┐
                 │    NAFDAC Greenbook  │
                 │                      │
                 │  8,941+ total        │
                 │  product entries     │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │ Greenbook Request    │
                 │ Identified through   │
                 │ browser network      │
                 │ inspection           │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │ DrugGuard Ingestion  │
                 │ Script               │
                 │                      │
                 │ Fetch                │
                 │ Filter               │
                 │ Normalize            │
                 │ Deduplicate          │
                 │ Validate             │
                 └──────────┬───────────┘
                            │
                            │ ~7,443
                            │ drug records
                            ▼
                 ┌──────────────────────┐
                 │      MongoDB         │
                 │ DrugGuard Database   │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │     DrugGuard API    │
                 │                      │
                 │ Search               │
                 │ NAFDAC lookup        │
                 │ Product retrieval    │
                 └──────────┬───────────┘
                            │
                            ▼
              ┌─────────────────────────────┐
              │       DrugGuard Web App     │
              │                             │
              │ Search → Results → Details  │
              │                             │
              │ OCR → Extract → Search      │
              │                             │
              │ Shareable Medicine Card     │
              └─────────────────────────────┘
```

This architecture makes DrugGuard a **search and information layer over NAFDAC registration data**, combining regulatory product records with clearly identified reference information while maintaining a strict distinction between registration status and physical medicine authenticity.