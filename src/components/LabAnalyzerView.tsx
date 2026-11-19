import React, { useState } from 'react';
import { SupportedLanguage, LabReportResult } from '../types/medical';
import { translations } from '../data/translations';
import { hybridAiRouter } from '../services/hybridAiRouter';
import { PATHOLOGY_PROFILES } from '../data/pathologyCatalog';
import { FileText, Camera, Upload, Sparkles, AlertTriangle, CheckCircle, Apple, Activity, Clock, TestTube, Loader2, Key } from 'lucide-react';

interface LabAnalyzerViewProps {
  language: SupportedLanguage;
  onAnalysisComplete: (result: LabReportResult) => void;
}

export const LabAnalyzerView: React.FC<LabAnalyzerViewProps> = ({
  language,
  onAnalysisComplete
}) => {
  const t = translations[language];
  const [reportText, setReportText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isScanningPhoto, setIsScanningPhoto] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<LabReportResult | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeProfileId, setActiveProfileId] = useState<string>('cbp');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(hybridAiRouter.getApiKey() || '');

  // Client-side canvas compression for 2G/3G efficiency
  const compressImage = (file: File): Promise<{ base64: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1280;
          const MAX_HEIGHT = 1280;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          const mimeType = 'image/jpeg';
          const compressedBase64 = canvas.toDataURL(mimeType, 0.82);
          resolve({ base64: compressedBase64, mimeType });
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleRunAnalysis = async (textToUse?: string) => {
    const text = textToUse || reportText;
    setErrorMessage(null);
    if (!text.trim()) {
      setErrorMessage('Please paste diagnostic lab report text or select one of the quick samples above.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await hybridAiRouter.analyzeLabReport(text, language);
      setAnalysisResult(res);
      onAnalysisComplete(res);
    } catch (err: any) {
      console.warn('Lab analysis rejected or failed:', err);
      setAnalysisResult(null);
      setErrorMessage(err.message?.replace('INVALID_LAB_REPORT: ', '') || 'Failed to analyze report.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Defense: Validate MIME type strictly (image/jpeg, image/png, image/webp)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Security Alert: Only valid image files (JPG, PNG, WebP) are accepted for lab analysis.');
      return;
    }

    // Defense: Enforce 12MB max file size to prevent browser memory exhaustion DoS
    if (file.size > 12 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 12MB limit. Please capture or select a smaller photo.');
      return;
    }

    setErrorMessage(null);
    setIsScanningPhoto(true);

    try {
      const { base64, mimeType } = await compressImage(file);
      setPhotoPreview(base64);

      const { extractedText, labResult } = await hybridAiRouter.analyzeLabPhoto(base64, mimeType, language);
      setReportText(extractedText);
      setAnalysisResult(labResult);
      onAnalysisComplete(labResult);
    } catch (err: any) {
      console.error('Photo analysis error:', err);
      setErrorMessage(err.message || 'Failed to read photo. Please try again or type values manually.');
    } finally {
      setIsScanningPhoto(false);
    }
  };

  const handleSaveApiKey = () => {
    hybridAiRouter.setApiKey(apiKeyInput.trim());
    setShowKeyModal(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-6 space-y-6">
      
      {/* Title & Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{t.labTitle}</h2>
            <p className="text-xs text-slate-500">{t.labDesc}</p>
          </div>
        </div>

        {/* Gemini Vision API Key Button */}
        <button
          onClick={() => setShowKeyModal(true)}
          className="self-start sm:self-center px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 transition bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300"
          title="Configure Cloud Gemini 2.0 Flash Vision API Key"
        >
          <Key className="w-3.5 h-3.5 text-purple-600" />
          <span>{hybridAiRouter.getApiKey() ? 'Gemini 2.0 Vision: Connected' : 'Set Gemini Vision Key'}</span>
        </button>
      </div>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-purple-900">Gemini 2.0 Flash Vision Key (Cloud OCR)</span>
            <button onClick={() => setShowKeyModal(false)} className="text-slate-500 hover:text-slate-800 font-bold">✕</button>
          </div>
          <p className="text-slate-600">
            For live photo OCR of paper reports via Google Cloud Gemini 2.0 Flash Vision, supply your API key (or set <code className="bg-purple-100 px-1 rounded">VITE_GEMINI_API_KEY</code> in <code className="bg-purple-100 px-1 rounded">.env</code>).
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="flex-1 p-2 rounded-lg border border-purple-300 font-mono text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <button
              onClick={handleSaveApiKey}
              className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700"
            >
              Save Key
            </button>
          </div>
        </div>
      )}

      {/* Input Options: Sample Buttons, Textarea, and Photo Capture */}
      <div className="space-y-3">
        
        {/* 7 Standardized Clinical Pathology Profiles */}
        <div className="space-y-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
            <TestTube className="w-3.5 h-3.5 text-purple-600" />
            <span>Select Clinical Pathology Profile Preset:</span>
          </div>
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {Object.values(PATHOLOGY_PROFILES).map((prof) => {
              const isActive = activeProfileId === prof.id;
              return (
                <button
                  key={prof.id}
                  onClick={() => {
                    setActiveProfileId(prof.id);
                    setReportText(prof.sampleReportText);
                    handleRunAnalysis(prof.sampleReportText);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition border flex items-center space-x-1.5 shadow-sm ${
                    isActive
                      ? 'bg-purple-700 text-white border-purple-800 shadow ring-2 ring-purple-400/50'
                      : 'bg-purple-50/80 hover:bg-purple-100 text-purple-800 border-purple-200'
                  }`}
                  title={prof.description}
                >
                  <span className="font-bold text-[11px] px-1 rounded bg-black/10">{prof.code}</span>
                  <span>{prof.name.split('(')[0].trim()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Textarea */}
        <textarea
          rows={5}
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
          placeholder="Paste printed lab report values or parameters here (e.g. Hemoglobin: 9.0 g/dL, Platelets: 90000, Sugar: 180 mg/dL)..."
          className="w-full text-sm p-3.5 rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />

        {/* Photo Upload Option */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div className="flex items-center space-x-2 text-slate-700">
            <Camera className="w-4 h-4 text-purple-600 shrink-0" />
            <span>Upload or snap a camera photo of paper lab prescription / report:</span>
          </div>
          <label className={`cursor-pointer px-3.5 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 font-bold text-slate-800 transition flex items-center space-x-2 shrink-0 shadow-sm ${isScanningPhoto ? 'opacity-50 pointer-events-none' : ''}`}>
            {isScanningPhoto ? (
              <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 text-purple-600" />
            )}
            <span>{isScanningPhoto ? 'Scanning Photo...' : 'Snap / Upload Photo'}</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoUpload}
              disabled={isScanningPhoto}
              className="hidden"
            />
          </label>
        </div>

        {/* Error / Rejection Banner */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start space-x-2.5 animate-pulse-slow">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold text-red-900">Validation Notice:</strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {photoPreview && (
          <div className="flex items-center space-x-3 p-3 bg-purple-50/60 rounded-xl border border-purple-200">
            <img src={photoPreview} alt="Lab Preview" className="w-16 h-16 object-cover rounded-lg border border-purple-300 shadow-sm" />
            <div className="text-xs">
              <span className="font-bold text-purple-900 block flex items-center gap-1.5">
                {isScanningPhoto ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 text-purple-600 animate-spin" />
                    <span>Gemini 2.0 Flash Vision: Transcribing document...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Paper Lab Report Processed</span>
                  </>
                )}
              </span>
              <span className="text-slate-600">
                {isScanningPhoto
                  ? 'Analyzing handwriting, shadows, print ink, and reference flags...'
                  : 'Biomarkers parsed and mapped against rural health reference intervals.'}
              </span>
            </div>
          </div>
        )}

        {/* Analyze Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={() => handleRunAnalysis()}
            disabled={isAnalyzing || isScanningPhoto}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20 flex items-center justify-center space-x-2 transition disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-purple-200 animate-spin-slow" />
            <span>{isAnalyzing ? 'Analyzing Parameters...' : t.btnAnalyzeReport}</span>
          </button>
        </div>

      </div>

      {/* ANALYSIS RESULT DISPLAY */}
      {analysisResult && (
        <div className="space-y-5 pt-4 border-t border-slate-200">
          
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-600" />
              <span>Extracted Biomarkers & Reference Flags</span>
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
              {analysisResult.inferenceEngine} ({analysisResult.latencyMs}ms)
            </span>
          </div>

          {/* Biomarkers Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Test Parameter</th>
                  <th className="p-3">Observed Value</th>
                  <th className="p-3">Reference Range</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {analysisResult.keyFindings.map((finding, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-800">{finding.testName}</td>
                    <td className="p-3 font-bold text-slate-900">{finding.value}</td>
                    <td className="p-3 text-slate-500">{finding.referenceRange || 'Standard'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        finding.status === 'critical'
                          ? 'bg-red-100 text-red-700 border border-red-300'
                          : finding.status === 'low' || finding.status === 'high'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {finding.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Dietary Advice */}
            <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Apple className="w-4 h-4 text-emerald-600" />
                <span>Culturally Appropriate Nutrition Guidance:</span>
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-emerald-900 font-medium">
                {analysisResult.dietaryRecommendations.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>

            {/* Lifestyle & Clinical Follow-up */}
            <div className="bg-sky-50/70 border border-sky-200 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-600" />
                <span>Clinical Follow-Up & Lifestyle Steps:</span>
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-sky-900 font-medium">
                {analysisResult.lifestyleRecommendations.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
                <li className="font-bold text-slate-800 pt-1">{analysisResult.followUp}</li>
              </ul>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
