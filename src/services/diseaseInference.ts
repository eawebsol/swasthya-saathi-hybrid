import { SymptomAssessment, Vitals } from '../types/medical';

export interface DiseaseInferenceOutput {
  suspectedConditions: string[];
  programTags: string[];
  clinicalSummary: string;
}

export function inferDiseasePatterns(
  complaint: string,
  conditionAnswers: Record<string, string>,
  otherNotes: string = '',
  age: number,
  vitals?: Vitals
): DiseaseInferenceOutput {
  const text = `${complaint} ${otherNotes}`.toLowerCase();
  const answers: Record<string, string> = {};
  for (const [k, v] of Object.entries(conditionAnswers)) {
    answers[k.toLowerCase()] = String(v).toLowerCase();
  }

  const suspected: string[] = [];
  const programTags: Set<string> = new Set();

  // 1. Respiratory
  if (complaint.includes('Cough') || complaint.includes('Cold')) {
    if (answers['duration'] === '> 2 weeks' || text.includes('weight loss') || text.includes('evening fever')) {
      suspected.push('Tuberculosis (TB) - Sputum microscopy / CBNAAT recommended');
      programTags.add('NTEP / NIKSHAY (DOTS)');
    }
    if (answers['breathing_difficulty'] === 'yes' || (vitals && vitals.spo2 < 94)) {
      suspected.push('Pneumonia / Acute Respiratory Infection (ARI)');
      programTags.add('National Health Mission (NHM)');
    }
    if (age < 5) {
      suspected.push('Childhood Pneumonia / Bronchiolitis');
      programTags.add('IMNCI');
    }
  }

  // 2. Fever & Vector-borne
  if (complaint.includes('Fever')) {
    if (answers['rash'] === 'yes' || text.includes('joint pain') || text.includes('retro-orbital')) {
      suspected.push('Dengue / Chikungunya - Order Platelets & NS1 Antigen');
      programTags.add('NVBDCP (Vector Borne)');
    }
    if (answers['chills'] === 'yes' || answers['rigors'] === 'yes') {
      suspected.push('Malaria / Enteric Fever (Typhoid) - Order Peripheral Smear / Widal');
      programTags.add('NVBDCP (Vector Borne)');
    }
    if (answers['stiff_neck'] === 'yes' || answers['photophobia'] === 'yes') {
      suspected.push('Meningitis / Encephalitis - Urgent PHC Referral');
      programTags.add('Emergency Medical Care');
    }
  }

  // 3. Cardiovascular
  if (complaint.includes('Chest Pain')) {
    if (answers['sweating'] === 'yes' || answers['radiating'] === 'yes' || answers['tightness'] === 'yes') {
      suspected.push('Acute Coronary Syndrome (ACS) / Myocardial Infarction');
      programTags.add('NPCDCS (Cardiovascular)');
    }
    if (age > 50) {
      suspected.push('Coronary Artery Disease risk - Order 12-lead ECG');
      programTags.add('NPCDCS');
    }
  }

  // 4. Gastrointestinal
  if (complaint.includes('Stomach') || complaint.includes('Diarrhea')) {
    if (answers['blood_stool'] === 'yes') {
      suspected.push('Gastrointestinal Bleeding / Acute Dysentery');
      programTags.add('Infectious Disease Surveillance');
    }
    if (age < 5) {
      suspected.push('Severe Pediatric Dehydration risk - Immediate ORS & Zinc');
      programTags.add('IDCF / Child Health');
    }
  }

  // 5. Maternal
  if (answers['pregnant'] === 'yes' || text.includes('pregnant')) {
    if (vitals && (vitals.bpSystolic >= 140 || vitals.bpDiastolic >= 90)) {
      suspected.push('Gestational Hypertension / Pre-Eclampsia - Urgent Maternal Care');
      programTags.add('PMSMA / JSY');
    } else {
      suspected.push('Antenatal Care (ANC) Monitoring');
      programTags.add('PMSMA / RCH Portal');
    }
  }

  // 6. NCD Screening (Diabetes / Hypertension)
  if (age >= 30) {
    if (text.includes('sugar') || text.includes('thirst') || text.includes('frequent urination')) {
      suspected.push('Diabetes Mellitus - Fasting & Postprandial Blood Sugar check');
      programTags.add('NCD Clinic (NPCDCS)');
    }
    if (vitals && (vitals.bpSystolic >= 140 || vitals.bpDiastolic >= 90)) {
      suspected.push('Hypertension - Stage 1/2. Lifestyle intervention & Amlodipine evaluation');
      programTags.add('NCD Clinic (NPCDCS)');
    }
  }

  if (suspected.length === 0) {
    suspected.push('Non-specific Acute Illness - Symptomatic treatment & observation');
    programTags.add('Primary Health Center (PHC)');
  }

  const clinicalSummary = `Patient presented with primary complaint of "${complaint}" (Duration: ${answers['duration'] || 'unspecified'}). ` +
    `Clinical pattern analysis identified ${suspected.length} priority differential conditions. ` +
    `Appropriate for linkage with ${Array.from(programTags).join(', ')}.`;

  return {
    suspectedConditions: suspected,
    programTags: Array.from(programTags),
    clinicalSummary
  };
}
