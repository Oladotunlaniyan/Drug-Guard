import { Medicine } from '../types/medicine';

export const MOCK_MEDICINES: Medicine[] = [
  {
    id: 'med-p-alaxin',
    name: 'P-Alaxin (Dihydroartemisinin / Piperaquine)',
    brandName: 'P-Alaxin',
    genericName: 'Dihydroartemisinin + Piperaquine Phosphate',
    activeIngredients: 'Dihydroartemisinin (40mg), Piperaquine Phosphate (320mg)',
    strength: '40mg / 320mg',
    dosageForm: 'Film-coated Tablet',
    route: 'Oral',
    manufacturer: 'Bliss GVS Pharma Ltd. / Greenlife Pharmaceuticals Ltd. (Demo Reference)',
    countryOfOrigin: 'Nigeria / India',
    nafdacNumber: 'DEMO-04-7493',
    nafdacFormattedNumber: 'DEMO-04-7493 (Demo Reference)',
    registrationStatus: 'REGISTERED',
    registrationDate: '2019-06-18',
    expiryDate: '2027-06-17',
    category: 'Antimalarial (Artemisinin-based Combination Therapy - ACT)',
    sourceType: 'demo',
    uses: [
      'Treatment of acute uncomplicated Plasmodium falciparum malaria in adults and children weighing 5 kg or more.',
      'Educational reference: Recognized in antimalarial treatment guidelines as a first-line artemisinin-based combination.'
    ],
    dosageReference: {
      general: 'Standard reference course from literature: Once daily over 3 consecutive days, taken at approximately 0h, 24h, and 48h according to patient weight band.',
      administrationNotes: 'Reference literature suggests taking with water, separated by approximately 3 hours from meals.'
    },
    safetyInformation: {
      contraindications: [
        'Documented hypersensitivity to dihydroartemisinin, piperaquine, or other artemisinin derivatives.',
        'Patients with congenital QT prolongation or known family history of arrhythmias.'
      ],
      warnings: [
        'Reference literature notes potential concentration-dependent QTc prolongation associated with piperaquine.',
        'Not indicated for malaria prevention (prophylaxis) or for severe complicated malaria requiring emergency intravenous care.',
        'Full 3-day regimen should be completed as prescribed by a licensed healthcare professional.'
      ],
      adverseEffects: [
        'Reported in clinical literature: headache, dizziness, asthenia',
        'Gastrointestinal symptoms (nausea, abdominal discomfort, diarrhea)'
      ],
      pregnancyLactation: 'Contraindicated during the first trimester in published guidelines unless no alternative exists. Requires direct clinical supervision in second and third trimesters.'
    },
    source: {
      name: 'WHO Malaria Guidelines & National Treatment Reference (Demo Summary)',
      url: 'https://www.nafdac.gov.ng',
      lastUpdated: '2024-08-15'
    }
  },
  {
    id: 'med-paracetamol',
    name: 'Paracetamol 500mg Tablets (Demo)',
    brandName: 'Paracetamol 500mg',
    genericName: 'Paracetamol (Acetaminophen)',
    activeIngredients: 'Paracetamol (500mg)',
    strength: '500mg',
    dosageForm: 'Compressed Tablet',
    route: 'Oral',
    manufacturer: 'Reference Pharmaceutical Manufacturer (Demo Reference)',
    countryOfOrigin: 'Nigeria',
    nafdacNumber: 'DEMO-01-0024',
    nafdacFormattedNumber: 'DEMO-01-0024 (Demo Reference)',
    registrationStatus: 'REGISTERED',
    registrationDate: '2015-03-12',
    expiryDate: '2028-03-11',
    category: 'Analgesic & Antipyretic',
    sourceType: 'demo',
    uses: [
      'Temporary relief of mild to moderate pain (such as headache, toothache, or musculoskeletal discomfort).',
      'Symptomatic reduction of fever.'
    ],
    dosageReference: {
      general: 'Standard reference guideline: 500mg to 1000mg every 4 to 6 hours as needed. Do not exceed 4000mg (4g) in any 24-hour period for adults.',
      administrationNotes: 'Do not combine with other over-the-counter remedies that also contain paracetamol to avoid unintentional overdose.'
    },
    safetyInformation: {
      contraindications: [
        'Known severe hypersensitivity to paracetamol.',
        'Severe acute active hepatic disease or liver failure.'
      ],
      warnings: [
        'Liver toxicity risk if the maximum recommended daily dose is exceeded or when consumed with alcoholic drinks.',
        'Consult a doctor or pharmacist if fever persists for more than 3 days or pain persists for more than 5 days.',
        'Keep out of reach of young children.'
      ],
      adverseEffects: [
        'Infrequent at recommended therapeutic amounts: mild skin reaction or rash',
        'Acute overdose risk: severe hepatic and renal damage'
      ],
      pregnancyLactation: 'Published reference consensus considers short-term use at lowest effective dose acceptable during pregnancy and lactation.'
    },
    source: {
      name: 'British Pharmacopoeia Reference Monograph (Demo Summary)',
      url: 'https://www.nafdac.gov.ng',
      lastUpdated: '2024-06-20'
    }
  },
  {
    id: 'med-amoxicillin',
    name: 'Amoxicillin 500mg Capsules (Demo)',
    brandName: 'Amoxicillin Trihydrate',
    genericName: 'Amoxicillin Trihydrate',
    activeIngredients: 'Amoxicillin Trihydrate equivalent to Amoxicillin (500mg)',
    strength: '500mg',
    dosageForm: 'Hard Gelatin Capsule',
    route: 'Oral',
    manufacturer: 'Reference Pharmaceutical Manufacturer (Demo Reference)',
    countryOfOrigin: 'Nigeria',
    nafdacNumber: 'DEMO-04-1219',
    nafdacFormattedNumber: 'DEMO-04-1219 (Demo Reference)',
    registrationStatus: 'REGISTERED',
    registrationDate: '2018-11-04',
    expiryDate: '2026-11-03',
    category: 'Antibacterial (Aminopenicillin Beta-lactam)',
    sourceType: 'demo',
    uses: [
      'Treatment of confirmed or strongly suspected susceptible bacterial infections (e.g. respiratory tract, ear/nose/throat, urinary tract).',
      'Educational reference: Antibacterial agent requiring a valid doctor or dentist prescription.'
    ],
    dosageReference: {
      general: 'Standard adult literature reference: 250mg to 500mg every 8 hours (or 500mg to 875mg every 12 hours) depending on infection type and prescriber directions.',
      administrationNotes: 'Must be completed for the entire duration prescribed by a licensed healthcare practitioner to prevent antimicrobial resistance.'
    },
    safetyInformation: {
      contraindications: [
        'Known history of serious allergy (such as anaphylaxis or severe rash) to amoxicillin or any penicillin antibiotic.',
        'History of amoxicillin-associated liver dysfunction.'
      ],
      warnings: [
        'Prescription medicine only: inappropriate use contributes to antimicrobial resistance (AMR).',
        'Discontinue and seek immediate medical assistance if rash, facial swelling, or breathing difficulty develops.',
        'Potential cross-allergy in individuals with cephalosporin sensitivities.'
      ],
      adverseEffects: [
        'Gastrointestinal effects (loose stools, diarrhea, nausea)',
        'Cutaneous hypersensitivity rash',
        'Superficial fungal overgrowth (candidiasis)'
      ],
      pregnancyLactation: 'Category B in standard references. Used when indicated under medical supervision; small amounts pass into breast milk.'
    },
    source: {
      name: 'WHO Model Formulary Reference Monograph (Demo Summary)',
      url: 'https://www.nafdac.gov.ng',
      lastUpdated: '2024-05-10'
    }
  },
  {
    id: 'med-lonart-ds',
    name: 'Lonart DS Tablets (Demo)',
    brandName: 'Lonart DS',
    genericName: 'Artemether + Lumefantrine',
    activeIngredients: 'Artemether (80mg), Lumefantrine (480mg)',
    strength: '80mg / 480mg',
    dosageForm: 'Tablet',
    route: 'Oral',
    manufacturer: 'Reference Manufacturer (Demo Reference)',
    countryOfOrigin: 'Nigeria / India',
    nafdacNumber: 'DEMO-B4-2190',
    nafdacFormattedNumber: 'DEMO-B4-2190 (Demo Reference)',
    registrationStatus: 'REGISTERED',
    registrationDate: '2020-04-15',
    expiryDate: '2027-04-14',
    category: 'Antimalarial (Artemisinin-based Combination Therapy - ACT)',
    sourceType: 'demo',
    uses: [
      'Treatment of acute uncomplicated malaria caused by Plasmodium falciparum in patients meeting weight criteria.'
    ],
    dosageReference: {
      general: 'Standard adult 6-dose schedule taken across a 60-hour total period (at 0, 8, 24, 36, 48, and 60 hours) under professional healthcare direction.',
      administrationNotes: 'Literature recommends administering with a meal or drink containing dietary fat to support lumefantrine absorption.'
    },
    safetyInformation: {
      contraindications: [
        'Hypersensitivity to artemether or lumefantrine.',
        'Severe hepatic or renal insufficiency.'
      ],
      warnings: [
        'Not intended for malaria prevention.',
        'If vomiting occurs shortly after taking a dose, consult a healthcare provider for instructions.',
        'Check concurrent medications for potential metabolic enzyme interactions.'
      ],
      adverseEffects: [
        'Headache, dizziness, sleep disturbances',
        'Abdominal pain, nausea, loss of appetite'
      ],
      pregnancyLactation: 'Use in first trimester is restricted unless deemed necessary by a physician; permitted in second and third trimesters under licensed medical care.'
    },
    source: {
      name: 'Reference Antimalarial Standard Treatment Guidelines (Demo Summary)',
      url: 'https://www.nafdac.gov.ng',
      lastUpdated: '2024-07-01'
    }
  },
  {
    id: 'med-coartem',
    name: 'Coartem 80/480 Tablets (Demo)',
    brandName: 'Coartem',
    genericName: 'Artemether + Lumefantrine',
    activeIngredients: 'Artemether (80mg), Lumefantrine (480mg)',
    strength: '80mg / 480mg',
    dosageForm: 'Tablet',
    route: 'Oral',
    manufacturer: 'Reference Manufacturer (Demo Reference)',
    countryOfOrigin: 'Switzerland',
    nafdacNumber: 'DEMO-04-8921',
    nafdacFormattedNumber: 'DEMO-04-8921 (Demo Reference)',
    registrationStatus: 'REGISTERED',
    registrationDate: '2017-09-10',
    expiryDate: '2027-09-09',
    category: 'Antimalarial (Artemisinin-based Combination Therapy - ACT)',
    sourceType: 'demo',
    uses: [
      'Treatment of acute uncomplicated Plasmodium falciparum malaria in adults and children.'
    ],
    dosageReference: {
      general: 'Standard 6-dose regimen over 3 consecutive days adjusted by patient weight category as directed by a healthcare professional.',
      administrationNotes: 'Reference instructions advise taking with food or milk containing fat.'
    },
    safetyInformation: {
      contraindications: [
        'Hypersensitivity to active ingredients or excipients.',
        'Patients with congenital long QT syndrome.'
      ],
      warnings: [
        'Not indicated for severe or cerebral malaria requiring parenteral treatment.',
        'Complete the full prescribed 6-dose schedule without early discontinuation.'
      ],
      adverseEffects: [
        'Mild headache, dizziness, palpitations',
        'Gastrointestinal upset (nausea, vomiting)'
      ],
      pregnancyLactation: 'Clinical evaluation required during pregnancy in accordance with official national treatment guidelines.'
    },
    source: {
      name: 'WHO Prequalified Product Public Assessment Report (Demo Summary)',
      url: 'https://www.nafdac.gov.ng',
      lastUpdated: '2024-09-01'
    }
  },
  {
    id: 'med-ciprofloxacin',
    name: 'Ciprofloxacin 500mg Tablets (Demo)',
    brandName: 'Ciprofloxacin 500mg',
    genericName: 'Ciprofloxacin Hydrochloride',
    activeIngredients: 'Ciprofloxacin Hydrochloride equivalent to Ciprofloxacin (500mg)',
    strength: '500mg',
    dosageForm: 'Film-coated Tablet',
    route: 'Oral',
    manufacturer: 'Reference Manufacturer (Demo Reference)',
    countryOfOrigin: 'Nigeria',
    nafdacNumber: 'DEMO-A4-5612',
    nafdacFormattedNumber: 'DEMO-A4-5612 (Demo Reference)',
    registrationStatus: 'REGISTERED',
    registrationDate: '2016-08-22',
    expiryDate: '2026-08-21',
    category: 'Antibacterial (Fluoroquinolone)',
    sourceType: 'demo',
    uses: [
      'Treatment of specific documented bacterial infections when prescribed by a medical doctor.'
    ],
    dosageReference: {
      general: 'Standard adult literature reference: 250mg to 750mg every 12 hours based on infection site, severity, and medical prescriber judgment.',
      administrationNotes: 'Take with ample fluids. Literature notes dairy products, antacids, or mineral supplements reduce absorption when taken together.'
    },
    safetyInformation: {
      contraindications: [
        'Hypersensitivity to ciprofloxacin or other fluoroquinolones.',
        'Concomitant use with tizanidine.'
      ],
      warnings: [
        'Reference literature highlights risks of tendinitis, tendon rupture, and peripheral neuropathy associated with fluoroquinolones.',
        'Prescription-only medicine: do not use without medical diagnosis.',
        'Avoid excessive direct sunlight due to photosensitivity.'
      ],
      adverseEffects: [
        'Nausea, diarrhea, abdominal cramps',
        'Headache, lightheadedness, sleep difficulty'
      ],
      pregnancyLactation: 'Generally avoided during pregnancy and breastfeeding in standard reference literature due to risk of cartilage damage in developing joints.'
    },
    source: {
      name: 'British National Formulary Reference Monograph (Demo Summary)',
      url: 'https://www.nafdac.gov.ng',
      lastUpdated: '2024-04-18'
    }
  },
  {
    id: 'med-metronidazole',
    name: 'Metronidazole 200mg Tablets (Demo)',
    brandName: 'Metronidazole 200mg',
    genericName: 'Metronidazole',
    activeIngredients: 'Metronidazole (200mg)',
    strength: '200mg',
    dosageForm: 'Uncoated Tablet',
    route: 'Oral',
    manufacturer: 'Reference Manufacturer (Demo Reference)',
    countryOfOrigin: 'Nigeria',
    nafdacNumber: 'DEMO-01-3814',
    nafdacFormattedNumber: 'DEMO-01-3814 (Demo Reference)',
    registrationStatus: 'REGISTERED',
    registrationDate: '2014-05-19',
    expiryDate: '2028-05-18',
    category: 'Antiprotozoal & Anaerobic Antibacterial (Nitroimidazole)',
    sourceType: 'demo',
    uses: [
      'Treatment of diagnosed anaerobic bacterial and protozoal infections (such as amoebiasis, giardiasis, trichomoniasis) under prescription.'
    ],
    dosageReference: {
      general: 'Standard literature reference: 200mg to 400mg every 8 hours for 5 to 10 days according to condition and prescriber determination.',
      administrationNotes: 'Literature advises taking during or after meals with water.'
    },
    safetyInformation: {
      contraindications: [
        'Documented hypersensitivity to metronidazole or nitroimidazoles.',
        'First trimester of pregnancy in trichomoniasis.'
      ],
      warnings: [
        'Avoid all alcohol during treatment and for at least 48 hours after concluding, due to adverse disulfiram-like interactions (nausea, vomiting, flushing).',
        'Use under medical guidance in individuals with central nervous system disorders.'
      ],
      adverseEffects: [
        'Metallic taste, appetite loss',
        'Gastrointestinal discomfort, transient darkening of urine'
      ],
      pregnancyLactation: 'Avoid in first trimester in reference guidance; use in second/third trimesters only under physician supervision.'
    },
    source: {
      name: 'WHO Model Formulary Reference Monograph (Demo Summary)',
      url: 'https://www.nafdac.gov.ng',
      lastUpdated: '2024-03-15'
    }
  }
];
