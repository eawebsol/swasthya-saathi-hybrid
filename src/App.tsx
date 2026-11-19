import React, { useState, useEffect } from 'react';
import {
  SupportedLanguage,
  UserRole,
  PatientInfo,
  Vitals,
  SymptomAssessment,
  TriageResult,
  LabReportResult,
  PatientCase
} from './types/medical';
import { Header } from './components/Header';
import { HybridInspector } from './components/HybridInspector';
import { PresetBar } from './components/PresetBar';
import { EmergencyBanner } from './components/EmergencyBanner';
import { TriageWorkflow } from './components/TriageWorkflow';
import { TieredReportView } from './components/TieredReportView';
import { LabAnalyzerView } from './components/LabAnalyzerView';
import { DashboardView } from './components/DashboardView';
import { ABBenchmarkView } from './components/ABBenchmarkView';
import { ABVariant } from './config/abTesting';
import { translations } from './data/translations';
import { TEST_PRESETS, TestPreset } from './data/testPresets';
import {
  savePatientCase,
  getLocalCases,
  syncPendingCases,
  subscribeToPatientCases,
  fetchLiveEpidemicConfig,
  ensureAnonymousAuth,
  defaultEpidemicConfig
} from './config/firebase';
import { hybridAiRouter } from './services/hybridAiRouter';
import { Stethoscope, FileText, LayoutDashboard, HeartPulse, SplitSquareVertical } from 'lucide-react';

