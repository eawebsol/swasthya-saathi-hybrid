import React from 'react';
import { TEST_PRESETS, TestPreset } from '../data/testPresets';
import { Sparkles, Compass, CheckCircle2 } from 'lucide-react';

interface PresetBarProps {
  onSelectPreset: (preset: TestPreset) => void;
  activePresetId?: string;
}

export const PresetBar: React.FC<PresetBarProps> = ({ onSelectPreset, activePresetId }) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-b border-slate-700 py-2.5 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
        
        <div className="flex items-center space-x-2 shrink-0">
          <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-400 block sm:inline">
              👨‍⚖️ Judge 1-Click Tour
            </span>
            <span className="text-[11px] text-slate-300 sm:ml-2">
              (60-Second Guided Evaluation)
            </span>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {TEST_PRESETS.map((preset, idx) => {
            const isActive = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`text-xs px-3 py-1.5 rounded-lg font-bold transition flex items-center space-x-1.5 shadow border ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-300/60 shadow-lg'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600 hover:border-slate-500'
                }`}
                title={preset.expectedOutcome}
              >
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isActive ? 'bg-black/20 text-slate-950' : 'bg-white/10 text-amber-400'
                }`}>
                  {idx + 1}
                </span>
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
