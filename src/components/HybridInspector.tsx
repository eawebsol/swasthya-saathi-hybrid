import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Lock, Cloud, Key, CheckCircle2, AlertCircle } from 'lucide-react';
import { hybridAiRouter } from '../services/hybridAiRouter';

interface HybridInspectorProps {
  lastEngine: 'on_device_gemini_nano' | 'firebase_cloud_gemini' | 'local_protocol_rag';
  lastLatencyMs: number;
  isSimulatedOffline: boolean;
  onToggleSimulatedOffline: () => void;
}

export const HybridInspector: React.FC<HybridInspectorProps> = ({
  lastEngine,
  lastLatencyMs,
  isSimulatedOffline,
  onToggleSimulatedOffline
}) => {
  const [nanoAvailable, setNanoAvailable] = useState<'checking' | 'readily' | 'no'>('checking');
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');

  useEffect(() => {
    hybridAiRouter.checkOnDeviceModelAvailability().then(status => {
      setNanoAvailable(status === 'readily' ? 'readily' : 'no');
    });
    setApiKeyInput(hybridAiRouter.getApiKey());
  }, []);

  const handleSaveApiKey = () => {
    hybridAiRouter.setApiKey(apiKeyInput.trim());
    setShowSettings(false);
  };

  const getEngineDisplay = () => {
    switch (lastEngine) {
      case 'on_device_gemini_nano':
        return {
          title: 'On-Device (Gemini Nano)',
          desc: 'Chrome Built-in AI / W3C Prompt API',
          icon: <Cpu className="w-4 h-4 text-emerald-400" />,
          color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
          privacy: '100% On-Device (0 bytes egress)'
        };
      case 'firebase_cloud_gemini':
        return {
          title: 'Firebase Cloud AI (Gemini 2.0 Flash)',
          desc: 'Vertex AI Cloud Inference',
          icon: <Cloud className="w-4 h-4 text-sky-400" />,
          color: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
          privacy: 'End-to-End Encrypted Transit'
        };
      case 'local_protocol_rag':
      default:
        return {
          title: 'Local Clinical Protocol RAG',
          desc: 'On-Device ICMR & NHM Knowledge Enclave',
          icon: <Zap className="w-4 h-4 text-amber-400" />,
          color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
          privacy: '100% Offline Enclave (0 bytes egress)'
        };
    }
  };

  const engine = getEngineDisplay();

  return (
    <div className="bg-slate-950 border-b border-slate-800 text-slate-300 py-2 px-4 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: Active Engine & Latency */}
        <div className="flex items-center flex-wrap gap-3">
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Hybrid Inspector:
          </span>

          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md border font-semibold ${engine.color}`}>
            {engine.icon}
            <span>{engine.title}</span>
          </div>

          <div className="flex items-center space-x-1 text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Latency: <strong className="text-slate-200">{lastLatencyMs}ms</strong></span>
          </div>

          <div className="hidden sm:flex items-center space-x-1 text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Privacy: <strong className="text-emerald-300">{engine.privacy}</strong></span>
          </div>
        </div>

        {/* Right: Quick Toggles & Config */}
        <div className="flex items-center space-x-2.5">
          {/* Simulated Offline Toggle */}
          <button
            onClick={onToggleSimulatedOffline}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold transition border ${
              isSimulatedOffline
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>{isSimulatedOffline ? '📶 Offline Simulation ACTIVE' : '📶 Test Offline Mode'}</span>
          </button>

          {/* API Key Modal Button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            title="Configure Cloud Gemini API Key (Optional for Cloud Mode)"
            className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            <Key className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">Cloud Key</span>
          </button>
        </div>

      </div>

      {/* Settings Drawer / Modal for Cloud Gemini Key */}
      {showSettings && (
        <div className="mt-3 p-3 bg-slate-900 border border-slate-800 rounded-lg max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <Key className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              <strong>Cloud Gemini API Key (Optional):</strong> Required only for Cloud Escalation when online. Without a key, the app runs 100% on On-Device Gemini Nano / Local Clinical RAG.
            </span>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <input
              type="password"
              placeholder="Paste GEMINI_API_KEY..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-slate-200 placeholder-slate-500 text-xs w-full sm:w-64 focus:outline-none focus:border-sky-500"
            />
            <button
              onClick={handleSaveApiKey}
              className="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-3 py-1 rounded text-xs transition shrink-0"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