export const App: React.FC = () => {
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [role, setRole] = useState<UserRole>('asha');
  const [activeTab, setActiveTab] = useState<'triage' | 'lab' | 'dashboard' | 'ab_benchmark'>('triage');
  const [currentVariant, setCurrentVariant] = useState<ABVariant>('variant_a');

  // Network & Hybrid States
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [lastEngine, setLastEngine] = useState<'on_device_gemini_nano' | 'firebase_cloud_gemini' | 'local_protocol_rag'>('on_device_gemini_nano');
  const [lastLatencyMs, setLastLatencyMs] = useState<number>(14);

  // Clinical Data States
  const [patient, setPatient] = useState<PatientInfo>({
    name: 'Ramesh Patel',
    age: 45,
    gender: 'male',
    village: 'Rampur Sub-Center',
    phone: '9876543210'
  });

  const [vitals, setVitals] = useState<Vitals>({
    temperature: 98.6,
    pulse: 76,
    spo2: 98,
    bpSystolic: 120,
    bpDiastolic: 80,
    respiratoryRate: 16
  });

  const [symptoms, setSymptoms] = useState<SymptomAssessment>({
    complaint: 'Cold/Cough',
    duration: '3 days',
    answers: {},
    otherNotes: ''
  });

  const [activeTriageResult, setActiveTriageResult] = useState<TriageResult | null>(null);
  const [emergencyAlert, setEmergencyAlert] = useState<{
    active: boolean;
    reason: string;
    vitalTriggered: string;
    action: string;
  } | null>(null);

  // Case History & Sync
  const [cases, setCases] = useState<PatientCase[]>([]);
  const [isCaseSaved, setIsCaseSaved] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [activePresetId, setActivePresetId] = useState<string | undefined>();
  const [epidemicConfig, setEpidemicConfig] = useState(defaultEpidemicConfig);

  const t = translations[language];

  // Monitor real-world online/offline events, auth, live Remote Config & Firestore sync
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 1. Authenticate anonymously for seamless judge/field access
    ensureAnonymousAuth();

    // 2. Fetch live Remote Config from Firebase Cloud
    fetchLiveEpidemicConfig().then(cfg => {
      setEpidemicConfig(cfg);
    });

    // 3. Real-Time Cloud Firestore Sync Listener
    const unsubscribeCases = subscribeToPatientCases((updatedCases) => {
      setCases(updatedCases);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (unsubscribeCases) unsubscribeCases();
    };
  }, []);

  const toggleSimulatedOffline = () => {
    const nextState = !isSimulatedOffline;
    setIsSimulatedOffline(nextState);
    hybridAiRouter.setSimulatedOffline(nextState);
  };

  const handleSelectPreset = (preset: TestPreset) => {
    setActivePresetId(preset.id);
    setPatient(preset.patient);
    setVitals(preset.vitals);
    setSymptoms(preset.symptoms);
    setActiveTriageResult(null);
    setIsCaseSaved(false);

    if (preset.id === 'case_lab_cbc_sugar') {
      setActiveTab('lab');
      setEmergencyAlert(null);
    } else {
      setActiveTab('triage');
      // If Case 1: Trigger Emergency Screen immediately to show the deterministic gate
      if (preset.id === 'case_emergency_spo2') {
        setEmergencyAlert({
          active: true,
          reason: 'Severe Hypoxemia - Immediate risk of respiratory failure.',
          vitalTriggered: `Oxygen Saturation (SpO2): ${preset.vitals.spo2}%`,
          action: 'Administer emergency high-flow oxygen, keep airway clear, and call 108 Ambulance immediately.'
        });
      } else {
        setEmergencyAlert(null);
      }
    }
  };

  const handleTriageComplete = (result: TriageResult) => {
    setActiveTriageResult(result);
    setLastEngine(result.inferenceEngine);
    setLastLatencyMs(result.latencyMs);
    setIsCaseSaved(false);
  };

  const handleEmergencyTriggered = (reason: string, vitalTriggered: string, action: string) => {
    setEmergencyAlert({
      active: true,
      reason,
      vitalTriggered,
      action
    });
  };

  const handleSaveCurrentCase = async () => {
    if (!activeTriageResult) return;

    const newCase: PatientCase = {
      id: `case_${Date.now()}`,
      timestamp: new Date().toISOString(),
      patient,
      vitals,
      symptoms,
      triageResult: activeTriageResult,
      syncedToCloud: navigator.onLine && !isSimulatedOffline,
      offlineCreated: isSimulatedOffline || !navigator.onLine
    };

    await savePatientCase(newCase);
    setCases(getLocalCases());
    setIsCaseSaved(true);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const count = await syncPendingCases();
      setCases(getLocalCases());
      alert(`Cloud sync complete! ${count} offline cases synced to Firebase Firestore.`);
    } catch (e) {
      console.error('Manual sync failed:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  const pendingSyncCount = cases.filter(c => !c.syncedToCloud).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* 1. Header with Language, Role, Network status */}
      <Header
        language={language}
        setLanguage={setLanguage}
        role={role}
        setRole={setRole}
        isOnline={isOnline}
        isSimulatedOffline={isSimulatedOffline}
        toggleSimulatedOffline={toggleSimulatedOffline}
        pendingSyncCount={pendingSyncCount}
        onSyncClick={handleManualSync}
        isSyncing={isSyncing}
      />

      {/* 2. Hybrid Inspector Live HUD */}
      <HybridInspector
        lastEngine={lastEngine}
        lastLatencyMs={lastLatencyMs}
        isSimulatedOffline={isSimulatedOffline}
        onToggleSimulatedOffline={toggleSimulatedOffline}
      />

      {/* 3. 1-Click Judge Presets Bar */}
      <PresetBar
        onSelectPreset={handleSelectPreset}
        activePresetId={activePresetId}
      />

      {/* 4. Main Navigation & Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('triage')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
              activeTab === 'triage'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>{t.navTriage}</span>
          </button>

          <button
            onClick={() => setActiveTab('lab')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
              activeTab === 'lab'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t.navLabReport}</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
              activeTab === 'dashboard'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{t.navDashboard} ({cases.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ab_benchmark')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
              activeTab === 'ab_benchmark'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200'
            }`}
          >
            <SplitSquareVertical className="w-4 h-4 text-indigo-500" />
            <span>A/B Testing & Benchmark</span>
          </button>
        </div>

        {/* TAB 1: SYMPTOM TRIAGE */}
        {activeTab === 'triage' && (
          <div className="space-y-6">
            
            {/* If Emergency Triggered, Show Full-screen Banner */}
            {emergencyAlert?.active ? (
              <EmergencyBanner
                reason={emergencyAlert.reason}
                vitalTriggered={emergencyAlert.vitalTriggered}
                recommendedAction={emergencyAlert.action}
                language={language}
                onReset={() => setEmergencyAlert(null)}
              />
            ) : (
              <>
                <TriageWorkflow
                  language={language}
                  patient={patient}
                  setPatient={setPatient}
                  vitals={vitals}
                  setVitals={setVitals}
                  symptoms={symptoms}
                  setSymptoms={setSymptoms}
                  onTriageComplete={handleTriageComplete}
                  onEmergencyTriggered={handleEmergencyTriggered}
                />

                {/* 3-Tiered Report Output */}
                {activeTriageResult && (
                  <TieredReportView
                    triage={activeTriageResult}
                    patient={patient}
                    vitals={vitals}
                    language={language}
                    onSaveCase={handleSaveCurrentCase}
                    isSaved={isCaseSaved}
                  />
                )}
              </>
            )}

          </div>
        )}

        {/* TAB 2: LAB REPORT ANALYZER */}
        {activeTab === 'lab' && (
          <LabAnalyzerView
            language={language}
            onAnalysisComplete={(res) => {
              setLastEngine(res.inferenceEngine);
              setLastLatencyMs(res.latencyMs);
            }}
          />
        )}

        {/* TAB 3: FIELD DASHBOARD */}
        {activeTab === 'dashboard' && (
          <DashboardView
            cases={cases}
            language={language}
            role={role}
            epidemicConfig={epidemicConfig}
            onSelectCase={(c) => {
              setPatient(c.patient);
              setVitals(c.vitals);
              setSymptoms(c.symptoms);
              if (c.triageResult) setActiveTriageResult(c.triageResult);
              setActiveTab('triage');
            }}
          />
        )}

        {/* TAB 4: A/B TESTING & DUAL BENCHMARK */}
        {activeTab === 'ab_benchmark' && (
          <ABBenchmarkView
            patient={patient}
            vitals={vitals}
            symptoms={symptoms}
            language={language}
            currentVariant={currentVariant}
            onSetVariant={setCurrentVariant}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-1">
          <p className="font-semibold text-slate-300">
            Swasthya Saathi (Hybrid AI Edition) — Built for Google Firebase #BuildHybridAI 2026 Hackathon
          </p>
          <p className="text-slate-500">
            Empowering ASHA Frontline Workers with On-Device Gemini Nano + Firebase Cloud AI Intelligence.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default App;
