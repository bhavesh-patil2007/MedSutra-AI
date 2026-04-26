import React, { useState, useEffect, ReactNode } from 'react';
// ✅ FIX 1: Added default `React` import — required for React.CSSProperties used in SVG components
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Languages,
  Share2,
  AlertTriangle,
  Sun,
  Clock,
  Moon,
  MapPin,
  Info,
  CheckCircle2,
  Calendar,
  Utensils,
  Bell,
  ShieldAlert,
  Volume2,
  VolumeX,
  Square
} from 'lucide-react';
import { PrescriptionResult, UserProfile, Lang } from '../types';
import { translateResult } from '../services/aiService';
import { UI, translateMedText } from '../i18n';
import { useTTS } from '../hooks/useTTS';

interface ResultPageProps {
  result: PrescriptionResult;
  profile: UserProfile;
  lang: Lang;
}

type TabId = 'medications' | 'safety' | 'warnings' | 'actions';

interface ScanHistoryEntry {
  id: string;
  date: string;
  medicineCount: number;
  interactionCount: number;
  medicines: string[];
  fullResult: PrescriptionResult;
}

const HISTORY_KEY = 'rxbridge_scan_history';

function loadHistory(): ScanHistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch { return []; }
}

function saveToHistory(result: PrescriptionResult) {
  const existing = loadHistory();

  if (existing.length > 0 && JSON.stringify(existing[0].fullResult) === JSON.stringify(result)) {
    return;
  }

  const entry: ScanHistoryEntry = {
    id: Date.now().toString(),
    date: new Date().toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }),
    medicineCount: result.medicines.length,
    interactionCount: result.interactions.length,
    medicines: result.medicines.slice(0, 3).map(m => m.name),
    fullResult: result
  };

  const updated = [entry, ...existing].slice(0, 20);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

const css = `
  .rxb-bg-pattern {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background-image: radial-gradient(#a8c0e4 1px, transparent 1px), radial-gradient(#a8c0e4 1px, transparent 1px);
    background-size: 40px 40px; background-position: 0 0, 20px 20px;
    opacity: 0.05; z-index: 0; pointer-events: none;
  }

  .rxb-floating-layer {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    z-index: 0; pointer-events: none; overflow: hidden; opacity: 0.08;
  }

  .rxb-float-item { position: absolute; filter: drop-shadow(0px 8px 16px rgba(0,0,0,0.06)); }

  @keyframes float-1 { 0% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(5deg); } 100% { transform: translateY(0px) rotate(0deg); } }
  @keyframes float-2 { 0% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(-8deg); } 100% { transform: translateY(0px) rotate(0deg); } }
  @keyframes float-3 { 0% { transform: translateY(0px) rotate(0deg) scale(1); } 50% { transform: translateY(-20px) rotate(10deg) scale(1.05); } 100% { transform: translateY(0px) rotate(0deg) scale(1); } }

  .float-anim-1 { animation: float-1 8s ease-in-out infinite; }
  .float-anim-2 { animation: float-2 6s ease-in-out infinite; }
  .float-anim-3 { animation: float-3 10s ease-in-out infinite; }
`;

function LeafSVG({ width = 80, style, animClass = '' }: { width?: number, style?: React.CSSProperties, animClass?: string }) {
  return (
    <svg width={width} viewBox="0 0 100 100" style={style} className={`rxb-float-item ${animClass}`}>
      <defs>
        <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a8cdb6" /><stop offset="100%" stopColor="#629277" />
        </linearGradient>
      </defs>
      <path d="M50 90 C 10 90, 10 30, 50 10 C 90 30, 90 90, 50 90 Z" fill="url(#leafGrad)" opacity="0.9" />
      <path d="M50 95 L50 10" stroke="#48785e" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      <path d="M50 70 Q 30 60, 25 45" stroke="#48785e" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M50 50 Q 70 40, 75 25" stroke="#48785e" strokeWidth="1.5" fill="none" opacity="0.5" />
    </svg>
  );
}

