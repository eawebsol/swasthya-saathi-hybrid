import { PatientInfo, Vitals, SymptomAssessment } from '../types/medical';

export interface TestPreset {
  id: string;
  label: string;
  badge: 'Critical Emergency' | 'Tuberculosis' | 'Dengue Outbreak' | 'Lab Analysis';
  color: string;
  patient: PatientInfo;
  vitals: Vitals;
  symptoms: SymptomAssessment;
  labText?: string;
  expectedOutcome: string;
}

export const TEST_PRESETS: TestPreset[] = [
  {
    id: 'case_emergency_spo2',
    label: 'Case 1: Severe Hypoxia Red Flag',
    badge: 'Critical Emergency',
    color: 'bg-red-600 text-white',
    patient: {
      name: 'Ramesh Patel',
      age: 62,
      gender: 'male',
      village: 'Rampur Sub-Center',
      phone: '9876543210'
    },
    vitals: {
      temperature: 101.2,
      pulse: 118,
      spo2: 88, // CRITICAL: < 92%
      bpSystolic: 135,
      bpDiastolic: 85,
      respiratoryRate: 28
    },
    symptoms: {
      complaint: 'Difficulty Breathing / Breathlessness',
      duration: '1 day',
      answers: {
        breathing_difficulty: 'yes',
        chest_indrawing: 'yes',
        sweating: 'yes'
      },
      otherNotes: 'Patient unable to complete full sentences due to air hunger.'
    },
    expectedOutcome: 'Bypasses AI processing; triggers instant < 1ms EMERGENCY ambulance referral screen for SpO2 = 88%.'
  },
  {
    id: 'case_tb_screening',
    label: 'Case 2: Chronic Cough & Sputum (TB)',
    badge: 'Tuberculosis',
    color: 'bg-amber-600 text-white',
    patient: {
      name: 'Lakshmi Devi',
      age: 44,
      gender: 'female',
      village: 'Kothapalli Hamlet',
      phone: '9848012345'
    },
    vitals: {
      temperature: 99.4,
      pulse: 78,
      spo2: 97,
      bpSystolic: 120,
      bpDiastolic: 80,
      respiratoryRate: 18
    },
    symptoms: {
      complaint: 'Cold/Cough',
      duration: '> 2 weeks',
      answers: {
        duration: '> 2 weeks',
        evening_fever: 'yes',
        weight_loss: 'yes',
        blood_sputum: 'streaks noticed'
      },
      otherNotes: 'Persistent wet cough with noticeable weight loss over past month.'
    },
    expectedOutcome: 'On-Device RAG retrieves ICMR NTEP protocol; maps to DOTS/NIKSHAY sputum test with warm home care.'
  },
  {
    id: 'case_dengue_fever',
    label: 'Case 3: Acute Fever & Rash (Dengue)',
    badge: 'Dengue Outbreak',
    color: 'bg-blue-600 text-white',
    patient: {
      name: 'Suresh Kumar',
      age: 28,
      gender: 'male',
      village: 'Chandrapur Kiosk',
      phone: '9123456780'
    },
    vitals: {
      temperature: 102.8,
      pulse: 98,
      spo2: 96,
      bpSystolic: 110,
      bpDiastolic: 72,
      respiratoryRate: 20
    },
    symptoms: {
      complaint: 'Fever',
      duration: '3 days',
      answers: {
        rash: 'yes',
        chills: 'yes',
        joint_pain: 'severe',
        stiff_neck: 'no'
      },
      otherNotes: 'High fever, intense retro-orbital headache, body aches, petechial spots on forearm.'
    },
    expectedOutcome: 'Flags Vector-Borne surveillance alert, strictly prohibits NSAIDs, orders NS1/Platelets.'
  },
  {
    id: 'case_lab_cbc_sugar',
    label: 'Case 4: Anemia & High Blood Sugar',
    badge: 'Lab Analysis',
    color: 'bg-purple-600 text-white',
    patient: {
      name: 'Anjali Sharma',
      age: 38,
      gender: 'female',
      village: 'Bhimavaram Colony',
      phone: '9701234567'
    },
    vitals: {
      temperature: 98.6,
      pulse: 74,
      spo2: 98,
      bpSystolic: 130,
      bpDiastolic: 82
    },
    symptoms: {
      complaint: 'General Weakness & Fatigue',
      duration: '2 weeks',
      answers: {
        thirst: 'frequent',
        tiredness: 'extreme'
      }
    },
    labText: `PATIENT DIAGNOSTIC REPORT:
Hemoglobin (Hb): 8.4 g/dL [LOW - Normal: 12.0 - 15.5]
Total Leukocyte Count (WBC): 7,200 /µL [NORMAL]
Platelet Count: 210,000 /µL [NORMAL]
Fasting Blood Sugar (Glucose): 195.0 mg/dL [HIGH - Normal: 70 - 110]
HbA1c: 8.6 % [HIGH - Diabetic range]`,
    expectedOutcome: 'Flags critical microcytic anemia & uncontrolled hyperglycemia; provides local iron & millet nutrition guidance.'
  }
];
