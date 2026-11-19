import React, { useState, useEffect, useRef } from 'react';
import { PatientCase, SupportedLanguage, UserRole, EpidemicConfig } from '../types/medical';
import { translations } from '../data/translations';
import { defaultEpidemicConfig } from '../config/firebase';
import { soundService } from '../services/soundService';
import {
  Users,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Radio,
  Search,
  Filter,
  Eye,
  ChevronRight,
  Volume2,
  VolumeX,
  BellRing,
  AlertOctagon,
  ArrowRight
} from 'lucide-react';

interface DashboardViewProps {
  cases: PatientCase[];
  language: SupportedLanguage;
  role: UserRole;
  onSelectCase: (patientCase: PatientCase) => void;
  epidemicConfig?: EpidemicConfig;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  cases,
  language,
  role,
  onSelectCase,
  epidemicConfig = defaultEpidemicConfig
}) => {
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundService.isSoundEnabled());

  const emergencyCases = cases.filter(c => c.triageResult?.urgency === 'EMERGENCY');
  const emergencyCount = emergencyCases.length;
  const highCount = cases.filter(c => c.triageResult?.urgency === 'HIGH').length;
  const pendingSyncCount = cases.filter(c => !c.syncedToCloud).length;

  const prevEmergencyCountRef = useRef<number>(emergencyCount);

  // Play hospital telemetry chime when new emergency cases are detected in real-time
  useEffect(() => {
    if (emergencyCount > prevEmergencyCountRef.current) {
      soundService.playEmergencyAlertSound();
    }
    prevEmergencyCountRef.current = emergencyCount;
  }, [emergencyCount]);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundService.setSoundEnabled(nextState);
  };

  const handleTestAlertSound = () => {
    soundService.playEmergencyAlertSound();
  };

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.patient.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.symptoms.complaint.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = urgencyFilter === 'all' || c.triageResult?.urgency === urgencyFilter;
    return matchesSearch && matchesFilter;
  });

  const latestEmergency = emergencyCases[0];

  return (
    <div className="space-y-6">
      
      {/* 🚨 PHC DOCTOR REAL-TIME EMERGENCY TELEMETRY ALERT BANNER */}
      {emergencyCount > 0 && latestEmergency && (
        <div className="bg-gradient-to-r from-red-600 via-rose-700 to-red-800 text-white rounded-2xl p-5 shadow-xl border-2 border-red-400 animate-pulse-slow">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            <div className="flex items-start space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0 border border-white/30 shadow">
                <AlertOctagon className="w-7 h-7 text-white animate-bounce" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black uppercase tracking-wider bg-black/30 px-2 py-0.5 rounded text-white flex items-center gap-1">
                    <BellRing className="w-3 h-3 text-red-200" />
                    <span>Real-Time Clinical Telemetry Alert</span>
                  </span>
                  <span className="text-xs font-bold text-red-200">
                    {emergencyCount} Critical Case{emergencyCount > 1 ? 's' : ''} Flagged
                  </span>
                </div>
                <h3 className="text-lg font-black mt-1">
                  CRITICAL: {latestEmergency.patient.name} ({latestEmergency.patient.age}y / {latestEmergency.patient.gender}) — {latestEmergency.patient.village}
                </h3>
                <p className="text-xs text-red-100 mt-0.5 font-medium">
                  Vital Instability: <strong className="text-white underline">{latestEmergency.triageResult?.possibleCauses?.[0] || 'Unstable Vitals'}</strong>. Immediate PHC resuscitation bed & 108 ambulance transfer protocol active.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 shrink-0 self-end md:self-center">
              <button
                onClick={toggleSound}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition text-xs flex items-center gap-1.5"
                title={soundEnabled ? "Mute Emergency Chime" : "Enable Emergency Chime"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-300" /> : <VolumeX className="w-4 h-4 text-red-300" />}
                <span className="hidden sm:inline">{soundEnabled ? 'Chime ON' : 'Muted'}</span>
              </button>

              <button
                onClick={handleTestAlertSound}
                className="px-3 py-2 rounded-xl bg-black/20 hover:bg-black/30 border border-white/20 text-xs font-bold text-white transition"
              >
                Test Chime
              </button>

              <button
                onClick={() => onSelectCase(latestEmergency)}
                className="px-4 py-2.5 rounded-xl bg-white text-red-700 hover:bg-red-50 font-black text-xs shadow-lg transition flex items-center space-x-1.5"
              >
                <span>Review Patient Immediately</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* EPIDEMIC SURVEILLANCE BANNER (FIREBASE REMOTE CONFIG) */}
      {epidemicConfig.active && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl p-5 shadow-lg border-2 border-amber-400">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Radio className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded">
                    Firebase Remote Config
                  </span>
                  <span className="text-xs font-bold text-amber-100">Live Outbreak Alert</span>
                </div>
                <h3 className="text-lg font-extrabold">{epidemicConfig.diseaseName} ({epidemicConfig.region})</h3>
                <p className="text-xs text-amber-50 mt-0.5">{epidemicConfig.alertMessage}</p>
              </div>
            </div>

            <div className="bg-black/20 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0">
              Surveillance Threshold: ≥ {epidemicConfig.feverThreshold}°F
            </div>
          </div>
        </div>
      )}

      {/* METRIC STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Total Patients */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Total Assessed</span>
            <Users className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{cases.length}</div>
          <span className="text-[11px] text-slate-400">Field cases logged</span>
        </div>

        {/* Emergencies */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Red Flag Alerts</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-black text-red-600">{emergencyCount}</div>
          <span className="text-[11px] text-red-400">Immediate 108 calls</span>
        </div>

        {/* High Risk */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">High Priority</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">{highCount}</div>
          <span className="text-[11px] text-amber-400">TB / Dengue referrals</span>
        </div>

        {/* Offline Sync Status */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Cloud Sync Queue</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {cases.length - pendingSyncCount} <span className="text-xs text-slate-400 font-normal">/ {cases.length}</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">
            {pendingSyncCount === 0 ? 'All Synced to Firestore' : `${pendingSyncCount} queued locally`}
          </span>
        </div>

      </div>

      {/* CASE HISTORY LIST & FILTERS */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {role === 'doctor' ? 'Primary Health Center Patient Registry' : 'ASHA Field Case Records'}
            </h3>
            <p className="text-xs text-slate-500">
              Offline-cached records stored in client-side IndexedDB with bidirectional Firestore sync.
            </p>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {/* Search Box */}
            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search patient/village..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {/* Urgency Filter */}
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 font-medium text-slate-700 bg-white focus:outline-none"
            >
              <option value="all">All Urgencies</option>
              <option value="EMERGENCY">Emergency Only</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        {/* Case Rows */}
        {filteredCases.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No patient cases logged yet. Run a triage from the Symptom Triage tab or select a Judge Test Case!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredCases.map((c) => (
              <div
                key={c.id}
                onClick={() => onSelectCase(c)}
                className="py-3 px-3 rounded-xl hover:bg-slate-50 transition cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full shrink-0 ${
                    c.triageResult?.urgency === 'EMERGENCY'
                      ? 'bg-red-500'
                      : c.triageResult?.urgency === 'HIGH'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`} />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{c.patient.name}</span>
                      <span className="text-xs text-slate-500">({c.patient.age}y / {c.patient.gender})</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        {c.patient.village}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center space-x-2">
                      <span>Complaint: <strong className="text-slate-700">{c.symptoms.complaint}</strong></span>
                      <span>•</span>
                      <span>SpO2: {c.vitals.spo2}%</span>
                      <span>•</span>
                      <span>Temp: {c.vitals.temperature}°F</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.syncedToCloud
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {c.syncedToCloud ? 'Synced' : 'Offline'}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5 font-mono">
                      {c.triageResult?.inferenceEngine === 'on_device_gemini_nano' ? 'Gemini Nano' : 'Local RAG'}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