function PillSVG({ width = 60, style, animClass = '' }: { width?: number, style?: React.CSSProperties, animClass?: string }) {
  return (
    <svg width={width} viewBox="0 0 100 40" style={style} className={`rxb-float-item ${animClass}`}>
      <defs>
        <linearGradient id="pillBlue" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6fa8d6" /><stop offset="100%" stopColor="#356c9e" />
        </linearGradient>
        <linearGradient id="pillWhite" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" /><stop offset="100%" stopColor="#d0dee8" />
        </linearGradient>
      </defs>
      <rect x="5" y="0" width="50" height="36" fill="url(#pillWhite)" rx="18" />
      <rect x="45" y="0" width="50" height="36" fill="url(#pillBlue)" rx="18" />
      <path d="M45 0 L50 0 L50 36 L45 36 Z" fill="#1c3d5e" opacity="0.15" />
      <path d="M15 6 Q 30 6, 40 12" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M55 6 Q 70 6, 85 12" stroke="#a0c8e8" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function MoleculeSVG({ width = 90, style, animClass = '' }: { width?: number, style?: React.CSSProperties, animClass?: string }) {
  return (
    <svg width={width} viewBox="0 0 100 100" style={style} className={`rxb-float-item ${animClass}`}>
      <defs>
        <radialGradient id="molBlue" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#9fbfe0" /><stop offset="100%" stopColor="#4376ad" />
        </radialGradient>
        <radialGradient id="molPurple" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#bba4d6" /><stop offset="100%" stopColor="#6c528f" />
        </radialGradient>
      </defs>
      <line x1="25" y1="75" x2="50" y2="50" stroke="#879cb5" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
      <line x1="50" y1="50" x2="80" y2="30" stroke="#879cb5" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
      <line x1="50" y1="50" x2="75" y2="75" stroke="#879cb5" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
      <line x1="50" y1="50" x2="35" y2="20" stroke="#879cb5" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
      <circle cx="25" cy="75" r="12" fill="url(#molBlue)" />
      <circle cx="50" cy="50" r="16" fill="url(#molPurple)" />
      <circle cx="80" cy="30" r="11" fill="url(#molBlue)" />
      <circle cx="75" cy="75" r="13" fill="url(#molPurple)" />
      <circle cx="35" cy="20" r="10" fill="url(#molBlue)" />
    </svg>
  );
}

function BackgroundElements() {
  return (
    <div className="rxb-floating-layer">
      <LeafSVG width={90} animClass="float-anim-1" style={{ top: '8%', left: '5%', transform: 'rotate(-25deg)' }} />
      <PillSVG width={55} animClass="float-anim-2" style={{ top: '22%', left: '12%', transform: 'rotate(40deg)' }} />
      <MoleculeSVG width={80} animClass="float-anim-3" style={{ top: '45%', left: '-2%', filter: 'blur(1px)' }} />
      <LeafSVG width={110} animClass="float-anim-2" style={{ top: '-2%', right: '15%', transform: 'rotate(110deg)' }} />
      <MoleculeSVG width={100} animClass="float-anim-1" style={{ top: '10%', right: '8%', transform: 'rotate(-15deg)' }} />
      <PillSVG width={65} animClass="float-anim-3" style={{ top: '35%', right: '5%', transform: 'rotate(-60deg)' }} />
      <LeafSVG width={130} animClass="float-anim-3" style={{ bottom: '-5%', left: '10%', transform: 'rotate(45deg)' }} />
      <PillSVG width={50} animClass="float-anim-1" style={{ bottom: '25%', left: '5%', transform: 'rotate(-15deg)', filter: 'blur(1px)' }} />
      <LeafSVG width={100} animClass="float-anim-2" style={{ bottom: '5%', right: '-2%', transform: 'rotate(-60deg)' }} />
      <MoleculeSVG width={120} animClass="float-anim-3" style={{ bottom: '15%', right: '15%', transform: 'rotate(30deg)' }} />
      <PillSVG width={70} animClass="float-anim-1" style={{ bottom: '-2%', right: '30%', transform: 'rotate(15deg)' }} />
      <LeafSVG width={70} animClass="float-anim-1" style={{ top: '50%', left: '30%', transform: 'rotate(70deg)', filter: 'blur(2px)' }} />
      <MoleculeSVG width={70} animClass="float-anim-2" style={{ top: '60%', right: '40%', transform: 'rotate(-40deg)', filter: 'blur(2px)' }} />
    </div>
  );
}

export default function ResultPage({ result, profile, lang }: ResultPageProps) {
  const navigate = useNavigate();
  // @ts-ignore
  const t = UI[lang] as Record<string, string>;

  const [currentResult, setCurrentResult] = useState(result);
  const [translating, setTranslating] = useState(false);
  const [translatedLang, setTranslatedLang] = useState<Lang>('en');
  const [activeTab, setActiveTab] = useState<TabId>('medications');

  useEffect(() => {
    saveToHistory(result);
  }, [result]);

  // ✅ FIX 2: Moved safetyAlerts & warningsAndCautions ABOVE shareSchedule()
  // so they are declared before being referenced in the function body.
  // Previously shareSchedule() used warningsAndCautions before its const declaration
  // which caused a ReferenceError (temporal dead zone with const).
  const safetyAlerts = currentResult.tabs?.criticalSafetyAlerts || currentResult.generalWarnings || [];
  const warningsAndCautions = currentResult.tabs?.warningsAndCautions || currentResult.warningsAndCautions || [];
  const totalWarningsCount = safetyAlerts.length + warningsAndCautions.length;

  const handleAutoTranslate = async (target: Lang) => {
    if (target === 'en') {
      setCurrentResult(result);
      setTranslatedLang('en');
      return;
    }
    if (translatedLang === target) return;
    setTranslating(true);
    try {
      const translated = await translateResult(result, target);
      const safe = {
        ...translated,
        medicines: translated.medicines.map((med, i) => ({
          ...med,
          // medicine NAME always kept from original — never translated
          name: result.medicines[i]?.name ?? med.name,
          timing: translateMedText(med.timing || result.medicines[i]?.timing || '', target),
          purpose: translateMedText(med.purpose || '', target),
          foodWarning: translateMedText(med.foodWarning || '', target),
          usageAlert: translateMedText(med.usageAlert || '', target),
          caution: translateMedText(med.caution || '', target),
        })),
        interactions: translated.interactions.map((inter, i) => ({
          ...inter,
          // drug names in interactions always kept from original
          drugs: result.interactions[i]?.drugs ?? inter.drugs,
          description: translateMedText(inter.description || '', target),
        })),
        generalWarnings: (translated.generalWarnings || []).map(w => translateMedText(w, target)),
        warningsAndCautions: (translated.warningsAndCautions || []).map(w => translateMedText(w, target)),
        // ✅ FIX 3: Added safe fallback `|| []` for tabs sub-arrays before calling .map()
        // Previously these would throw "Cannot read properties of undefined (reading 'map')"
        // if the AI returned a translated result where tabs.criticalSafetyAlerts was undefined.
        tabs: translated.tabs ? {
          ...translated.tabs,
          criticalSafetyAlerts: (translated.tabs.criticalSafetyAlerts ?? []).map(a => translateMedText(a, target)),
          warningsAndCautions: (translated.tabs.warningsAndCautions ?? []).map(w => translateMedText(w, target)),
        } : translated.tabs,
      };
      setCurrentResult(safe);
      setTranslatedLang(target);
    } catch (err) {
      console.error(err);
      alert(t.errorTranslationFailed || 'Translation failed');
      setCurrentResult(result);
      setTranslatedLang('en');
    } finally {
      setTranslating(false);
    }
  };

  useEffect(() => {
    if (lang !== translatedLang) handleAutoTranslate(lang);
  }, [lang]);

  // Helper: pass AI-generated text through the translation map at render time.
  // Medicine names must NEVER be passed into this — only contextual fields.
  const getMedField = (field: string | undefined): string => {
    if (!field) return '';
    return translateMedText(field, lang);
  };

  const shareSchedule = () => {
    // warningsAndCautions is now safely declared above before this function runs
    const text =
      `💊 Medication Schedule from MedSutra AI:\n\n` +
      currentResult.medicines.map(m => `• ${m.name} ${m.dosage}: ${m.timing}`).join('\n') +
      `\n\n⚠️ ${t.warnings || 'Warnings'}:\n` +
      warningsAndCautions.map(w => `• ${w}`).join('\n') +
      `\n\nStay safe! — MedSutra AI`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
  };

  const tabs = [
    { id: 'medications' as TabId, label: t.tabMedications || 'Medications', icon: '💊' },
    { id: 'safety' as TabId, label: t.tabSafety || 'Safety', icon: '🚨' },
    { id: 'warnings' as TabId, label: t.tabWarnings || 'Warnings', icon: '⚠️' },
    { id: 'actions' as TabId, label: t.tabActions || 'Actions', icon: '📍' },
  ];

  const { ttsState, toggle: ttsToggle, stop: ttsStop } = useTTS(
    { medicines: currentResult.medicines, interactions: currentResult.interactions, warnings: warningsAndCautions },
    lang
  );

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#E9F3F5', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <style>{css}</style>
      <div className="rxb-bg-pattern"></div>
      <BackgroundElements />

      <div className="relative z-10 p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-700 hover:text-slate-900 transition-all duration-300 hover:-translate-x-1">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-slate-900">{t.prescriptionSummary || 'Prescription Summary'}</h1>
          </div>

          <div className="flex items-center gap-3">
            {translating && (
              <div className="p-3 bg-white/80 backdrop-blur-md border border-blue-100 rounded-2xl flex items-center gap-3 text-blue-700 font-medium animate-pulse text-sm">
                <Languages className="w-4 h-4" />
                {t.translating || 'Translating...'}
              </div>
            )}

            {ttsState !== 'unsupported' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={ttsToggle}
                  disabled={ttsState === 'loading'}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border ${ttsState === 'playing'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                    : ttsState === 'paused'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : ttsState === 'loading'
                        ? 'bg-white/50 text-slate-400 border-slate-200 cursor-not-allowed'
                        : 'bg-white/85 backdrop-blur-md text-slate-700 border-white/90 hover:border-blue-300 hover:text-blue-600 shadow-sm'
                    }`}
                >
                  {ttsState === 'playing' ? (
                    <><VolumeX className="w-4 h-4" /><span>Pause</span></>
                  ) : ttsState === 'paused' ? (
                    <><Volume2 className="w-4 h-4" /><span>Resume</span></>
                  ) : ttsState === 'loading' ? (
                    <><Volume2 className="w-4 h-4 animate-pulse" /><span>Loading...</span></>
                  ) : (
                    <><Volume2 className="w-4 h-4" /><span>Read</span></>
                  )}
                </button>
                {(ttsState === 'playing' || ttsState === 'paused') && (
                  <button onClick={ttsStop} className="p-2 rounded-xl bg-white/85 backdrop-blur-md text-slate-500 hover:bg-red-50 hover:text-red-500 border border-white/90 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <Square className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:-translate-y-1.5 hover:scale-105 hover:shadow-xl hover:shadow-blue-200/50 z-0 hover:z-10 ${activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200 border border-blue-600 scale-[1.02]'
                    : 'bg-white/85 backdrop-blur-md border border-white/90 text-slate-600 hover:bg-white shadow-sm'
                    }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div>
              {activeTab === 'medications' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.medicationList || 'Medication List'}</h2>
                    <Calendar className="w-4 h-4 text-slate-400" />
                  </div>

                  {currentResult.medicines.length === 0 && (
                    <div className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl text-center text-slate-500 border border-white/80">
                      <p>{t.noMedicinesExtracted || 'No medicines extracted'}</p>
                    </div>
                  )}

                  {currentResult.medicines.map((med, i) => (
                    <div key={i} className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          {/* medicine name always from original — never translated */}
                          <h3 className="text-lg font-bold text-slate-900">{result.medicines[i]?.name ?? med.name}</h3>
                          <p className="text-slate-500 text-xs mt-0.5">{med.dosage}</p>
                        </div>
                        {/* timing badge translated via getMedField */}
                        <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-blue-100">
                          {getMedField(med.timing)}
                        </span>
                      </div>

                      {/* Timing slots use translated labels from i18n */}
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        <TimingSlot active={med.slots.morning} icon={<Sun className="w-4 h-4" />} label={t.morning || 'M'} />
                        <TimingSlot active={med.slots.afternoon} icon={<Clock className="w-4 h-4" />} label={t.afternoon || 'A'} />
                        <TimingSlot active={med.slots.evening} icon={<Sun className="w-4 h-4 rotate-180" />} label={t.evening || 'E'} />
                        <TimingSlot active={med.slots.night} icon={<Moon className="w-4 h-4" />} label={t.night || 'N'} />
                      </div>

                      <div className="space-y-2">
                        {/* purpose text translated via getMedField */}
                        <div className="flex gap-3 items-start">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-slate-600">
                            <span className="font-bold text-slate-900">{t.purpose || 'Purpose'}: </span>
                            {getMedField(med.purpose)}
                          </p>
                        </div>
                        {/* usageAlert translated — e.g. "after food" → "जेवणानंतर" */}
                        {med.usageAlert && (
                          <div className="flex gap-3 items-start p-3 bg-blue-50/80 rounded-xl border border-blue-100">
                            <Bell className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-blue-800 font-medium">{getMedField(med.usageAlert)}</p>
                          </div>
                        )}
                        {/* foodWarning translated */}
                        {med.foodWarning && (
                          <div className="flex gap-3 items-start p-3 bg-amber-50/80 rounded-xl border border-amber-100">
                            <Utensils className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-slate-700 font-medium">{getMedField(med.foodWarning)}</p>
                          </div>
                        )}
                        {/* caution translated */}
                        {med.caution && (
                          <div className="flex gap-3 items-start p-3 bg-red-50/80 rounded-xl border border-red-100">
                            <ShieldAlert className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-red-800 font-medium">{getMedField(med.caution)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'safety' && (
                <div className="space-y-3">
                  <h2 className="text-xs font-bold text-red-500 uppercase tracking-widest px-1">
                    {t.criticalSafetyAlerts || 'Critical Safety Alerts'}
                  </h2>

                  {currentResult.interactions.map((inter, i) => (
                    <div key={i} className="p-4 bg-white/85 backdrop-blur-xl border border-red-200 shadow-sm rounded-2xl flex gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                      <div>
                        {/* drug names in interactions always from original */}
                        <p className="font-bold text-red-900 text-sm">
                          Interaction: {result.interactions[i]?.drugs.join(' + ') ?? inter.drugs.join(' + ')}
                        </p>
                        {/* interaction description translated */}
                        <p className="text-red-700 text-xs mt-1">{getMedField(inter.description)}</p>
                      </div>
                    </div>
                  ))}

                  {currentResult.interactions.length === 0 && (
                    <div className="p-6 bg-white/85 backdrop-blur-xl shadow-sm border border-emerald-100 rounded-2xl text-center">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                      <p className="text-emerald-700 font-medium">{t.noCriticalAlerts || 'No critical alerts'}</p>
                      <p className="text-emerald-600 text-sm mt-1">{t.prescriptionLooksSafe || 'Safe'}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'warnings' && (
                <div className="space-y-3">
                  <h2 className="text-xs font-bold text-amber-600 uppercase tracking-widest px-1">
                    {t.warningsAndCautions || 'Warnings & Cautions'}
                  </h2>

                  {totalWarningsCount === 0 && (
                    <div className="p-6 bg-white/85 backdrop-blur-xl border border-white/90 shadow-sm rounded-2xl text-center text-slate-500">
                      <p>{t.noWarnings || 'No warnings'}</p>
                    </div>
                  )}

                  {safetyAlerts.map((alert, i) => (
                    <div key={`sa-${i}`} className="p-4 bg-white/85 backdrop-blur-xl border border-orange-200 shadow-sm rounded-2xl flex gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <Info className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      <p className="text-orange-900 text-sm font-medium">{getMedField(alert)}</p>
                    </div>
                  ))}

                  {warningsAndCautions.map((warning, i) => (
                    <div key={`wc-${i}`} className="p-4 bg-white/85 backdrop-blur-xl border border-amber-200 shadow-sm rounded-2xl flex gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0" />
                      <p className="text-amber-900 text-sm font-medium">{getMedField(warning)}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'actions' && (
                <div className="space-y-4">
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">
                    {t.actionableItems || 'Actionable Items'}
                  </h2>

                  <button
                    onClick={shareSchedule}
                    className="w-full flex items-center justify-center gap-3 bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 hover:-translate-y-1.5 hover:scale-105 hover:shadow-xl transition-all duration-300 active:scale-95"
                  >
                    <Share2 className="w-5 h-5" />
                    {t.shareWithCaregiver || 'Share with Caregiver'}
                  </button>

                  <button
                    onClick={() => navigate('/pharmacies')}
                    className="w-full flex items-center justify-center gap-3 bg-white/85 backdrop-blur-md border border-white/90 shadow-sm text-slate-700 font-bold py-4 rounded-2xl hover:bg-white hover:-translate-y-1.5 hover:scale-105 hover:shadow-xl transition-all duration-300 active:scale-95"
                  >
                    <MapPin className="w-5 h-5 text-red-500" />
                    {t.findNearbyPharmacies || 'Find Nearby Pharmacies'}
                  </button>

                  <div className="mt-6 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/60">
                    <p className="text-center text-slate-500 text-xs leading-relaxed font-medium">
                      {t.disclaimer || 'Disclaimer: Consult a doctor.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white/85 backdrop-blur-xl rounded-3xl border border-white/90 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{t.summary || 'Summary'}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-medium">{t.medicines || 'Medicines'}</span>
                  <span className="font-bold text-blue-600 text-base">{currentResult.medicines.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-medium">{t.interactions || 'Interactions'}</span>
                  <span className={`font-bold text-base ${currentResult.interactions.length > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {currentResult.interactions.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-medium">{t.warnings || 'Warnings'}</span>
                  <span className={`font-bold text-base ${totalWarningsCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {totalWarningsCount}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/85 backdrop-blur-xl rounded-3xl border border-white/90 p-5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{t.medicationList || 'Medication List'}</h3>
              <div className="space-y-2">
                {currentResult.medicines.map((med, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTab('medications')}
                    className="w-full flex items-center justify-between p-3 bg-white/60 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-xl transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.03] hover:shadow-md hover:z-10 text-left shadow-sm"
                  >
                    <div>
                      {/* medicine name always from original — never translated */}
                      <p className="text-sm font-semibold text-slate-800 leading-tight">
                        {result.medicines[i]?.name ?? med.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{med.dosage}</p>
                    </div>
                  </button>
                ))}
                {currentResult.medicines.length === 0 && (
                  <p className="text-slate-400 text-sm text-center py-2">{t.noMedicinesFound || 'No medicines found'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimingSlot({ active, icon, label }: { active: boolean; icon: ReactNode; label: string }) {
  return (
    <div className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-colors ${active ? 'bg-blue-600 border-blue-600 text-white shadow-sm' : 'bg-white/50 border-slate-100 text-slate-400'}`}>
      {icon}
      <span className="text-[10px] font-bold">{label}</span>
    </div>
  );
}