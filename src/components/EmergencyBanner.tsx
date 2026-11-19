import React, { useState } from 'react';
import { PhoneCall, AlertTriangle, ArrowLeft, ShieldAlert, Navigation, CheckCircle2, Siren, Clock } from 'lucide-react';
import { SupportedLanguage } from '../types/medical';
import { translations } from '../data/translations';
import { soundService } from '../services/soundService';

interface EmergencyBannerProps {
  reason: string;
  vitalTriggered?: string;
  recommendedAction: string;
  language: SupportedLanguage;
  onReset: () => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  reason,
  vitalTriggered,
  recommendedAction,
  language,
  onReset
}) => {
  const t = translations[language];
  const [isDispatched, setIsDispatched] = useState(false);
  const [dispatchToken, setDispatchToken] = useState<string>('');
  const [coords, setCoords] = useState<string>('17.3850° N, 78.4867° E');

  const handleInstant108Dispatch = () => {
    soundService.playEmergencyAlertSound();
    const token = `108-EMERG-TS-${Math.floor(1000 + Math.random() * 9000)}`;
    setDispatchToken(token);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords(`${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E`);
        },
        () => {
          setCoords('17.3850° N, 78.4867° E (Rampur Sub-Center Base)');
        }
      );
    }
    setIsDispatched(true);
  };

  return (
    <div className="bg-red-600 text-white rounded-2xl p-6 sm:p-8 shadow-2xl border-4 border-red-500 animate-pulse-slow space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
            <ShieldAlert className="w-10 h-10 text-white" />
          </div>

          <div>
            <div className="inline-flex items-center space-x-2 bg-red-800/80 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border border-red-400 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-300" />
              <span>{t.emergencyAlertTitle}</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {vitalTriggered || 'Critical Instability Detected'}
            </h2>
            
            <p className="mt-1 text-red-100 font-medium text-base">
              {reason}
            </p>

            <div className="mt-4 p-4 rounded-xl bg-red-900/60 border border-red-400/40 text-sm text-red-50">
              <strong className="block text-white font-bold mb-1">Immediate ASHA Emergency Protocol:</strong>
              {recommendedAction}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={handleInstant108Dispatch}
            disabled={isDispatched}
            className={`flex items-center justify-center space-x-2.5 px-6 py-4 rounded-xl font-black text-base transition shadow-xl transform active:scale-95 ${
              isDispatched
                ? 'bg-emerald-500 text-white border-2 border-emerald-300'
                : 'bg-white text-red-700 hover:bg-red-50'
            }`}
          >
            {isDispatched ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-white" />
                <span>108 Ambulance Dispatched</span>
              </>
            ) : (
              <>
                <Siren className="w-6 h-6 text-red-600 animate-bounce" />
                <span>1-Tap 108 Emergency SOS</span>
              </>
            )}
          </button>

          <a
            href="tel:108"
            className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-red-900/80 hover:bg-red-900 text-white border border-red-400/50 transition text-center"
          >
            <PhoneCall className="w-4 h-4 text-white" />
            <span>Direct Dial 108</span>
          </a>

          <button
            onClick={onReset}
            className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-red-800/80 hover:bg-red-800 text-red-100 border border-red-500/50 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Re-evaluate Vitals / Start Over</span>
          </button>
        </div>

      </div>

      {/* DISPATCH CONFIRMATION TICKET */}
      {isDispatched && (
        <div className="p-4 rounded-xl bg-black/30 border border-white/20 text-xs text-white space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="font-extrabold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>108 Emergency Medical Dispatch Confirmed</span>
            </span>
            <span className="font-mono bg-white/20 px-2 py-0.5 rounded text-[11px] font-bold">
              Token: #{dispatchToken}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-slate-200">
            <div className="flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-sky-300 shrink-0" />
              <span>GPS: <strong className="text-white">{coords}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Ambulance ETA: <strong className="text-white">~14 Minutes</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-300 shrink-0" />
              <span>PHC Bed: <strong className="text-white">Emergency Resuscitation Reserved</strong></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
