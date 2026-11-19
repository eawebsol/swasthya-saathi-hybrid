import React, { useState } from 'react';
import { Vitals, PatientInfo, SymptomAssessment, SupportedLanguage, TriageResult } from '../types/medical';
import { translations } from '../data/translations';
import { evaluateEmergencyVitals } from '../services/deterministicSafety';
import { hybridAiRouter } from '../services/hybridAiRouter';
import { Activity, Heart, Thermometer, Wind, User, Mic, ArrowRight, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

interface TriageWorkflowProps {
  language: SupportedLanguage;
  patient: PatientInfo;
  setPatient: React.Dispatch<React.SetStateAction<PatientInfo>>;
  vitals: Vitals;
  setVitals: React.Dispatch<React.SetStateAction<Vitals>>;
  symptoms: SymptomAssessment;
  setSymptoms: React.Dispatch<React.SetStateAction<SymptomAssessment>>;
  onTriageComplete: (result: TriageResult) => void;
  onEmergencyTriggered: (reason: string, vitalTriggered: string, action: string) => void;
}

export const TriageWorkflow: React.FC<TriageWorkflowProps> = ({
  language,
  patient,
  setPatient,
  vitals,
  setVitals,
  symptoms,
  setSymptoms,
  onTriageComplete,
  onEmergencyTriggered
}) => {
  const t = translations[language];
  const [currentStage, setCurrentStage] = useState<1 | 2>(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // 15-Second Breath Tap Timer Tool for ASHA Workers
  const [breathTimerActive, setBreathTimerActive] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  const [breathSecondsLeft, setBreathSecondsLeft] = useState(15);
  const [showBreathTool, setShowBreathTool] = useState(false);

  React.useEffect(() => {
    let interval: any = null;
    if (breathTimerActive && breathSecondsLeft > 0) {
      interval = setInterval(() => {
        setBreathSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (breathTimerActive && breathSecondsLeft === 0) {
      setBreathTimerActive(false);
      const calculatedBpm = breathCount * 4;
      setVitals(prev => ({ ...prev, respiratoryRate: calculatedBpm }));
      alert(`⏱️ Breath Timer Complete!\nRecorded: ${breathCount} breaths in 15 seconds × 4 = ${calculatedBpm} breaths/min.`);
    }
    return () => clearInterval(interval);
  }, [breathTimerActive, breathSecondsLeft, breathCount, setVitals]);

  const startBreathTimer = () => {
    setBreathCount(0);
    setBreathSecondsLeft(15);
    setBreathTimerActive(true);
  };

  // Common rural complaints
  const complaintOptions = [
    'Fever',
    'Cold/Cough',
    'Chest Pain',
    'Difficulty Breathing',
    'Stomach Pain / Diarrhea',
    'Vomiting',
    'Severe Headache',
    'Pregnancy Related',
    'General Weakness / Fatigue'
  ];

  // Evaluate vitals as user types
  const emergencyCheck = evaluateEmergencyVitals(vitals);

  const handleStage1Next = () => {
    if (emergencyCheck.isEmergency) {
      onEmergencyTriggered(
        emergencyCheck.reason,
        emergencyCheck.vitalTriggered || 'Critical Vitals',
        emergencyCheck.recommendedAction
      );
      return;
    }
    setCurrentStage(2);
  };

  const handleSymptomAnswerChange = (key: string, value: string) => {
    setSymptoms(prev => ({
      ...prev,
      answers: { ...prev.answers, [key]: value }
    }));
  };

  // Speech Recognition (Voice Dictation for ASHA)
  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please type notes.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const lower = transcript.toLowerCase();
      
      // Natural speech intent mapping (English, Hindi, Telugu)
      let detectedComplaint: string | null = null;
      if (lower.includes('fever') || lower.includes('बुखार') || lower.includes('ज्वर') || lower.includes('జ్వరం')) {
        detectedComplaint = 'Acute Fever / Chills';
      } else if (lower.includes('cough') || lower.includes('cold') || lower.includes('खांसी') || lower.includes('दग्गु') || lower.includes('దగ్గు')) {
        detectedComplaint = 'Cold/Cough';
      } else if (lower.includes('chest') || lower.includes('सीना') || lower.includes('छाती') || lower.includes('గుండె') || lower.includes('छाती')) {
        detectedComplaint = 'Chest Discomfort / Breathlessness';
      } else if (lower.includes('diarrhea') || lower.includes('loose motion') || lower.includes('दस्त') || lower.includes('విరేచనాలు')) {
        detectedComplaint = 'Severe Diarrhea / Dehydration';
      } else if (lower.includes('pregnancy') || lower.includes('delivery') || lower.includes('गर्भवती') || lower.includes('గర్భిణీ')) {
        detectedComplaint = 'Maternal Health & Pregnancy';
      }

      setSymptoms(prev => ({
        ...prev,
        complaint: detectedComplaint || prev.complaint,
        otherNotes: prev.otherNotes ? `${prev.otherNotes} | [Voice]: ${transcript}` : `[Voice]: ${transcript}`
      }));
    };

    recognition.start();
  };

  const handleRunTriage = async () => {
    setIsAnalyzing(true);
    try {
      const result = await hybridAiRouter.executeTriage(
        patient.name || 'Anonymous Patient',
        patient.age || 35,
        vitals,
        symptoms,
        language
      );
      onTriageComplete(result);
    } catch (err) {
      console.error('Triage execution failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Workflow Tabs Header */}
      <div className="border-b border-slate-200 bg-slate-50/70 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentStage(1)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 ${
              currentStage === 1
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">1</span>
            <span>{t.stage1Title}</span>
          </button>

          <ArrowRight className="w-4 h-4 text-slate-400" />

          <button
            onClick={() => setCurrentStage(2)}
            disabled={emergencyCheck.isEmergency}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 ${
              currentStage === 2
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 disabled:opacity-40'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">2</span>
            <span>{t.stage2Title}</span>
          </button>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-200/80 text-slate-700 hidden md:block">
          Step {currentStage} of 2
        </span>
      </div>

      <div className="p-6">

        {/* STAGE 1: PATIENT DEMOGRAPHICS & VITALS */}
        {currentStage === 1 && (
          <div className="space-y-6">
            
            {/* Patient Demographics */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <User className="w-4 h-4 text-sky-600" />
                <span>{t.patientDetails}</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">{t.patientName}</label>
                  <input
                    type="text"
                    value={patient.name}
                    onChange={(e) => setPatient(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Sunita Devi"
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">{t.age}</label>
                  <input
                    type="number"
                    value={patient.age || ''}
                    onChange={(e) => setPatient(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                    placeholder="e.g. 32"
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">{t.gender}</label>
                  <select
                    value={patient.gender}
                    onChange={(e) => {
                      const newGender = e.target.value as 'male' | 'female' | 'other';
                      setPatient(prev => ({ ...prev, gender: newGender }));
                      if (newGender !== 'female') {
                        handleSymptomAnswerChange('pregnant', 'no');
                      }
                    }}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="female">{t.female}</option>
                    <option value="male">{t.male}</option>
                    <option value="other">{t.other}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">{t.village}</label>
                  <input
                    type="text"
                    value={patient.village}
                    onChange={(e) => setPatient(prev => ({ ...prev, village: e.target.value }))}
                    placeholder="e.g. Rampur"
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Vital Signs Grid */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>{t.vitalsSection}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                
                {/* SpO2 */}
                <div className={`p-4 rounded-xl border transition ${
                  vitals.spo2 > 0 && vitals.spo2 < 92
                    ? 'bg-red-50 border-red-400 ring-2 ring-red-400/50'
                    : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center justify-between text-slate-600 mb-1">
                    <span className="text-xs font-semibold">{t.spo2}</span>
                    <Wind className={`w-4 h-4 ${vitals.spo2 > 0 && vitals.spo2 < 92 ? 'text-red-500' : 'text-sky-500'}`} />
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <input
                      type="number"
                      value={vitals.spo2 || ''}
                      onChange={(e) => setVitals(prev => ({ ...prev, spo2: parseFloat(e.target.value) || 0 }))}
                      placeholder="98"
                      className="text-2xl font-black w-24 text-slate-900 focus:outline-none"
                    />
                    <span className="text-xs text-slate-500">%</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Normal: 95 - 100%</span>
                </div>

                {/* Body Temperature */}
                <div className={`p-4 rounded-xl border transition ${
                  vitals.temperature >= 104.0 || (vitals.temperature > 0 && vitals.temperature < 95.0)
                    ? 'bg-red-50 border-red-400 ring-2 ring-red-400/50'
                    : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center justify-between text-slate-600 mb-1">
                    <span className="text-xs font-semibold">{t.temperature}</span>
                    <Thermometer className={`w-4 h-4 ${vitals.temperature >= 104 || (vitals.temperature > 0 && vitals.temperature < 95.0) ? 'text-red-500' : 'text-amber-500'}`} />
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <input
                      type="number"
                      step="0.1"
                      value={vitals.temperature || ''}
                      onChange={(e) => setVitals(prev => ({ ...prev, temperature: parseFloat(e.target.value) || 0 }))}
                      placeholder="98.6"
                      className="text-2xl font-black w-24 text-slate-900 focus:outline-none"
                    />
                    <span className="text-xs text-slate-500">°F</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Normal: 97 - 99°F</span>
                </div>

                {/* Pulse */}
                <div className={`p-4 rounded-xl border transition ${
                  vitals.pulse >= 130 || (vitals.pulse > 0 && vitals.pulse < 45)
                    ? 'bg-red-50 border-red-400 ring-2 ring-red-400/50'
                    : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center justify-between text-slate-600 mb-1">
                    <span className="text-xs font-semibold">{t.pulse}</span>
                    <Heart className="w-4 h-4 text-rose-500" />
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <input
                      type="number"
                      value={vitals.pulse || ''}
                      onChange={(e) => setVitals(prev => ({ ...prev, pulse: parseInt(e.target.value) || 0 }))}
                      placeholder="72"
                      className="text-2xl font-black w-24 text-slate-900 focus:outline-none"
                    />
                    <span className="text-xs text-slate-500">bpm</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Normal: 60 - 100 bpm</span>
                </div>

                {/* Blood Pressure */}
                <div className={`p-4 rounded-xl border transition ${
                  vitals.bpSystolic >= 180 || vitals.bpDiastolic >= 120 || (vitals.bpSystolic > 0 && vitals.bpSystolic < 80)
                    ? 'bg-red-50 border-red-400 ring-2 ring-red-400/50'
                    : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center justify-between text-slate-600 mb-1">
                    <span className="text-xs font-semibold">BP (Sys / Dia)</span>
                    <Activity className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <input
                      type="number"
                      value={vitals.bpSystolic || ''}
                      onChange={(e) => setVitals(prev => ({ ...prev, bpSystolic: parseInt(e.target.value) || 0 }))}
                      placeholder="120"
                      className="text-2xl font-black w-12 text-slate-900 focus:outline-none"
                    />
                    <span className="text-slate-400 font-bold">/</span>
                    <input
                      type="number"
                      value={vitals.bpDiastolic || ''}
                      onChange={(e) => setVitals(prev => ({ ...prev, bpDiastolic: parseInt(e.target.value) || 0 }))}
                      placeholder="80"
                      className="text-2xl font-black w-12 text-slate-900 focus:outline-none"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400">Normal: 120/80 mmHg</span>
                </div>

                {/* Respiratory Rate (Breaths / min) */}
                <div className={`p-4 rounded-xl border transition ${
                  vitals.respiratoryRate && (vitals.respiratoryRate >= 36 || vitals.respiratoryRate <= 8)
                    ? 'bg-red-50 border-red-400 ring-2 ring-red-400/50'
                    : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center justify-between text-slate-600 mb-1">
                    <span className="text-xs font-semibold">Resp. Rate (RR)</span>
                    <Wind className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <input
                      type="number"
                      value={vitals.respiratoryRate || ''}
                      onChange={(e) => setVitals(prev => ({ ...prev, respiratoryRate: parseInt(e.target.value) || 0 }))}
                      placeholder="18"
                      className="text-2xl font-black w-16 text-slate-900 focus:outline-none"
                    />
                    <span className="text-xs text-slate-500">bpm</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-slate-400">12-20 bpm</span>
                    <button
                      type="button"
                      onClick={() => setShowBreathTool(!showBreathTool)}
                      className="text-[10px] font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200"
                    >
                      ⏱️ Timer
                    </button>
                  </div>
                </div>

              </div>

              {/* 15-Second Breath Tap Timer Tool Drawer */}
              {showBreathTool && (
                <div className="mt-4 p-4 rounded-xl bg-teal-50/90 border border-teal-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div>
                    <strong className="text-teal-900 font-bold block text-sm flex items-center gap-1.5">
                      <span>⏱️ ASHA Breath Rate Assistant (15-Second IMNCI Method)</span>
                    </strong>
                    <p className="text-teal-700 text-xs">
                      Tap the button below with each inhalation of the patient for 15 seconds. The app will automatically calculate breaths per minute (Count × 4) and save it.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {!breathTimerActive ? (
                      <button
                        type="button"
                        onClick={startBreathTimer}
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-lg shadow"
                      >
                        Start 15s Timer
                      </button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1.5 bg-amber-500 text-slate-950 font-black rounded-lg text-sm animate-pulse">
                          {breathSecondsLeft}s left
                        </span>
                        <button
                          type="button"
                          onClick={() => setBreathCount(prev => prev + 1)}
                          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-black text-sm rounded-xl shadow-lg ring-4 ring-teal-300 animate-bounce"
                        >
                          TAP BREATH ({breathCount})
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Stage 1 Real-time Feedback & Next Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
              {emergencyCheck.isEmergency ? (
                <div className="flex items-center space-x-2 text-red-600 text-xs font-bold">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{emergencyCheck.vitalTriggered}: {emergencyCheck.reason}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-emerald-600 text-xs font-semibold">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <span>Vitals entered. Press next to proceed with guided questions.</span>
                </div>
              )}

              <button
                onClick={handleStage1Next}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm transition flex items-center justify-center space-x-2 shadow-lg ${
                  emergencyCheck.isEmergency
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/25'
                    : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-500/25'
                }`}
              >
                <span>{emergencyCheck.isEmergency ? 'Trigger Emergency Screen' : t.proceedToStage2}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* STAGE 2: GUIDED SYMPTOM ASSESSMENT */}
        {currentStage === 2 && (
          <div className="space-y-6">
            
            {/* Complaint Select & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t.complaintSelect}
                </label>
                <select
                  value={symptoms.complaint}
                  onChange={(e) => setSymptoms(prev => ({ ...prev, complaint: e.target.value }))}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  {complaintOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t.duration}
                </label>
                <select
                  value={symptoms.duration}
                  onChange={(e) => setSymptoms(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="< 24 hours">Less than 24 hours (Sudden)</option>
                  <option value="2 - 3 days">2 - 3 days (Acute)</option>
                  <option value="1 week">About 1 week</option>
                  <option value="> 2 weeks">&gt; 2 weeks (Chronic - TB/NCD alert)</option>
                  <option value="> 1 month">More than 1 month</option>
                </select>
              </div>
            </div>

            {/* Targeted Question Checklist with Tactile Yes/No Buttons */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                Condition-Specific Clinical Risk Indicators:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                
                {/* Cough / Respiratory Questions */}
                {symptoms.complaint.includes('Cough') && (
                  <>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-900 block">Fever rises in evening?</span>
                        <span className="text-[11px] text-slate-500">शाम को बुखार / సాయంత్రం జ్వరమా? (TB sign)</span>
                      </div>
                      <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={() => handleSymptomAnswerChange('evening_fever', 'yes')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                            symptoms.answers['evening_fever'] === 'yes'
                              ? 'bg-amber-600 text-white border-amber-700 shadow'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSymptomAnswerChange('evening_fever', 'no')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                            symptoms.answers['evening_fever'] === 'no' || !symptoms.answers['evening_fever']
                              ? 'bg-slate-800 text-white border-slate-800 shadow'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-900 block">Noticeable weight loss?</span>
                        <span className="text-[11px] text-slate-500">वजन कम होना / బరువు తగ్గారా?</span>
                      </div>
                      <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={() => handleSymptomAnswerChange('weight_loss', 'yes')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                            symptoms.answers['weight_loss'] === 'yes'
                              ? 'bg-amber-600 text-white border-amber-700 shadow'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSymptomAnswerChange('weight_loss', 'no')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                            symptoms.answers['weight_loss'] === 'no' || !symptoms.answers['weight_loss']
                              ? 'bg-slate-800 text-white border-slate-800 shadow'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between sm:col-span-2">
                      <div>
                        <span className="font-semibold text-slate-900 block">Blood in sputum or cough?</span>
                        <span className="text-[11px] text-slate-500">खांसी में खून / కఫంలో రక్తమా? (Hemoptysis - Red Flag)</span>
                      </div>
                      <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={() => handleSymptomAnswerChange('blood_sputum', 'yes')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                            symptoms.answers['blood_sputum'] === 'yes'
                              ? 'bg-red-600 text-white border-red-700 shadow ring-2 ring-red-400'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSymptomAnswerChange('blood_sputum', 'no')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                            symptoms.answers['blood_sputum'] === 'no' || !symptoms.answers['blood_sputum']
                              ? 'bg-slate-800 text-white border-slate-800 shadow'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Fever / Vector-Borne Questions */}
                {symptoms.complaint.includes('Fever') && (
                  <>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-900 block">Chills & Shivering (कपकपी)?</span>
                        <span className="text-[11px] text-slate-500">Malaria / Rigors indicator (చలిజ్వరం)</span>
                      </div>
                      <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={() => handleSymptomAnswerChange('chills', 'yes')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                            symptoms.answers['chills'] === 'yes'
                              ? 'bg-blue-600 text-white border-blue-700 shadow'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSymptomAnswerChange('chills', 'no')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                            symptoms.answers['chills'] === 'no' || !symptoms.answers['chills']
                              ? 'bg-slate-800 text-white border-slate-800 shadow'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-900 block">Skin rash or red spots?</span>
                        <span className="text-[11px] text-slate-500">Dengue Petechiae indicator (దద్దుర్లు)</span>
                      </div>
                      <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={() => handleSymptomAnswerChange('rash', 'yes')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                            symptoms.answers['rash'] === 'yes'
                              ? 'bg-blue-600 text-white border-blue-700 shadow'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSymptomAnswerChange('rash', 'no')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                            symptoms.answers['rash'] === 'no' || !symptoms.answers['rash']
                              ? 'bg-slate-800 text-white border-slate-800 shadow'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between sm:col-span-2">
                      <div>
                        <span className="font-semibold text-slate-900 block">Stiff neck or inability to touch chin to chest?</span>
                        <span className="text-[11px] text-slate-500">Meningitis red flag (गर्दन में अकड़न)</span>
                      </div>
                      <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={() => handleSymptomAnswerChange('stiff_neck', 'yes')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                            symptoms.answers['stiff_neck'] === 'yes'
                              ? 'bg-red-600 text-white border-red-700 shadow'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSymptomAnswerChange('stiff_neck', 'no')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                            symptoms.answers['stiff_neck'] === 'no' || !symptoms.answers['stiff_neck']
                              ? 'bg-slate-800 text-white border-slate-800 shadow'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Chest Pain Questions */}
                {symptoms.complaint.includes('Chest') && (
                  <>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-900 block">Profuse cold sweating?</span>
                        <span className="text-[11px] text-slate-500">ठंडा पसीना (Diaphoresis - Acute MI sign)</span>
                      </div>
                      <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={() => handleSymptomAnswerChange('sweating', 'yes')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                            symptoms.answers['sweating'] === 'yes'
                              ? 'bg-red-600 text-white border-red-700 shadow'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSymptomAnswerChange('sweating', 'no')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                            symptoms.answers['sweating'] === 'no' || !symptoms.answers['sweating']
                              ? 'bg-slate-800 text-white border-slate-800 shadow'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-900 block">Pain spreading to left arm/jaw?</span>
                        <span className="text-[11px] text-slate-500">बाएं हाथ/जबड़े में दर्द (Radiating pain)</span>
                      </div>
                      <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={() => handleSymptomAnswerChange('radiating', 'yes')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                            symptoms.answers['radiating'] === 'yes'
                              ? 'bg-red-600 text-white border-red-700 shadow'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSymptomAnswerChange('radiating', 'no')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                            symptoms.answers['radiating'] === 'no' || !symptoms.answers['radiating']
                              ? 'bg-slate-800 text-white border-slate-800 shadow'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Pediatric Screening (Age < 5) */}
                {patient.age > 0 && patient.age < 5 && (
                  <div className="p-3 bg-blue-50/90 rounded-xl border border-blue-200 flex items-center justify-between sm:col-span-2">
                    <div>
                      <span className="font-bold text-xs text-blue-950 block">
                        Is child unable to drink or breastfeed? (दूध पीने में असमर्थ?)
                      </span>
                      <span className="text-[11px] text-blue-700">
                        IMNCI Danger Sign: High risk of rapid pediatric dehydration or severe acute infection.
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0 ml-3">
                      <button
                        type="button"
                        onClick={() => handleSymptomAnswerChange('cannot_feed', 'yes')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                          symptoms.answers['cannot_feed'] === 'yes'
                            ? 'bg-red-600 text-white border-red-700 shadow'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSymptomAnswerChange('cannot_feed', 'no')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                          symptoms.answers['cannot_feed'] === 'no' || !symptoms.answers['cannot_feed']
                            ? 'bg-slate-800 text-white border-slate-800 shadow'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}

                {/* Chronic / Adult NCD Screening (Age >= 35) */}
                {patient.age >= 35 && (
                  <div className="p-3 bg-amber-50/90 rounded-xl border border-amber-200 flex items-center justify-between sm:col-span-2">
                    <div>
                      <span className="font-bold text-xs text-amber-950 block">
                        Excessive thirst, frequent urination, or blurred vision?
                      </span>
                      <span className="text-[11px] text-amber-800">
                        National NCD Screening: Diabetes Mellitus / Metabolic Syndrome indicator.
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0 ml-3">
                      <button
                        type="button"
                        onClick={() => handleSymptomAnswerChange('ncd_thirst', 'yes')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                          symptoms.answers['ncd_thirst'] === 'yes'
                            ? 'bg-amber-600 text-white border-amber-700 shadow'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSymptomAnswerChange('ncd_thirst', 'no')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                          symptoms.answers['ncd_thirst'] === 'no' || !symptoms.answers['ncd_thirst']
                            ? 'bg-slate-800 text-white border-slate-800 shadow'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}

                {/* Pregnancy Screening - Visible ONLY for Female Patients with Clear Yes/No Toggle */}
                {patient.gender === 'female' && (
                  <div className="p-3 bg-rose-50/90 rounded-xl border border-rose-200 flex items-center justify-between sm:col-span-2">
                    <div>
                      <span className="font-bold text-xs text-rose-950 block">
                        Is the patient pregnant? (गर्भवती हैं? / గర్భిణీనా?)
                      </span>
                      <span className="text-[11px] text-rose-700">
                        Critical for maternal Antenatal Care (ANC) protocols, hypertensive crisis screening, and medication safety.
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0 ml-3">
                      <button
                        type="button"
                        onClick={() => handleSymptomAnswerChange('pregnant', 'yes')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition border ${
                          symptoms.answers['pregnant'] === 'yes'
                            ? 'bg-rose-600 text-white border-rose-700 shadow-md ring-2 ring-rose-400'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        Yes (हाँ / అవును)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSymptomAnswerChange('pregnant', 'no')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition border ${
                          symptoms.answers['pregnant'] === 'no' || !symptoms.answers['pregnant']
                            ? 'bg-slate-800 text-white border-slate-800 shadow-md'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        No (नहीं / కాదు)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Other Clinical Notes with Voice Dictation */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Additional Notes / Patient Words:
                </label>
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-md flex items-center space-x-1.5 border transition ${
                    isListening
                      ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  }`}
                  title="Speak symptoms in Hindi, Telugu, or English"
                >
                  <Mic className={`w-3.5 h-3.5 ${isListening ? 'text-white' : 'text-rose-500'}`} />
                  <span>{isListening ? 'Listening...' : 'Voice Dictate'}</span>
                </button>
              </div>

              <textarea
                rows={2}
                value={symptoms.otherNotes || ''}
                onChange={(e) => setSymptoms(prev => ({ ...prev, otherNotes: e.target.value }))}
                placeholder="e.g. Patient feels extreme lethargy, cannot walk without support..."
                className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            {/* Run Triage Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
              <button
                onClick={() => setCurrentStage(1)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2"
              >
                ← Back to Vitals
              </button>

              <button
                onClick={handleRunTriage}
                disabled={isAnalyzing}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-extrabold text-sm bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white shadow-xl shadow-sky-600/20 flex items-center justify-center space-x-2 transition transform active:scale-95 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-emerald-200 animate-spin-slow" />
                <span>{isAnalyzing ? t.triageAnalyzing : t.btnAnalyzeTriage}</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
