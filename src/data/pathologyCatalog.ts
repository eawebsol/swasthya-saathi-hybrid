export interface PathologyTestBenchmark {
  parameter: string;
  aliases: string[];
  unit: string;
  normalRange: string;
  lowThreshold?: number;
  criticalLow?: number;
  highThreshold?: number;
  criticalHigh?: number;
  qualitativeAlerts?: Record<string, 'normal' | 'low' | 'high' | 'critical'>;
  clinicalSignificance: string;
}

export interface PathologyProfileDefinition {
  id: string;
  name: string;
  code: string;
  description: string;
  parameters: PathologyTestBenchmark[];
  sampleReportText: string;
  dietaryGuidelines: string[];
  lifestyleGuidelines: string[];
}

export const PATHOLOGY_PROFILES: Record<string, PathologyProfileDefinition> = {
  cbp: {
    id: 'cbp',
    name: 'Complete Blood Picture (CBP / CBC)',
    code: 'CBP',
    description: 'Comprehensive hematological assessment of cellular blood elements for anemia, infection, and clotting.',
    sampleReportText: `COMPLETE BLOOD PICTURE (CBP / CBC):
Hemoglobin (Hb): 8.4 g/dL [LOW - Anemia]
Total Leukocyte Count (WBC): 12,400 /µL [HIGH - Bacterial infection]
Neutrophils: 76 % [HIGH]
Lymphocytes: 18 % [LOW]
Eosinophils: 4 % [NORMAL]
Platelet Count: 85,000 /µL [LOW - Thrombocytopenia / Dengue warning]
RBC Count: 3.2 million/µL [LOW]
Packed Cell Volume (PCV): 27.5 % [LOW]
MCV: 72.0 fL [LOW - Microcytic]
MCH: 23.5 pg [LOW - Hypochromic]
MCHC: 30.5 g/dL [LOW]
ESR: 42 mm/hr [CRITICAL HIGH - Active inflammation]`,
    parameters: [
      {
        parameter: 'Hemoglobin (Hb)',
        aliases: ['hemoglobin', 'hb'],
        unit: 'g/dL',
        normalRange: '12.0 - 15.5 g/dL',
        lowThreshold: 11.0,
        criticalLow: 8.0,
        highThreshold: 17.5,
        clinicalSignificance: 'Oxygen-carrying capacity. Low levels indicate microcytic/macrocytic anemia.'
      },
      {
        parameter: 'Total Leukocyte Count (WBC / TLC)',
        aliases: ['total leukocyte', 'wbc', 'tlc', 'white blood cells'],
        unit: '/µL',
        normalRange: '4,000 - 11,000 /µL',
        lowThreshold: 4000,
        highThreshold: 11000,
        criticalHigh: 18000,
        clinicalSignificance: 'Immune defense. High indicates acute bacterial infection, sepsis, or inflammation.'
      },
      {
        parameter: 'Platelet Count',
        aliases: ['platelet', 'platelets', 'plt count', 'platelet count'],
        unit: '/µL',
        normalRange: '150,000 - 450,000 /µL',
        lowThreshold: 100000,
        criticalLow: 50000,
        highThreshold: 450000,
        clinicalSignificance: 'Blood clotting. Crucial for Dengue surveillance and bleeding risk.'
      },
      {
        parameter: 'RBC Count',
        aliases: ['rbc', 'red blood cell', 'rbc count'],
        unit: 'million/µL',
        normalRange: '4.0 - 5.5 million/µL',
        lowThreshold: 3.8,
        highThreshold: 5.8,
        clinicalSignificance: 'Red cell mass. Low indicates anemia; high indicates polycythemia or chronic hypoxia.'
      },
      {
        parameter: 'Packed Cell Volume (PCV / Hematocrit)',
        aliases: ['pcv', 'hematocrit', 'packed cell volume'],
        unit: '%',
        normalRange: '36.0 - 48.0 %',
        lowThreshold: 36.0,
        criticalLow: 25.0,
        highThreshold: 50.0,
        clinicalSignificance: 'Proportion of red cells in blood. High indicates hemoconcentration in Dengue shock.'
      },
      {
        parameter: 'MCV (Mean Corpuscular Volume)',
        aliases: ['mcv', 'mean corpuscular volume'],
        unit: 'fL',
        normalRange: '80.0 - 100.0 fL',
        lowThreshold: 80.0,
        highThreshold: 100.0,
        clinicalSignificance: 'Red cell size. Low (< 80) indicates Iron Deficiency; high (> 100) indicates B12/Folate deficiency.'
      },
      {
        parameter: 'ESR (Erythrocyte Sed. Rate)',
        aliases: ['esr', 'erythrocyte sedimentation rate'],
        unit: 'mm/hr',
        normalRange: '0 - 20 mm/hr',
        highThreshold: 20.0,
        criticalHigh: 40.0,
        clinicalSignificance: 'Non-specific marker for Tuberculosis, chronic infections, or autoimmune flare.'
      },
      {
        parameter: 'Neutrophils',
        aliases: ['neutrophils', 'neutrophil'],
        unit: '%',
        normalRange: '40 - 70 %',
        highThreshold: 70.0,
        lowThreshold: 40.0,
        clinicalSignificance: 'High levels indicate acute bacterial infection or tissue necrosis.'
      },
      {
        parameter: 'Lymphocytes',
        aliases: ['lymphocytes', 'lymphocyte'],
        unit: '%',
        normalRange: '20 - 40 %',
        highThreshold: 40.0,
        lowThreshold: 20.0,
        clinicalSignificance: 'High levels indicate viral infection (e.g. viral fever, typhoid, tuberculosis).'
      },
      {
        parameter: 'Eosinophils',
        aliases: ['eosinophils', 'eosinophil'],
        unit: '%',
        normalRange: '1 - 6 %',
        highThreshold: 6.0,
        criticalHigh: 15.0,
        clinicalSignificance: 'High indicates allergic conditions, asthma, or intestinal parasitic worms.'
      }
    ],
    dietaryGuidelines: [
      'Anemia Management: Consume iron-rich foods including green leafy vegetables (Palak, Methi), jaggery (Gud), black chana, and pomegranates.',
      'Enhance iron absorption: Eat Vitamin C-rich fruits like amla, lemon, and oranges with meals.',
      'Avoid drinking strong tea or coffee within 1 hour of meals, as tannins block iron absorption.'
    ],
    lifestyleGuidelines: [
      'Take daily Iron-Folic Acid (IFA) tablets under the Anemia Mukt Bharat program as directed by ASHA worker.',
      'If platelets are below 100,000, practice strict bed rest under a mosquito net and report any petechial rash immediately.',
      'Regular bi-annual deworming with Albendazole (400mg) to prevent helminthic blood loss.'
    ]
  },

  cue: {
    id: 'cue',
    name: 'Complete Urine Examination (CUE)',
    code: 'CUE',
    description: 'Physicochemical and microscopic urinalysis for renal pathology, UTIs, and maternal pre-eclampsia.',
    sampleReportText: `COMPLETE URINE EXAMINATION (CUE):
Color: Pale Yellow
Appearance: Slightly Turbid
Reaction (pH): 6.0 [NORMAL]
Specific Gravity: 1.020 [NORMAL]
Urine Albumin / Protein: 2+ [HIGH - Proteinuria alert]
Urine Sugar / Glucose: Trace [MILD]
Pus Cells (Leukocytes): 12-15 /HPF [HIGH - Urinary Tract Infection]
RBCs in Urine: 4-6 /HPF [HIGH - Microscopic Hematuria]
Epithelial Cells: 6-8 /HPF [MODERATE]
Bile Salts: Negative
Bile Pigments: Negative
Casts: Granular Casts 1-2 /LPF [ALERT]`,
    parameters: [
      {
        parameter: 'Urine Albumin / Protein',
        aliases: ['urine albumin', 'albumin', 'protein in urine', 'urine protein'],
        unit: 'grade',
        normalRange: 'Nil / Negative',
        qualitativeAlerts: {
          'nil': 'normal',
          'negative': 'normal',
          'trace': 'low',
          '1+': 'high',
          '2+': 'critical',
          '3+': 'critical',
          '4+': 'critical'
        },
        clinicalSignificance: 'Presence indicates nephrotic syndrome, glomerulonephritis, or Pre-Eclampsia in pregnancy.'
      },
      {
        parameter: 'Urine Sugar / Glucose',
        aliases: ['urine sugar', 'sugar in urine', 'urine glucose'],
        unit: 'grade',
        normalRange: 'Nil / Negative',
        qualitativeAlerts: {
          'nil': 'normal',
          'negative': 'normal',
          'trace': 'low',
          'present': 'high',
          '1+': 'high',
          '2+': 'high',
          '3+': 'critical',
          '4+': 'critical'
        },
        clinicalSignificance: 'Glycosuria occurs when blood glucose exceeds the renal threshold (> 180 mg/dL).'
      },
      {
        parameter: 'Pus Cells (Leukocytes in Urine)',
        aliases: ['pus cells', 'leukocytes in urine', 'wbc in urine', 'pus cells/hpf'],
        unit: '/HPF',
        normalRange: '0 - 5 /HPF',
        highThreshold: 5.0,
        criticalHigh: 20.0,
        clinicalSignificance: 'Pyuria: Elevation (> 5/HPF) strongly indicates Urinary Tract Infection (UTI) or Cystitis.'
      },
      {
        parameter: 'RBCs in Urine (Hematuria)',
        aliases: ['rbcs in urine', 'rbc in urine', 'red blood cells in urine', 'rbcs/hpf'],
        unit: '/HPF',
        normalRange: 'Nil / 0 - 2 /HPF',
        highThreshold: 2.0,
        criticalHigh: 10.0,
        clinicalSignificance: 'Microscopic hematuria indicates urinary calculi (kidney stones), nephritis, or trauma.'
      },
      {
        parameter: 'Urine Specific Gravity',
        aliases: ['specific gravity', 'sp gravity', 'sp. gr.'],
        unit: 'ratio',
        normalRange: '1.010 - 1.025',
        lowThreshold: 1.010,
        highThreshold: 1.025,
        clinicalSignificance: 'Kidney concentrating ability. Low indicates diabetes insipidus or renal failure.'
      },
      {
        parameter: 'Urine Reaction (pH)',
        aliases: ['urine reaction', 'reaction (ph)', 'urine ph', 'ph'],
        unit: 'pH',
        normalRange: '4.8 - 7.5',
        lowThreshold: 4.8,
        highThreshold: 7.5,
        clinicalSignificance: 'Acidic urine favors uric acid stones; alkaline urine favors phosphate stones.'
      }
    ],
    dietaryGuidelines: [
      'Hydration Therapy: Drink 3 to 4 liters of clean boiled water daily to flush the urinary tract.',
      'Consume barley water and unsweetened lemon water to maintain natural urinary alkalization.',
      'Restrict excess sodium, spicy curries, and sour pickles if experiencing burning micturition.'
    ],
    lifestyleGuidelines: [
      'Maintain strict personal perineal hygiene to prevent ascending urinary bacterial infections.',
      'Pregnant women with 2+ or 3+ urine albumin require immediate PHC Medical Officer referral to rule out Pre-Eclampsia.',
      'Complete the full 5-day antibiotic course prescribed by the medical officer for UTI; do not stop early.'
    ]
  },

  lipid: {
    id: 'lipid',
    name: 'Lipid Profile',
    code: 'LIPID',
    description: 'Cardiovascular risk stratification measuring serum cholesterols, triglycerides, and atherogenic lipoproteins.',
    sampleReportText: `FASTING LIPID PROFILE:
Total Cholesterol: 248.0 mg/dL [HIGH - Cardiovascular risk]
HDL Cholesterol (Good): 34.0 mg/dL [LOW - Inadequate protective factor]
LDL Cholesterol (Bad): 162.0 mg/dL [HIGH - Atherogenic factor]
VLDL Cholesterol: 42.0 mg/dL [HIGH]
Serum Triglycerides: 215.0 mg/dL [HIGH]
Total Cholesterol / HDL Ratio: 7.29 [HIGH - Risk ratio > 4.5]`,
    parameters: [
      {
        parameter: 'Total Cholesterol',
        aliases: ['total cholesterol', 'cholesterol'],
        unit: 'mg/dL',
        normalRange: '< 200 mg/dL',
        highThreshold: 200.0,
        criticalHigh: 240.0,
        clinicalSignificance: 'Hypercholesterolemia accelerates coronary artery plaque formation.'
      },
      {
        parameter: 'HDL Cholesterol (Good Cholesterol)',
        aliases: ['hdl cholesterol', 'hdl', 'high density lipoprotein'],
        unit: 'mg/dL',
        normalRange: '≥ 40 mg/dL',
        lowThreshold: 40.0,
        clinicalSignificance: 'Cardioprotective lipoprotein. Low levels (< 40 mg/dL) significantly increase heart attack risk.'
      },
      {
        parameter: 'LDL Cholesterol (Bad Cholesterol)',
        aliases: ['ldl cholesterol', 'ldl', 'low density lipoprotein'],
        unit: 'mg/dL',
        normalRange: '< 100 mg/dL',
        highThreshold: 100.0,
        criticalHigh: 160.0,
        clinicalSignificance: 'Primary atherogenic lipoprotein. High levels deposit lipid plaques in coronary vessels.'
      },
      {
        parameter: 'Serum Triglycerides',
        aliases: ['serum triglycerides', 'triglycerides', 'triglyceride', 'tg'],
        unit: 'mg/dL',
        normalRange: '< 150 mg/dL',
        highThreshold: 150.0,
        criticalHigh: 200.0,
        clinicalSignificance: 'Storage fat in circulation. High levels indicate metabolic syndrome and fatty liver.'
      },
      {
        parameter: 'Total / HDL Cholesterol Ratio',
        aliases: ['cholesterol / hdl ratio', 'total/hdl ratio', 'chol/hdl ratio'],
        unit: 'ratio',
        normalRange: '< 4.5',
        highThreshold: 4.5,
        criticalHigh: 6.0,
        clinicalSignificance: 'Atherogenic index. Higher ratios indicate elevated 10-year ischemic heart disease risk.'
      }
    ],
    dietaryGuidelines: [
      'Eliminate vanaspati, dalda, palm oil, and deep-fried road snacks (samosas, pakoras).',
      'Use cold-pressed mustard oil, groundnut oil, or sunflower oil in strict moderation (less than 15ml per person daily).',
      'Incorporate raw crushed garlic pods, fenugreek seeds (Methi), and fiber-dense millets into daily diet.'
    ],
    lifestyleGuidelines: [
      'Brisk aerobic walking for at least 45 minutes, 5 days per week, to naturally elevate HDL (good cholesterol).',
      'Zero tobacco: Total cessation of smoking and bidi use to prevent accelerated arterial endothelial damage.',
      'Enroll in the National NCD Clinic (NPCDCS) at the Primary Health Center for lipid monitoring.'
    ]
  },

  lft: {
    id: 'lft',
    name: 'Liver Function Test (LFT)',
    code: 'LFT',
    description: 'Biochemical panel evaluating hepatic synthesis, biliary excretion, and hepatocellular injury.',
    sampleReportText: `LIVER FUNCTION TEST (LFT):
Total Bilirubin: 3.4 mg/dL [CRITICAL HIGH - Visible Jaundice / Icterus]
Direct (Conjugated) Bilirubin: 2.1 mg/dL [HIGH - Biliary/Hepatic stasis]
Indirect Bilirubin: 1.3 mg/dL [HIGH - Hemolysis / Hepatic uptake]
SGPT / ALT: 185.0 U/L [CRITICAL HIGH - Acute hepatocellular injury]
SGOT / AST: 142.0 U/L [HIGH - Hepatocellular injury]
Alkaline Phosphatase (ALP): 210.0 U/L [HIGH - Biliary duct obstruction]
Total Protein: 6.8 g/dL [NORMAL]
Serum Albumin: 3.2 g/dL [LOW - Chronic hepatic impairment]
Serum Globulin: 3.6 g/dL [HIGH]
A/G Ratio: 0.89 [REVERSED - Albumin/Globulin ratio inverted]`,
    parameters: [
      {
        parameter: 'Total Bilirubin',
        aliases: ['total bilirubin', 'bilirubin total', 's. bilirubin'],
        unit: 'mg/dL',
        normalRange: '0.2 - 1.2 mg/dL',
        highThreshold: 1.2,
        criticalHigh: 2.5,
        clinicalSignificance: 'Jaundice marker. Scleral icterus becomes clinically visible when Bilirubin > 2.5 mg/dL.'
      },
      {
        parameter: 'Direct (Conjugated) Bilirubin',
        aliases: ['direct bilirubin', 'conjugated bilirubin'],
        unit: 'mg/dL',
        normalRange: '0.0 - 0.3 mg/dL',
        highThreshold: 0.3,
        criticalHigh: 1.0,
        clinicalSignificance: 'High levels indicate biliary obstruction, viral hepatitis, or cholestasis.'
      },
      {
        parameter: 'SGPT / ALT',
        aliases: ['sgpt', 'alt', 'alanine aminotransferase'],
        unit: 'U/L',
        normalRange: '7 - 45 U/L',
        highThreshold: 45.0,
        criticalHigh: 120.0,
        clinicalSignificance: 'Liver-specific enzyme. Dramatic elevations indicate viral hepatitis, alcohol injury, or drug toxicity.'
      },
      {
        parameter: 'SGOT / AST',
        aliases: ['sgot', 'ast', 'aspartate aminotransferase'],
        unit: 'U/L',
        normalRange: '8 - 40 U/L',
        highThreshold: 40.0,
        criticalHigh: 100.0,
        clinicalSignificance: 'Intracellular enzyme present in liver and myocardium. High AST:ALT > 2 suggests alcoholic hepatitis.'
      },
      {
        parameter: 'Alkaline Phosphatase (ALP)',
        aliases: ['alkaline phosphatase', 'alp', 's. alp'],
        unit: 'U/L',
        normalRange: '30 - 120 U/L',
        highThreshold: 120.0,
        criticalHigh: 250.0,
        clinicalSignificance: 'Biliary epithelium marker. Elevated in biliary stone obstruction, stricture, or bone pathology.'
      },
      {
        parameter: 'Serum Albumin',
        aliases: ['serum albumin', 's. albumin', 'albumin'],
        unit: 'g/dL',
        normalRange: '3.5 - 5.0 g/dL',
        lowThreshold: 3.5,
        criticalLow: 2.5,
        clinicalSignificance: 'Hepatic synthetic function. Low levels indicate chronic cirrhosis, ascites, or severe protein malnutrition.'
      },
      {
        parameter: 'A/G Ratio',
        aliases: ['a/g ratio', 'albumin globulin ratio', 'ag ratio'],
        unit: 'ratio',
        normalRange: '1.2 - 2.2',
        lowThreshold: 1.2,
        criticalLow: 1.0,
        clinicalSignificance: 'Inverted A/G ratio (< 1.0) is a classic hallmark of chronic liver cirrhosis or multiple myeloma.'
      }
    ],
    dietaryGuidelines: [
      'High-carbohydrate, easily digestible bland diet: rice gruel (kanji), boiled potatoes, and fresh sugarcane juice from clean sources.',
      'Strictly avoid all oily, fatty, spicy foods and commercial packaged condiments that strain hepatic metabolism.',
      'Ensure complete protein intake through boiled pulses and curds as tolerated; do NOT starve.'
    ],
    lifestyleGuidelines: [
      'TOTAL ALCOHOL ABSTINENCE: Absolute prohibition of arrack, toddy, beer, or spirits.',
      'Caution with medications: Do NOT take paracetamol above 2g/day or unverified herbal powders which cause drug-induced liver injury.',
      'Immediate referral to Medical Officer for Hepatitis B/C viral serology and abdominal ultrasound.'
    ]
  },

  rft: {
    id: 'rft',
    name: 'Renal Function Test (RFT / KFT)',
    code: 'RFT',
    description: 'Evaluation of glomerular filtration, nitrogenous waste excretion, and serum electrolyte equilibrium.',
    sampleReportText: `RENAL FUNCTION TEST (RFT / KFT):
Serum Creatinine: 2.4 mg/dL [CRITICAL HIGH - Acute Renal Impairment]
Blood Urea: 78.0 mg/dL [HIGH - Azotemia / Uremic toxicity]
Blood Urea Nitrogen (BUN): 36.4 mg/dL [HIGH]
Serum Uric Acid: 8.6 mg/dL [HIGH - Hyperuricemia]
Serum Sodium (Na+): 131.0 mEq/L [LOW - Hyponatremia]
Serum Potassium (K+): 5.4 mEq/L [HIGH - Hyperkalemia warning]
Serum Chloride: 98.0 mEq/L [NORMAL]`,
    parameters: [
      {
        parameter: 'Serum Creatinine',
        aliases: ['serum creatinine', 'creatinine', 's. creatinine'],
        unit: 'mg/dL',
        normalRange: '0.6 - 1.2 mg/dL',
        highThreshold: 1.2,
        criticalHigh: 2.0,
        lowThreshold: 0.5,
        clinicalSignificance: 'Gold standard for kidney filtration. Values ≥ 2.0 indicate Acute Kidney Injury (AKI) or CKD.'
      },
      {
        parameter: 'Blood Urea',
        aliases: ['blood urea', 'urea', 's. urea'],
        unit: 'mg/dL',
        normalRange: '15.0 - 40.0 mg/dL',
        highThreshold: 40.0,
        criticalHigh: 80.0,
        clinicalSignificance: 'End product of protein metabolism. Elevated in dehydration, gastrointestinal bleeding, or renal failure.'
      },
      {
        parameter: 'Blood Urea Nitrogen (BUN)',
        aliases: ['blood urea nitrogen', 'bun'],
        unit: 'mg/dL',
        normalRange: '7.0 - 20.0 mg/dL',
        highThreshold: 20.0,
        criticalHigh: 40.0,
        clinicalSignificance: 'Measures nitrogen portion of urea. BUN:Creatinine ratio > 20 suggests prerenal azotemia.'
      },
      {
        parameter: 'Serum Uric Acid',
        aliases: ['serum uric acid', 'uric acid', 's. uric acid'],
        unit: 'mg/dL',
        normalRange: '3.5 - 7.2 mg/dL',
        highThreshold: 7.2,
        criticalHigh: 9.0,
        clinicalSignificance: 'Purine metabolite. High levels cause painful gouty arthritis and uric acid renal calculi.'
      },
      {
        parameter: 'Serum Potassium (K+)',
        aliases: ['serum potassium', 'potassium', 'k+'],
        unit: 'mEq/L',
        normalRange: '3.5 - 5.0 mEq/L',
        lowThreshold: 3.5,
        criticalLow: 2.8,
        highThreshold: 5.0,
        criticalHigh: 5.5,
        clinicalSignificance: 'CRITICAL CARDIAC ELECTROLYTE. Hyperkalemia (> 5.5 mEq/L) can cause fatal cardiac arrest.'
      },
      {
        parameter: 'Serum Sodium (Na+)',
        aliases: ['serum sodium', 'sodium', 'na+'],
        unit: 'mEq/L',
        normalRange: '135.0 - 145.0 mEq/L',
        lowThreshold: 135.0,
        criticalLow: 125.0,
        highThreshold: 145.0,
        criticalHigh: 155.0,
        clinicalSignificance: 'Osmolality regulator. Hyponatremia (< 130) causes confusion, lethargy, and seizures.'
      }
    ],
    dietaryGuidelines: [
      'Sodium Restriction: Strictly avoid table salt, papad, pickles, and salty packaged chips to control fluid retention.',
      'Potassium Caution: If Potassium is high, avoid coconut water, citrus fruits, bananas, and tomato soups.',
      'Maintain daily urine output log and balance fluid intake (typically 500ml + previous day urine output in renal insufficiency).'
    ],
    lifestyleGuidelines: [
      'STRICT PROHIBITION OF NSAID PAINKILLERS: Never take Diclofenac, Ibuprofen (Brufen), or Combiflam without doctor approval.',
      'Immediate hospital referral if urine volume decreases drastically (< 400ml in 24 hours) or face/ankle swelling develops.',
      'Check blood pressure daily; unmanaged hypertension accelerates glomerulosclerosis and chronic renal failure.'
    ]
  },

  diabetic: {
    id: 'diabetic',
    name: 'Diabetic Profile',
    code: 'DIAB',
    description: 'Glycemic monitoring combining acute blood glucose with longitudinal 3-month HbA1c hemoglobin glycation.',
    sampleReportText: `COMPREHENSIVE DIABETIC PROFILE:
Fasting Blood Sugar (FBS): 192.0 mg/dL [CRITICAL HIGH - Hyperglycemia]
Postprandial Blood Sugar (PPBS): 285.0 mg/dL [CRITICAL HIGH - Marked glucose excursion]
Random Blood Sugar (RBS): 240.0 mg/dL [HIGH]
HbA1c (Glycated Hemoglobin): 9.4 % [CRITICAL HIGH - Very poor glycemic control]
Estimated Average Glucose (eAG): 223.0 mg/dL [HIGH]`,
    parameters: [
      {
        parameter: 'Fasting Blood Sugar (FBS)',
        aliases: ['fasting blood sugar', 'fasting glucose', 'fbs', 'sugar fasting'],
        unit: 'mg/dL',
        normalRange: '70.0 - 100.0 mg/dL',
        highThreshold: 100.0,
        criticalHigh: 180.0,
        lowThreshold: 70.0,
        criticalLow: 54.0,
        clinicalSignificance: 'Basal glucose. Fasting values ≥ 126 mg/dL on two occasions diagnostic for Diabetes Mellitus.'
      },
      {
        parameter: 'Postprandial Blood Sugar (PPBS)',
        aliases: ['postprandial blood sugar', 'postprandial glucose', 'ppbs', 'sugar postprandial', '2hr pp'],
        unit: 'mg/dL',
        normalRange: '< 140.0 mg/dL',
        highThreshold: 140.0,
        criticalHigh: 200.0,
        clinicalSignificance: 'Post-meal glucose spike. Values ≥ 200 mg/dL confirm Diabetes Mellitus.'
      },
      {
        parameter: 'HbA1c (Glycated Hemoglobin)',
        aliases: ['hba1c', 'glycated hemoglobin', 'glycosylated hemoglobin'],
        unit: '%',
        normalRange: '< 5.7 %',
        highThreshold: 5.7,
        criticalHigh: 8.0,
        clinicalSignificance: '3-month average glucose. ≥ 6.5% is diagnostic; ≥ 8.0% indicates high risk for diabetic retinopathy & nephropathy.'
      },
      {
        parameter: 'Estimated Average Glucose (eAG)',
        aliases: ['estimated average glucose', 'eag', 'average glucose'],
        unit: 'mg/dL',
        normalRange: '< 126.0 mg/dL',
        highThreshold: 126.0,
        criticalHigh: 183.0,
        clinicalSignificance: 'Mathematical correlation of HbA1c to daily average blood glucose levels.'
      }
    ],
    dietaryGuidelines: [
      'Eliminate all refined white sugar, sweets, jaggery (Gud), honey, and sugary tea.',
      'Replace polished white rice with traditional low-glycemic millets (Jowar, Bajra, Ragi, Foxtail millet) and whole wheat.',
      'Eat two large portions of green vegetables and sprouted green gram (Moong) daily.'
    ],
    lifestyleGuidelines: [
      'Daily 30–45 minutes of brisk walking, preferably 15 minutes after main meals to blunt postprandial glucose surges.',
      'Daily foot care inspection: Check feet daily for cuts, blisters, or numbness (peripheral diabetic neuropathy).',
      'Annual diabetic retinal eye checkup and urine microalbumin testing to protect against microvascular blindness and kidney failure.'
    ]
  },

  thyroid: {
    id: 'thyroid',
    name: 'Thyroid Profile (TFT)',
    code: 'TFT',
    description: 'Evaluation of hypothalamic-pituitary-thyroid axis measuring thyrotropin and circulating thyroid hormones.',
    sampleReportText: `THYROID FUNCTION PROFILE:
TSH (Thyroid Stimulating Hormone): 9.8 µIU/mL [HIGH - Primary Hypothyroidism alert]
Total T3 (Triiodothyronine): 65.0 ng/dL [LOW]
Total T4 (Thyroxine): 3.8 µg/dL [LOW]
Free T3 (FT3): 1.9 pg/mL [LOW]
Free T4 (FT4): 0.6 ng/dL [LOW]`,
    parameters: [
      {
        parameter: 'TSH (Thyrotropin)',
        aliases: ['tsh', 'thyroid stimulating hormone', 's. tsh'],
        unit: 'µIU/mL',
        normalRange: '0.40 - 4.50 µIU/mL',
        lowThreshold: 0.40,
        criticalLow: 0.10,
        highThreshold: 4.50,
        criticalHigh: 10.0,
        clinicalSignificance: 'Most sensitive marker. High TSH (> 4.5) indicates Hypothyroidism; Low TSH (< 0.4) indicates Hyperthyroidism.'
      },
      {
        parameter: 'Total T3 (Triiodothyronine)',
        aliases: ['total t3', 't3', 'triiodothyronine'],
        unit: 'ng/dL',
        normalRange: '80.0 - 200.0 ng/dL',
        lowThreshold: 80.0,
        highThreshold: 200.0,
        clinicalSignificance: 'Active circulating metabolic hormone. Elevated in thyrotoxicosis/Graves disease; low in advanced hypothyroidism.'
      },
      {
        parameter: 'Total T4 (Thyroxine)',
        aliases: ['total t4', 't4', 'thyroxine'],
        unit: 'µg/dL',
        normalRange: '4.5 - 12.0 µg/dL',
        lowThreshold: 4.5,
        highThreshold: 12.0,
        clinicalSignificance: 'Primary prohormone synthesized by thyroid gland.'
      },
      {
        parameter: 'Free T4 (FT4)',
        aliases: ['free t4', 'ft4', 'free thyroxine'],
        unit: 'ng/dL',
        normalRange: '0.80 - 1.80 ng/dL',
        lowThreshold: 0.80,
        highThreshold: 1.80,
        clinicalSignificance: 'Unbound bioactive thyroxine, unaffected by pregnancy or protein-binding changes.'
      },
      {
        parameter: 'Free T3 (FT3)',
        aliases: ['free t3', 'ft3'],
        unit: 'pg/mL',
        normalRange: '2.30 - 4.20 pg/mL',
        lowThreshold: 2.30,
        highThreshold: 4.20,
        clinicalSignificance: 'Unbound triiodothyronine.'
      }
    ],
    dietaryGuidelines: [
      'Ensure daily use of iodized salt (FSSAI fortified) stored in closed airtight containers away from heat.',
      'If diagnosed with Hypothyroidism, avoid excessive consumption of raw goitrogenic vegetables (cabbage, cauliflower) unless well-cooked.',
      'Maintain balanced protein intake with legumes, eggs, and dairy to support thyroid hormone transport proteins.'
    ],
    lifestyleGuidelines: [
      'Levothyroxine Administration Rule: If prescribed Thyroxine by doctor, take it empty stomach immediately upon waking with plain water, 45 minutes before tea or breakfast.',
      'Pregnant women must screen TSH during first trimester (target TSH < 2.5 µIU/mL) to ensure normal fetal brain development.',
      'Re-check TSH every 6–8 weeks after any dose adjustment of thyroid medications.'
    ]
  }
};
