import React from 'react';
import { SupportedLanguage, UserRole } from '../types/medical';
import { translations } from '../data/translations';
import { Activity, Wifi, WifiOff, Globe, Shield, RefreshCw } from 'lucide-react';

interface HeaderProps {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  isOnline: boolean;
  isSimulatedOffline: boolean;
  toggleSimulatedOffline: () => void;
  pendingSyncCount: number;
  onSyncClick: () => void;
  isSyncing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  role,
  setRole,
  isOnline,
  isSimulatedOffline,
  toggleSimulatedOffline,
  pendingSyncCount,
  onSyncClick,
  isSyncing
}) => {
  const t = translations[language];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        
        {/* Logo & Identity */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                {t.appTitle}
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Hybrid AI
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2.5">

          {/* Offline / Online Network Indicator & Simulator */}
          <button
            onClick={toggleSimulatedOffline}
            title="Click to toggle Simulated Offline Mode (Judge Testing Tool)"
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              isSimulatedOffline || !isOnline
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20'
                : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20'
            }`}
          >
            {isSimulatedOffline || !isOnline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>{isSimulatedOffline ? 'Offline (Simulated)' : 'Offline Enclave'}</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span>Online (Cloud Sync)</span>
              </>
            )}
          </button>

          {/* Pending Sync Button */}
          {pendingSyncCount > 0 && (
            <button
              onClick={onSyncClick}
              disabled={isSyncing || isSimulatedOffline || !isOnline}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-50 transition"
              title="Click to sync offline records to PHC Cloud"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync ({pendingSyncCount})</span>
            </button>
          )}

          {/* Role Switcher */}
          <div className="bg-slate-800 p-0.5 rounded-lg border border-slate-700 flex text-xs">
            <button
              onClick={() => setRole('asha')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                role === 'asha'
                  ? 'bg-sky-500 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.roleAsha}
            </button>
            <button
              onClick={() => setRole('doctor')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                role === 'doctor'
                  ? 'bg-sky-500 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.roleDoctor}
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center space-x-1 bg-slate-800 border border-slate-700 rounded-lg p-1">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1" />
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded text-xs font-semibold transition ${
                language === 'en' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-0.5 rounded text-xs font-semibold transition ${
                language === 'hi' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLanguage('te')}
              className={`px-2 py-0.5 rounded text-xs font-semibold transition ${
                language === 'te' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              తెలుగు
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
