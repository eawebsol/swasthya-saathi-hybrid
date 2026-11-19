export type UrgencyLevel = 'EMERGENCY' | 'HIGH' | 'MEDIUM' | 'LOW';

export type SupportedLanguage = 'en' | 'hi' | 'te';

export type UserRole = 'asha' | 'doctor';

export interface Vitals {
  temperature: number; // in Fahrenheit
  pulse: number; // bpm
  spo2: number; // percentage
  bpSystolic: number; // mmHg
  bpDiastolic: number; // mmHg
  respiratoryRate?: number; // breaths per minute
}

export interface EmergencyCheckResult {
  isEmergency: boolean;
  reason: string;
  vitalTriggered?: string;
  recommendedAction: string;
}

export interface PatientInfo {
  id?: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  village: string;
  phone?: string;
}

export interface SymptomAssessment {
  complaint: string;
  duration: string;
  answers: Record<string, string>;
  otherNotes?: string;
}

export interface TriageResult {
  urgency: UrgencyLevel;
  possibleCauses: string[];
  patientGuidance: string;
  ashaNotes: string[];
  medicalSummary: {
    suspectedConditions: string[];
    programTags: string[]; // e.g. "RNTCP/DOTS", "NCD Clinic", "ANC Portal"
    clinicalNotes: string;
  };
  inferenceEngine: 'on_device_gemini_nano' | 'firebase_cloud_gemini' | 'local_protocol_rag';
  latencyMs: number;
  isEmergency: boolean;
  timestamp: string;
}

export interface LabReportResult {
  keyFindings: {
    testName: string;
    value: string;
    status: 'normal' | 'low' | 'high' | 'critical';
    referenceRange?: string;
  }[];
  summary: string;
  dietaryRecommendations: string[];
  lifestyleRecommendations: string[];
  followUp: string;
  inferenceEngine: 'on_device_gemini_nano' | 'firebase_cloud_gemini' | 'local_protocol_rag';
  latencyMs: number;
}

export interface PatientCase {
  id: string;
  timestamp: string;
  patient: PatientInfo;
  vitals: Vitals;
  symptoms: SymptomAssessment;
  triageResult?: TriageResult;
  labResult?: LabReportResult;
  syncedToCloud: boolean;
  offlineCreated: boolean;
}

export interface EpidemicConfig {
  active: boolean;
  diseaseName: string;
  region: string;
  alertMessage: string;
  feverThreshold: number;
  customRules: string[];
}
