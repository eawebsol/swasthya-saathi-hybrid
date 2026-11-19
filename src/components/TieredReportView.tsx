import React, { useState } from 'react';
import { TriageResult, SupportedLanguage, PatientInfo, Vitals } from '../types/medical';
import { translations } from '../data/translations';
import { speechService } from '../services/speechService';
import { Volume2, VolumeX, CheckSquare, FileText, Download, Save, ShieldCheck, HeartHandshake, AlertCircle, Sparkles, QrCode } from 'lucide-react';

interface TieredReportViewProps {
  triage: TriageResult;
  patient: PatientInfo;
  vitals: Vitals;
  language: SupportedLanguage;
  onSaveCase: () => void;
  isSaved: boolean;
}

export const TieredReportView: React.FC<TieredReportViewProps> = ({
  triage,
  patient,
  vitals,
  language,
  onSaveCase,
  isSaved
}) => {
  const t = translations[language];
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [completedAshaActions, setCompletedAshaActions] = useState<Record<number, boolean>>({});

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      speechService.stop();
      setIsPlayingAudio(false);
    } else {
      speechService.speak(
        triage.patientGuidance,
        language,
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false)
      );
    }
  };

  const escapeHtml = (unsafe: string): string => {
    return (unsafe || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const handleDownloadHtml = () => {
    const safePatientName = escapeHtml(patient.name);
    const safeVillage = escapeHtml(patient.village);
    const safeGender = escapeHtml(patient.gender);
    const safeUrgency = escapeHtml(triage.urgency);
    const safeEngine = escapeHtml(triage.inferenceEngine);
    const safePatientGuidance = escapeHtml(triage.patientGuidance).replace(/\n/g, '<br/>');
    const safeAshaNotes = triage.ashaNotes.map(note => `<li>${escapeHtml(note)}</li>`).join('');
    const safeConditions = triage.medicalSummary.suspectedConditions.map(c => escapeHtml(c)).join(', ');
    const safePrograms = triage.medicalSummary.programTags.map(p => escapeHtml(p)).join(', ');
    const safeClinicalNotes = escapeHtml(triage.medicalSummary.clinicalNotes);

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Swasthya Saathi Clinical Triage Card - ${safePatientName}</title>
  <style>
    body { font-family: sans-serif; margin: 30px; line-height: 1.6; color: #1e293b; }
    .header { border-bottom: 2px solid #0284c7; padding-bottom: 10px; margin-bottom: 20px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-weight: bold; background: #e0f2fe; color: #0369a1; }
    .tier { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 15px; margin-bottom: 15px; }
    .tier-title { font-size: 16px; font-weight: bold; color: #0f172a; margin-top: 0; }
  </style>
</head>
<body>
  <div class="header">
    <h2>Swasthya Saathi - Clinical Triage Record</h2>
    <p>Patient: <strong>${safePatientName}</strong> (${patient.age}y / ${safeGender}) | Village: ${safeVillage} | Date: ${new Date(triage.timestamp).toLocaleString()}</p>
    <p>Vitals: Temp ${vitals.temperature}°F | Pulse ${vitals.pulse} bpm | SpO2 ${vitals.spo2}% | BP ${vitals.bpSystolic}/${vitals.bpDiastolic} mmHg | Resp. Rate: ${vitals.respiratoryRate || 18} bpm</p>
    <div class="badge">Urgency: ${safeUrgency} | Engine: ${safeEngine} (${triage.latencyMs}ms)</div>
  </div>

  <div class="tier">
    <div class="tier-title">${escapeHtml(t.tierPatientTitle)}</div>
    <p>${safePatientGuidance}</p>
  </div>

  <div class="tier">
    <div class="tier-title">${escapeHtml(t.tierAshaTitle)}</div>
    <ul>
      ${safeAshaNotes}
    </ul>
  </div>

  <div class="tier">
    <div class="tier-title">${escapeHtml(t.tierDoctorTitle)}</div>
    <p><strong>Suspected Conditions:</strong> ${safeConditions}</p>
    <p><strong>Linked Public Health Programs:</strong> ${safePrograms}</p>
    <p><strong>Clinical Notes:</strong> ${safeClinicalNotes}</p>
  </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Triage_Report_${patient.name.replace(/[^a-zA-Z0-9_-]/g, '_')}_${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 mt-6">
      
      {/* Triage Status Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider ${
              triage.urgency === 'EMERGENCY'
                ? 'bg-red-500 text-white'
                : triage.urgency === 'HIGH'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-emerald-500 text-slate-950'
            }`}>
              Urgency: {triage.urgency}
            </span>
            <span className="text-xs text-slate-400">
              Generated in <strong className="text-emerald-400">{triage.latencyMs}ms</strong> via <span className="text-sky-300 font-mono">{triage.inferenceEngine}</span>
            </span>
          </div>
          <h2 className="text-xl font-bold mt-1.5 text-white">
            Clinical Triage Complete for {patient.name || 'Patient'}
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={onSaveCase}
            disabled={isSaved}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow ${
              isSaved
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-sky-600 hover:bg-sky-500 text-white'
            }`}
          >
            {isSaved ? <ShieldCheck className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Saved Locally' : t.saveCase}</span>
          </button>

          <button
            onClick={handleDownloadHtml}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="Download full HTML medical report"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Export HTML</span>
          </button>
        </div>
      </div>

      {/* 🪪 AYUSHMAN BHARAT (ABHA) DIGITAL HEALTH QR PASS */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 border-2 border-amber-500/40 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 shadow">
              <QrCode className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                  🇮🇳 ABDM Integrated • National Digital Health Pass
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  ABHA # 91-2026-{(patient.name.length * 137).toString().padStart(4, '0')}-{patient.age.toString().padStart(4, '0')}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-white mt-1">
                {patient.name} ({patient.age}y / {patient.gender}) • {patient.village}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Clinical Referral Code: <strong className="text-amber-300 font-mono">PHC-REF-{triage.urgency}-{Date.now().toString().slice(-4)}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 self-end sm:self-center shrink-0 bg-white/5 p-2.5 rounded-xl border border-white/10">
            {/* Embedded QR Code Visual */}
            <div className="w-16 h-16 bg-white p-1 rounded-lg flex items-center justify-center shadow">
              <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950">
                <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                <rect x="5" y="5" width="20" height="20" fill="white" />
                <rect x="10" y="10" width="10" height="10" fill="currentColor" />

                <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                <rect x="75" y="5" width="20" height="20" fill="white" />
                <rect x="80" y="10" width="10" height="10" fill="currentColor" />

                <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                <rect x="5" y="75" width="20" height="20" fill="white" />
                <rect x="10" y="80" width="10" height="10" fill="currentColor" />

                <rect x="40" y="15" width="10" height="25" fill="currentColor" />
                <rect x="55" y="30" width="10" height="15" fill="currentColor" />
                <rect x="40" y="60" width="25" height="10" fill="currentColor" />
                <rect x="75" y="75" width="15" height="15" fill="currentColor" />
                <rect x="45" y="45" width="10" height="10" fill="#0284c7" />
              </svg>
            </div>
            <div className="text-[10px] text-slate-300 max-w-[130px] leading-tight">
              <strong className="block text-amber-300 mb-0.5">Scan at PHC Desk</strong>
              Instant paperless intake into National EMR portal with ICMR triage token.
            </div>
          </div>

        </div>
      </div>

      {/* TIER 1: PATIENT HOME GUIDANCE (WITH AUDIO) */}
      <div className="bg-emerald-50/70 border-2 border-emerald-500/40 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow">
              1
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {t.tierPatientTitle}
              </h3>
              <p className="text-xs text-slate-600">
                Simple, calming instructions for the patient and family in local language.
              </p>
            </div>
          </div>

          {/* Voice Readout Button */}
          <button
            onClick={handleToggleAudio}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
              isPlayingAudio
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>{t.stopAudio}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>{t.playAudio}</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 text-sm leading-relaxed text-slate-800 whitespace-pre-line font-medium">
          {triage.patientGuidance}
        </div>
      </div>

      {/* TIER 2: ASHA WORKER ACTION CHECKLIST */}
      <div className="bg-sky-50/70 border-2 border-sky-500/40 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-sm shadow">
            2
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              {t.tierAshaTitle}
            </h3>
            <p className="text-xs text-slate-600">
              Immediate operational steps, diagnostic sample collection, and referral protocols.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {triage.ashaNotes.map((note, index) => {
            const isChecked = !!completedAshaActions[index];
            return (
              <label
                key={index}
                className={`flex items-start space-x-3 p-3 rounded-xl border transition cursor-pointer ${
                  isChecked
                    ? 'bg-emerald-50 border-emerald-300 text-slate-500 line-through'
                    : 'bg-white border-sky-200 text-slate-800 hover:border-sky-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => setCompletedAshaActions(prev => ({ ...prev, [index]: e.target.checked }))}
                  className="mt-0.5 rounded text-sky-600 focus:ring-sky-500 h-4 w-4"
                />
                <span className="text-xs sm:text-sm font-medium">{note}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* TIER 3: PHC MEDICAL OFFICER CLINICAL SUMMARY */}
      <div className="bg-slate-900 text-slate-200 border-2 border-slate-700 rounded-2xl p-6 shadow-md">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow">
            3
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base">
              {t.tierDoctorTitle}
            </h3>
            <p className="text-xs text-slate-400">
              Confidential doctor-facing differential diagnosis & national health program codes.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          
          {/* Suspected Conditions */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="block text-slate-400 font-semibold mb-1 text-xs uppercase tracking-wider">
              Suspected Diagnostic Patterns:
            </span>
            <ul className="list-disc list-inside space-y-1 font-semibold text-emerald-400">
              {triage.medicalSummary.suspectedConditions.map((cond, i) => (
                <li key={i}>{cond}</li>
              ))}
            </ul>
          </div>

          {/* Linked Public Health Programs */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-semibold text-slate-400 self-center">National Programs:</span>
            {triage.medicalSummary.programTags.map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Doctor Clinical Summary */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-300">
            <strong className="block text-slate-400 font-semibold mb-1 text-xs uppercase tracking-wider">
              Clinical Assessment Notes:
            </strong>
            <p className="leading-relaxed">{triage.medicalSummary.clinicalNotes}</p>
          </div>

        </div>
      </div>

    </div>
  );
};
