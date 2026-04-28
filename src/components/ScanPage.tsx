import React from 'react';
import logoImg from '../logo.jpeg';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Upload, Info, Loader2, X, Check,
  Home, Clock, HelpCircle, Users, MapPin, Globe, Shield, RotateCcw,
  Camera, Sparkles, Pill, ShieldAlert, Activity, ChevronDown,
  UserCheck, Brain, ShieldCheck, Share2, Volume2
} from 'lucide-react';
import { processPrescription } from '../services/aiService';
import { PrescriptionResult, UserProfile, Lang } from '../types';
import { UI } from '../i18n';

interface ScanPageProps {
  onResult: (result: PrescriptionResult) => void;
  profile: UserProfile;
  lang: Lang;
  onLangChange: (lang: Lang) => void;
}

interface ScanHistoryEntry {
  id: string;
  date: string;
  medicineCount: number;
  interactionCount: number;
  medicines: string[];
  fullResult?: PrescriptionResult;
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .rxb-root { font-family: 'Inter', sans-serif; }

  /* ── ABSTRACT BACKGROUND & Pattern ── */
  .rxb-bg-pattern {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image: 
      radial-gradient(#a8c0e4 1px, transparent 1px),
      radial-gradient(#a8c0e4 1px, transparent 1px);
    background-size: 40px 40px;
    background-position: 0 0, 20px 20px;
    opacity: 0.05;
    z-index: 0;
    pointer-events: none;
  }

  /* ── LOW TRANSPARENCY MEDICAL ELEMENTS ── */
  .rxb-floating-layer {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
    opacity: 0.08;
  }

  .rxb-float-item {
    position: absolute;
    filter: drop-shadow(0px 8px 16px rgba(0,0,0,0.06));
  }

  @keyframes float-1 {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(5deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }
  @keyframes float-2 {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(-8deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }
  @keyframes float-3 {
    0% { transform: translateY(0px) rotate(0deg) scale(1); }
    50% { transform: translateY(-20px) rotate(10deg) scale(1.05); }
    100% { transform: translateY(0px) rotate(0deg) scale(1); }
  }

  .float-anim-1 { animation: float-1 8s ease-in-out infinite; }
  .float-anim-2 { animation: float-2 6s ease-in-out infinite; }
  .float-anim-3 { animation: float-3 10s ease-in-out infinite; }

  /* ── LIVELY ANIMATIONS & HOVER EFFECTS ── */
  @keyframes hero-float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
    100% { transform: translateY(0px); }
  }
  .rxb-illo-wrapper {
    animation: hero-float 6s ease-in-out infinite;
    position: relative;
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }

  .rxb-nav-link {
    display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px;
    font-size: 13.5px; color: #4a5d7a; cursor: pointer; font-weight: 500; text-decoration: none;
    background: none; border: none; white-space: nowrap; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    font-family: 'Inter', sans-serif;
  }
  .rxb-nav-link:hover { background: rgba(255,255,255,0.6); color: #1a6fd4; transform: translateY(-2px); }
  
  .rxb-nav-link.active { 
    background: #1a6fd4; 
    color: #ffffff; 
    font-weight: 600; 
    box-shadow: 0 4px 12px rgba(26,111,212,0.3); 
  }

  .rxb-scan-card {
    background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border-radius: 22px; padding: 44px 40px 36px; border: 1px solid rgba(255,255,255,0.9);
    box-shadow: 0 8px 40px rgba(26,111,212,0.06); display: flex; flex-direction: column;
    align-items: center; text-align: center; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative; z-index: 1;
  }
  .rxb-scan-card:hover { transform: translateY(-6px); box-shadow: 0 16px 50px rgba(26,111,212,0.12); }

  .rxb-btn-primary {
    width: 100%; background: #1a6fd4; color: #fff; border: none; border-radius: 50px;
    padding: 17px 28px; font-size: 15.5px; font-weight: 700; font-family: 'Inter', sans-serif;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;
    margin-bottom: 12px; box-shadow: 0 4px 14px rgba(26, 111, 212, 0.25); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .rxb-btn-primary:hover:not(:disabled) { background: #155db8; transform: translateY(-3px) scale(1.01); box-shadow: 0 8px 25px rgba(26, 111, 212, 0.35); }
  .rxb-btn-primary:active:not(:disabled) { transform: translateY(0) scale(0.98); }
  .rxb-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

  .rxb-btn-secondary {
    width: 100%; background: #fff; color: #1a6fd4; border: 1.5px solid #1a6fd4;
    border-radius: 50px; padding: 16px 28px; font-size: 15.5px; font-weight: 600;
    font-family: 'Inter', sans-serif; cursor: pointer; display: flex; align-items: center;
    justify-content: center; gap: 10px; margin-bottom: 22px; box-shadow: 0 2px 8px rgba(26, 111, 212, 0.08);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .rxb-btn-secondary:hover:not(:disabled) { background: #f0f5fd; border-color: #155db8; color: #155db8; transform: translateY(-3px) scale(1.01); box-shadow: 0 6px 20px rgba(26, 111, 212, 0.15); }
  .rxb-btn-secondary:active:not(:disabled) { transform: translateY(0) scale(0.98); }
  .rxb-btn-secondary:disabled { opacity: 0.55; cursor: not-allowed; }

  .rxb-feat-wrapper {
    display: grid; grid-template-columns: repeat(4, 1fr); background: rgba(255,255,255,0.85); backdrop-filter: blur(12px);
    border-radius: 18px; border: 1px solid rgba(255,255,255,0.9); overflow: hidden; max-width: 1008px; margin: 0 auto; padding: 0 8px;
    box-shadow: 0 4px 20px rgba(26,58,107,0.03); transition: all 0.3s ease; position: relative; z-index: 1;
  }
  .rxb-feat-wrapper:hover { box-shadow: 0 12px 30px rgba(26,58,107,0.08); }
  .rxb-feat { padding: 26px 20px; display: flex; align-items: flex-start; gap: 14px; border-right: 1px solid rgba(226,234,245,0.6); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; }
  .rxb-feat:last-child { border-right: none; }
  .rxb-feat:hover { background: rgba(255,255,255,0.95); transform: translateY(-3px); }

  .rxb-hero-title { font-size: 54px; font-weight: 800; color: #1a6fd4; line-height: 1.05; margin-bottom: 10px; letter-spacing: -0.02em; }
  .rxb-cam-btn-capture { width: 80px; height: 80px; border-radius: 50%; background: white; border: 4px solid #cbd5e1; display: flex; align-items: center; justify-content: center; transition: transform 0.1s; }
  .rxb-cam-btn-capture:active { transform: scale(0.95); }
  
  .rxb-lang-dropdown { position: relative; }
  .rxb-lang-dropdown-menu {
    position: absolute; top: calc(100% + 8px); right: 0; background: white; border: 1px solid #e2eaf5; border-radius: 12px;
    box-shadow: 0 8px 24px rgba(26,58,107,0.12); overflow: hidden; z-index: 200; min-width: 140px; animation: fadeIn 0.2s ease-out;
  }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  .rxb-lang-option {
    display: flex; align-items: center; gap: 10px; padding: 11px 16px; font-size: 13.5px; font-weight: 500;
    color: #4a5d7a; cursor: pointer; font-family: 'Inter', sans-serif; background: none; border: none; width: 100%; text-align: left;
    transition: background 0.12s;
  }
  .rxb-lang-option:hover { background: #f0f5fd; color: #1a6fd4; }
  .rxb-lang-option.selected { background: #e2ecfc; color: #1a6fd4; font-weight: 700; }
  
  .rxb-clear-btn { width: 100%; padding: 16px; background: rgba(255,255,255,0.7); color: #ef4444; border: 1px solid #fca5a5; border-radius: 16px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.15s; font-family: 'Inter', sans-serif; }
  .rxb-clear-btn:hover { background: #fef2f2; transform: translateY(-2px); }

  .rxb-history-row { display: grid; grid-template-columns: 2fr 1fr 1fr 3fr; padding: 20px 24px; align-items: center; cursor: pointer; transition: all 0.2s ease; }
  .rxb-history-row:hover { background: rgba(248, 250, 252, 0.9); transform: translateX(4px); }

  /* ── HOW IT WORKS SPECIFIC CSS (Vertical Timeline Layout) ── */
  .hiw-step-card {
    background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.9);
    border-radius: 20px; box-shadow: 0 4px 20px rgba(26,58,107,0.04); padding: 24px;
    display: flex; flex-direction: row; align-items: center; text-align: left; gap: 24px;
    width: 100%; max-width: 540px; margin: 0 auto; position: relative;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .hiw-step-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(26,111,212,0.08); background: rgba(255,255,255,0.95); z-index: 10; }
  
  .hiw-step-number {
    position: absolute; top: -12px; left: -12px; width: 32px; height: 32px;
    background: #1a6fd4; color: white; border-radius: 50%; display: flex;
    align-items: center; justify-content: center; font-size: 14px; font-weight: 800;
    box-shadow: 0 4px 10px rgba(26,111,212,0.3); border: 3px solid #fff; z-index: 2;
  }
  
  .hiw-icon-wrap {
    width: 72px; height: 72px; border-radius: 50%; display: flex;
    align-items: center; justify-content: center; flex-shrink: 0;
    background: #fff; box-shadow: 0 6px 16px rgba(26,58,107,0.06); border: 2px solid rgba(255,255,255,0.9);
    transition: all 0.3s ease;
  }
  
@media (max-width: 768px) {
  .rxb-scan-grid { grid-template-columns: 1fr; }
  .rxb-hero-title { font-size: 32px; }
  .rxb-feat-wrapper { grid-template-columns: 1fr 1fr; }
  @media (max-width: 768px) {
    .rxb-hero-grid { grid-template-columns: 1fr !important; padding: 24px 16px !important; gap: 24px !important; }
    .rxb-feat-wrapper { grid-template-columns: 1fr !important; }
    .rxb-history-row { grid-template-columns: 1fr 1fr !important; }
    .rxb-nav-link { font-size: 12px !important; padding: 6px 8px !important; }
  }
  .rxb-illo-wrapper { display: none; }
}  
.hiw-step-card:hover .hiw-icon-wrap {
    transform: scale(1.05); box-shadow: 0 10px 24px rgba(26,111,212,0.12);
  }
`;

function HeroIllustration() {
  return (
    <svg width="420" height="260" viewBox="0 0 420 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 12px 24px rgba(26,58,107,0.12))' }}>
      <ellipse cx="210" cy="220" rx="160" ry="20" fill="rgba(168, 192, 228, 0.4)" />
      <path d="M 50 90 Q 90 80 90 40 Q 90 80 130 90 L 130 140 Q 130 190 90 210 Q 50 190 50 140 Z" fill="#6ba4e9" opacity="0.9" stroke="#fff" strokeWidth="4" strokeLinejoin="round" />
      <rect x="82" y="105" width="16" height="40" rx="4" fill="#fff" />
      <rect x="70" y="117" width="40" height="16" rx="4" fill="#fff" />
      <rect x="140" y="50" width="130" height="170" rx="12" fill="#fff" stroke="#c2d6ed" strokeWidth="4" />
      <rect x="185" y="35" width="40" height="20" rx="6" fill="#8cbcf2" />
      <circle cx="205" cy="45" r="4" fill="#fff" />
      <text x="160" y="110" fontFamily="Georgia, serif" fontWeight="bold" fontSize="36" fill="#1a6fd4">Rx</text>
      <rect x="160" y="135" width="90" height="4" rx="2" fill="#e2eaf5" />
      <rect x="160" y="155" width="70" height="4" rx="2" fill="#e2eaf5" />
      <rect x="160" y="175" width="50" height="4" rx="2" fill="#e2eaf5" />
      <path d="M 160 200 Q 170 195 175 200 T 190 200 T 205 195" stroke="#a8c0e4" strokeWidth="2" fill="none" />
      <rect x="280" y="100" width="60" height="80" rx="10" fill="#fff" stroke="#c2d6ed" strokeWidth="4" />
      <rect x="280" y="120" width="60" height="40" fill="#1a6fd4" />
      <rect x="285" y="80" width="50" height="20" rx="6" fill="#8cbcf2" />
      <rect x="285" y="90" width="50" height="10" fill="#8cbcf2" />
      <rect x="306" y="130" width="8" height="20" rx="2" fill="#fff" />
      <rect x="300" y="136" width="20" height="8" rx="2" fill="#fff" />
      <rect x="320" y="170" width="80" height="50" rx="8" fill="#e9f3f5" stroke="#c2d6ed" strokeWidth="4" />
      <circle cx="340" cy="185" r="6" fill="#fff" />
      <circle cx="360" cy="185" r="6" fill="#fff" />
      <circle cx="380" cy="185" r="6" fill="#fff" />
      <circle cx="340" cy="205" r="6" fill="#fff" />
      <circle cx="360" cy="205" r="6" fill="#fff" />
      <circle cx="380" cy="205" r="6" fill="#fff" />
      <g transform="translate(100, 215) rotate(-20)">
        <rect x="0" y="0" width="16" height="14" fill="#fff" rx="7" />
        <rect x="14" y="0" width="16" height="14" fill="#1a6fd4" rx="7" />
        <rect x="10" y="0" width="10" height="14" fill="#1a6fd4" />
      </g>
      <g transform="translate(130, 225) rotate(15)">
        <rect x="0" y="0" width="12" height="10" fill="#fff" rx="5" />
        <rect x="11" y="0" width="12" height="10" fill="#1a6fd4" rx="5" />
        <rect x="8" y="0" width="5" height="10" fill="#1a6fd4" />
      </g>
    </svg>
  );
}

// ── BACKGROUND SVG ASSETS ──
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

function LogoIcon() {
  return (
    <div style={{ width: 45, height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <img
        src={logoImg}
        alt="MedSutra AI Logo"
        style={{
          width: 45,
          height: 45,
          objectFit: 'contain',
          mixBlendMode: 'multiply',
          borderRadius: '20%',
        }}
      />
    </div>
  );
}

const LANG_OPTIONS: { value: Lang; label: string; nativeLabel: string; flag: string }[] = [
  { value: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { value: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' },
  { value: 'mr', label: 'Marathi', nativeLabel: 'मराठी', flag: '🇮🇳' },
];

export default function ScanPage({ onResult, profile, lang, onLangChange }: ScanPageProps) {
  // @ts-ignore
  const t = UI[lang] as Record<string, string>;
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<'scan' | 'history' | 'howItWorks' | 'about'>('scan');
  const [historyData, setHistoryData] = useState<ScanHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // Vertical steps configuration utilizing the matching icons
  const howItWorksSteps = [
    { id: 1, title: t.step1Title || 'Profile Setup', desc: t.step1Desc || 'Create your user profile.', icon: <UserCheck size={32} color="#1a6fd4" />, bg: '#e8f0fe' },
    {
      id: 2, title: t.step2Title || 'Upload', desc: t.step2Desc || 'Scan or upload prescription.', icon: (
        <div style={{ position: 'relative', display: 'flex' }}>
          <Camera size={30} color="#1e9e52" />
          <div style={{ position: 'absolute', bottom: -6, right: -8, background: '#fff', borderRadius: '50%', padding: '3px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <Upload size={12} color="#1e9e52" strokeWidth={3} />
          </div>
        </div>
      ), bg: '#e6f9ee'
    },
    { id: 3, title: t.step3Title || 'AI Analysis', desc: t.step3Desc || 'AI extracts the details.', icon: <Brain size={32} color="#7c5cdc" />, bg: '#eeebff' },
    { id: 4, title: t.step4Title || 'Medicines', desc: t.step4Desc || 'Clear names and dosages.', icon: <Pill size={32} color="#d4920a" />, bg: '#fff8e0' },
    { id: 5, title: t.step5Title || 'Safety Check', desc: t.step5Desc || 'Alerts for interactions.', icon: <ShieldCheck size={32} color="#dc2626" />, bg: '#fef2f2' },
    {
      id: 6, title: t.step6Title || 'Actions', desc: t.step6Desc || 'Find, share, listen & more.', icon: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center', width: '42px' }}>
          <div style={{ background: 'rgba(255,255,255,0.7)', padding: '2px', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}><MapPin size={11} color="#0d9488" /></div>
          <div style={{ background: 'rgba(255,255,255,0.7)', padding: '2px', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}><Share2 size={11} color="#0d9488" /></div>
          <div style={{ background: 'rgba(255,255,255,0.7)', padding: '2px', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}><Volume2 size={11} color="#0d9488" /></div>
          <div style={{ background: 'rgba(255,255,255,0.7)', padding: '2px', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}><Globe size={11} color="#0d9488" /></div>
          <div style={{ background: 'rgba(255,255,255,0.7)', padding: '2px', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}><Clock size={11} color="#0d9488" /></div>
        </div>
      ), bg: '#f0fdfa'
    },
  ];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleLangChange = (newLang: Lang) => { onLangChange(newLang); setLangDropdownOpen(false); };
  const handleOutsideClick = () => { if (langDropdownOpen) setLangDropdownOpen(false); };

  useEffect(() => {
    if (activeTab === 'history') {
      try {
        const stored = JSON.parse(localStorage.getItem('rxbridge_scan_history') || '[]');
        setHistoryData(stored);
      } catch {
        setHistoryData([]);
      }
    }
  }, [activeTab]);

  const openCamera = async () => {
    setError(null); setCapturedImage(null); setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
    } catch {
      setError('Camera access denied. Please allow camera permission or use Upload.');
      setCameraOpen(false);
    }
  };

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCameraOpen(false); setCapturedImage(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current, c = canvasRef.current;
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext('2d')?.drawImage(v, 0, 0);
    setCapturedImage(c.toDataURL('image/jpeg', 0.9));
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  };

  const useCapturedPhoto = async () => {
    if (!capturedImage || !canvasRef.current) return;
    setCameraOpen(false);
    canvasRef.current.toBlob(async (blob) => { if (blob) await processImage(blob); }, 'image/jpeg', 0.9);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (file) await processImage(file);
  };

  const processImage = async (file: File | Blob) => {
    setLoading(true); setError(null);
    try {
      setStatus('AI Vision analyzing prescription...');
      const result = await processPrescription('', profile, file);
      onResult(result); navigate('/result');
    } catch (err: any) {
      const msg: string = err.message || '';
      if (msg.includes('RESCAN REQUIRED')) setError(t.errorRescan || 'Rescan required');
      else if (msg.includes('quota exceeded') || msg.includes('unavailable') || msg.includes('Gemini')) setError(t.errorGeminiFailed || 'Service unavailable');
      else setError(t.errorScanFailed || 'Scan failed');
    } finally { setLoading(false); setStatus(''); }
  };

  const currentLangOption = LANG_OPTIONS.find(o => o.value === lang) || LANG_OPTIONS[0];
  const isActive = (path: string) => location.pathname === path;

  const handleHistoryClick = (item: ScanHistoryEntry) => {
    if (item.fullResult) {
      onResult(item.fullResult);
      navigate('/result');
    } else {
      alert("Full prescription data wasn't saved for this older entry.");
    }
  };

  if (cameraOpen) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'black', zIndex: 50, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'black' }}>
          <button onClick={closeCamera} style={{ padding: 8, background: 'none', border: 'none', cursor: 'pointer' }}>
            <X style={{ width: 24, height: 24, color: 'white' }} />
          </button>
          <h2 style={{ color: 'white', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 15 }}>{t.scanTitle || 'Scan'}</h2>
          <div style={{ width: 40 }} />
        </div>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {!capturedImage ? (
            <>
              <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <div style={{ border: '2px dashed white', borderRadius: 16, width: '80%', height: '60%', opacity: 0.6 }} />
              </div>
              <p style={{ position: 'absolute', bottom: 96, left: 0, right: 0, textAlign: 'center', color: 'white', fontSize: 13, opacity: 0.75, fontFamily: 'Inter, sans-serif' }}>
                {t.cameraAlignHint || 'Align inside box'}
              </p>
            </>
          ) : (
            <img src={capturedImage} alt="Captured" style={{ width: '100%', height: '100%', objectFit: 'contain', background: 'black' }} />
          )}
        </div>
        <div style={{ background: 'black', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
          {!capturedImage ? (
            <>
              <button onClick={closeCamera} style={{ width: 56, height: 56, borderRadius: '50%', background: '#374151', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X style={{ width: 22, height: 22, color: 'white' }} />
              </button>
              <button onClick={capturePhoto} className="rxb-cam-btn-capture">
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'white', border: '2px solid #e2e8f0' }} />
              </button>
              <button onClick={() => { closeCamera(); fileInputRef.current?.click(); }} style={{ width: 56, height: 56, borderRadius: '50%', background: '#374151', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Upload style={{ width: 22, height: 22, color: 'white' }} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { setCapturedImage(null); openCamera(); }}
                style={{ flex: 1, padding: '16px', borderRadius: 16, background: '#374151', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 600, fontFamily: 'Inter, sans-serif', fontSize: 15 }}>
                <X style={{ width: 18, height: 18 }} /> {t.cameraRetake || 'Retake'}
              </button>
              <button onClick={useCapturedPhoto}
                style={{ flex: 1, padding: '16px', borderRadius: 16, background: '#1a6fd4', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 600, fontFamily: 'Inter, sans-serif', fontSize: 15 }}>
                <Check style={{ width: 18, height: 18 }} /> {t.cameraUsePhoto || 'Use Photo'}
              </button>
            </>
          )}
        </div>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    );
  }

  return (
    <div className="rxb-root"
      style={{ fontFamily: 'Inter, sans-serif', background: '#E9F3F5', color: '#1a3a6b', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}
      onClick={handleOutsideClick}
    >
      <style>{css}</style>
      <div className="rxb-bg-pattern"></div>
      <BackgroundElements />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── NAV ── */}
        <nav style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(226,234,245,0.6)', height: 68, display: 'flex', alignItems: 'center', padding: '0 36px', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 44, flexShrink: 0 }}>
            <LogoIcon />
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#1a3a6b', lineHeight: 1.2 }}>MedSutra AI</div>
              <div style={{ fontSize: 11, color: '#7b93b8', fontWeight: 400 }}>{t.navTagline || 'Smart Medicine Assistant'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <button onClick={() => setActiveTab('scan')} className={`rxb-nav-link ${activeTab === 'scan' ? 'active' : ''}`}><Home size={15} /> {t.navHome || 'Home'}</button>
            <button onClick={() => setActiveTab('history')} className={`rxb-nav-link ${activeTab === 'history' ? 'active' : ''}`}><Clock size={15} /> {t.navHistory || 'History'}</button>
            <button onClick={() => setActiveTab('howItWorks')} className={`rxb-nav-link ${activeTab === 'howItWorks' ? 'active' : ''}`}><HelpCircle size={15} /> {t.navHowItWorks || 'How It Works'}</button>
            <button onClick={() => setActiveTab('about')} className={`rxb-nav-link ${activeTab === 'about' ? 'active' : ''}`}><Users size={15} /> {t.navAboutUs || 'About Us'}</button>
            <a href="/pharmacies" className={`rxb-nav-link`}><MapPin size={15} /> {t.navNearbyPharmacies || 'Nearby Pharmacies'}</a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginLeft: 'auto' }}>
            <div className="rxb-lang-dropdown" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setLangDropdownOpen(prev => !prev)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, color: '#4a5d7a', cursor: 'pointer', fontWeight: 500,
                  background: langDropdownOpen ? '#f0f5fd' : 'transparent', border: '1px solid', borderColor: langDropdownOpen ? '#a8c0e4' : 'transparent',
                  borderRadius: 8, padding: '7px 12px', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
                }}
              >
                <Globe size={15} />
                <span>{currentLangOption.nativeLabel}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ transform: langDropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.15s' }}>
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>
              {langDropdownOpen && (
                <div className="rxb-lang-dropdown-menu">
                  {LANG_OPTIONS.map((option) => (
                    <button key={option.value} onClick={() => handleLangChange(option.value)} className={`rxb-lang-option ${lang === option.value ? 'selected' : ''}`}>
                      <span style={{ fontSize: 16 }}>{option.flag}</span>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.2 }}>{option.nativeLabel}</div>
                        <div style={{ fontSize: 11, color: '#7b93b8', marginTop: 1 }}>{option.label}</div>
                      </div>
                      {lang === option.value && <span style={{ marginLeft: 'auto', color: '#1a6fd4', fontSize: 14 }}>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link to="/profile">
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1a6fd4', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                  <path d="M12 12c2.7 0 4-1.8 4-4s-1.3-4-4-4-4 1.8-4 4 1.3 4 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z" />
                </svg>
              </div>
            </Link>
          </div>
        </nav>

        {/* ── SCAN TAB ── */}
        {activeTab === 'scan' && (
          <>
            <div className="rxb-hero-grid" style={{ display: "grid", gridTemplateColumns: '1.2fr 1fr', gap: 48, padding: '52px 56px 36px', maxWidth: 1120, margin: '0 auto', alignItems: 'center' }}>
              <div>
                <div className="rxb-hero-title">MedSutra AI</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#1a3a6b', marginBottom: 18 }}>
                  {'Your Prescription, Our Priority'}
                </div>
                <p style={{ fontSize: 14.5, color: '#4b5563', lineHeight: 1.7, maxWidth: 360, marginBottom: 36 }}>
                  {t.heroSubtext || 'Upload your prescription and get clear, safe and easy to understand information about your medicines.'}
                </p>
                <div className="rxb-illo-wrapper">
                  <HeroIllustration />
                </div>
              </div>

              <div className="rxb-scan-card">
                <div style={{ width: 84, height: 84, background: '#e8f0fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
                  <svg style={{ width: 40, height: 40 }} viewBox="0 0 24 24" fill="none" stroke="#1a6fd4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
                <div style={{ fontSize: 23, fontWeight: 700, color: '#1a3a6b', marginBottom: 10 }}>{t.scanTitle || 'Scan Prescription'}</div>
                <div style={{ fontSize: 14, color: '#7b93b8', lineHeight: 1.55, marginBottom: 30 }}>{t.scanSubtitle || 'Take a photo or upload an image.'}</div>

                <button className="rxb-btn-primary" onClick={openCamera} disabled={loading}>
                  {loading ? <Loader2 style={{ width: 19, height: 19, animation: 'spin 1s linear infinite' }} /> :
                    <svg style={{ width: 19, height: 19 }} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  }
                  {loading ? (t.processing || 'Processing...') : (t.useCamera || 'Use Camera')}
                </button>

                <button className="rxb-btn-secondary" onClick={() => fileInputRef.current?.click()} disabled={loading}>
                  <svg style={{ width: 18, height: 18, color: 'currentColor' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 16 12 12 8 16" />
                    <line x1="12" y1="12" x2="12" y2="21" />
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                  </svg>
                  {t.uploadGallery || 'Upload from Gallery'}
                </button>

                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" style={{ display: 'none' }} />

                {status && <p style={{ marginTop: 12, color: '#1a6fd4', fontWeight: 500, fontSize: 13.5, animation: 'pulse 2s infinite' }}>{status}</p>}
                {error && (
                  <div style={{ marginTop: 16, padding: '14px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, fontSize: 13, color: '#dc2626', textAlign: 'left', display: 'flex', gap: 10 }}>
                    <Info style={{ width: 18, height: 18, flexShrink: 0, marginTop: 1 }} /><p>{error}</p>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#4b5563', marginTop: error || status ? 16 : 0 }}>
                  <Shield size={14} style={{ flexShrink: 0, color: '#4b5563' }} />
                  {t.privacyNote || 'Data kept'} <span style={{ color: '#1a6fd4', fontWeight: 600 }}>&nbsp;{t.privacySafe || 'safe'}&nbsp;</span> and <span style={{ color: '#1a6fd4', fontWeight: 600 }}>&nbsp;{t.privacyPrivate || 'private'}</span>
                </div>
              </div>
            </div>

            <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 56px 48px' }}>
              <div className="rxb-feat-wrapper">
                <div className="rxb-feat">
                  <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#e6f9ee', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg style={{ width: 22, height: 22 }} viewBox="0 0 24 24" fill="none" stroke="#1e9e52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 14.5, fontWeight: 700, color: '#1a3a6b', marginBottom: 5 }}>{t.featSafeTitle || 'Safe'}</h3>
                    <p style={{ fontSize: 12.5, color: '#7b93b8', lineHeight: 1.55 }}>{t.featSafeDesc || 'AI checks interactions.'}</p>
                  </div>
                </div>

                <div className="rxb-feat">
                  <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#eeebff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg style={{ width: 22, height: 22 }} viewBox="0 0 24 24" fill="none" stroke="#7c5cdc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 14.5, fontWeight: 700, color: '#1a3a6b', marginBottom: 5 }}>{t.featMultiLangTitle || 'Multi-Language'}</h3>
                    <p style={{ fontSize: 12.5, color: '#7b93b8', lineHeight: 1.55 }}>{t.featMultiLangDesc || 'Instant translation.'}</p>
                  </div>
                </div>

                <div className="rxb-feat">
                  <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#e2ecfc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg style={{ width: 22, height: 22 }} viewBox="0 0 24 24" fill="none" stroke="#1a6fd4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 14.5, fontWeight: 700, color: '#1a3a6b', marginBottom: 5 }}>{t.featReliableTitle || 'Reliable'}</h3>
                    <p style={{ fontSize: 12.5, color: '#7b93b8', lineHeight: 1.55 }}>{t.featReliableDesc || 'Accurate info you trust.'}</p>
                  </div>
                </div>

                <div className="rxb-feat">
                  <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#fff8e0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg style={{ width: 22, height: 22 }} viewBox="0 0 24 24" fill="none" stroke="#d4920a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 14.5, fontWeight: 700, color: '#1a3a6b', marginBottom: 5 }}>{t.featFastTitle || 'Fast & Easy'}</h3>
                    <p style={{ fontSize: 12.5, color: '#7b93b8', lineHeight: 1.55 }}>{t.featFastDesc || 'Results in seconds.'}</p>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center', padding: '30px 0 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontSize: 12.5, color: '#8fa3c0', flexDirection: 'column', lineHeight: 1.7 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <svg style={{ width: 14, height: 14, opacity: 0.55 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  {t.footerLine1 || 'Not a replacement for medical advice.'}
                </div>
                {t.footerLine2 || 'Always consult your doctor.'}
              </div>
            </div>
          </>
        )}

        {/* ── HOW IT WORKS TAB ── */}
        {activeTab === 'howItWorks' && (
          <div style={{ maxWidth: 800, margin: '0 auto', padding: '52px 24px' }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#1a3a6b', marginBottom: '12px' }}>
                {t.howToUseTitle || 'How to Use MedSutra AI'}
              </h2>
              <p style={{ fontSize: '16px', color: '#4b5563', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
                {t.howToUseSubtitle || 'Just upload your prescription and get clear, safe instructions in seconds.'}
              </p>
            </div>

            {/* Vertical Step-by-Step Flow */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', paddingBottom: '32px' }}>
              {howItWorksSteps.map((step, index) => (
                <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  <div className="hiw-step-card">
                    <div className="hiw-step-number">{step.id}</div>
                    <div className="hiw-icon-wrap" style={{ background: step.bg }}>
                      {step.icon}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1a3a6b', marginBottom: '4px' }}>
                        {step.title}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#4a5d7a', lineHeight: 1.5 }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {/* Vertical Connector */}
                  {index < howItWorksSteps.length - 1 && (
                    <div style={{ padding: '12px 0', color: '#a8c0e4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ChevronDown size={32} strokeWidth={2.5} opacity={0.8} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Micro Features at bottom */}
            <div style={{ marginTop: '32px' }}>
              <div className="rxb-feat-wrapper">
                <div className="rxb-feat">
                  <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#e6f9ee', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg style={{ width: 22, height: 22 }} viewBox="0 0 24 24" fill="none" stroke="#1e9e52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 14.5, fontWeight: 700, color: '#1a3a6b', marginBottom: 5 }}>{t.featSafeTitle || 'Safe'}</h3>
                    <p style={{ fontSize: 12.5, color: '#7b93b8', lineHeight: 1.55 }}>{t.featSafeDesc || 'AI checks interactions.'}</p>
                  </div>
                </div>

                <div className="rxb-feat">
                  <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#eeebff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg style={{ width: 22, height: 22 }} viewBox="0 0 24 24" fill="none" stroke="#7c5cdc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 14.5, fontWeight: 700, color: '#1a3a6b', marginBottom: 5 }}>{t.featMultiLangTitle || 'Multi-Language'}</h3>
                    <p style={{ fontSize: 12.5, color: '#7b93b8', lineHeight: 1.55 }}>{t.featMultiLangDesc || 'Instant translation.'}</p>
                  </div>
                </div>

                <div className="rxb-feat">
                  <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#e2ecfc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg style={{ width: 22, height: 22 }} viewBox="0 0 24 24" fill="none" stroke="#1a6fd4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 14.5, fontWeight: 700, color: '#1a3a6b', marginBottom: 5 }}>{t.featReliableTitle || 'Reliable'}</h3>
                    <p style={{ fontSize: 12.5, color: '#7b93b8', lineHeight: 1.55 }}>{t.featReliableDesc || 'Accurate info you trust.'}</p>
                  </div>
                </div>

                <div className="rxb-feat">
                  <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#fff8e0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg style={{ width: 22, height: 22 }} viewBox="0 0 24 24" fill="none" stroke="#d4920a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 14.5, fontWeight: 700, color: '#1a3a6b', marginBottom: 5 }}>{t.featFastTitle || 'Fast & Easy'}</h3>
                    <p style={{ fontSize: 12.5, color: '#7b93b8', lineHeight: 1.55 }}>{t.featFastDesc || 'Results in seconds.'}</p>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center', padding: '30px 0 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontSize: 12.5, color: '#8fa3c0', flexDirection: 'column', lineHeight: 1.7 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <svg style={{ width: 14, height: 14, opacity: 0.55 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  {t.footerLine1 || 'Not a replacement for medical advice.'}
                </div>
                {t.footerLine2 || 'Always consult your doctor.'}
              </div>
            </div>

          </div>
        )}

        {/* ── ABOUT TAB ── */}
        {activeTab === 'about' && (
          <div style={{ maxWidth: 800, margin: '0 auto', padding: '52px 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#1a3a6b', marginBottom: '12px' }}>
                {t.aboutTitle}
              </h2>
              <p style={{ fontSize: '16px', color: '#4b5563', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
                {t.aboutTagline}
              </p>
            </div>
            <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: '40px', marginBottom: '32px', borderLeft: '4px solid #1a6fd4' }}>
              <div style={{ marginBottom: '24px' }}>
                <img
                  src={logoImg}
                  alt="MedSutra AI Logo"
                  style={{
                    width: 72,
                    height: 72,
                    objectFit: 'contain',
                    mixBlendMode: 'multiply',
                  }}
                />
              </div>
              <p style={{ fontSize: '18px', color: '#374151', lineHeight: 1.8 }}>
                {t.aboutMission1}
              </p>
              <p style={{ fontSize: '18px', color: '#374151', lineHeight: 1.8, marginTop: '16px' }}>
                {t.aboutMission2}
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {[
                { emoji: '🔍', title: t.aboutUnderstandable, desc: t.aboutUnderstandableDesc },
                { emoji: '🌍', title: t.aboutAccessible, desc: t.aboutAccessibleDesc },
                { emoji: '🛡️', title: t.aboutSafe, desc: t.aboutSafeDesc },
              ].map(({ emoji, title, desc }) => (
                <div key={title} style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: '24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>{emoji}</div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1a3a6b', marginBottom: '8px' }}>{title}</h3>
                  <p style={{ fontSize: '13px', color: '#7b93b8', lineHeight: 1.6 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {activeTab === 'history' && (
          <div style={{ maxWidth: 1040, margin: '0 auto', padding: '48px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#7b93b8', fontSize: 14, fontWeight: 700, letterSpacing: 0.5 }}>
                {t.historyHeader || 'HISTORY'}
              </div>
              <RotateCcw size={18} color="#7b93b8" />
            </div>

            {historyData.length === 0 ? (
              <div style={{ p: 24, textAlign: 'center', color: '#7b93b8', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderRadius: 16 }}>
                You have no scanned prescriptions yet.
              </div>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.9)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(26,58,107,0.03)', marginBottom: 24 }}>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 3fr', padding: '16px 24px', borderBottom: '1px solid rgba(226,234,245,0.6)', background: 'rgba(248,250,252,0.5)' }}>
                  <div style={{ color: '#7b93b8', fontSize: 13, fontWeight: 700, letterSpacing: 0.5 }}>{t.tableDate || 'DATE & TIME'}</div>
                  <div style={{ color: '#7b93b8', fontSize: 13, fontWeight: 700, letterSpacing: 0.5 }}>{t.tableMedicines || 'MEDICINES'}</div>
                  <div style={{ color: '#7b93b8', fontSize: 13, fontWeight: 700, letterSpacing: 0.5 }}>{t.tableInteractions || 'INTERACTIONS'}</div>
                  <div style={{ color: '#7b93b8', fontSize: 13, fontWeight: 700, letterSpacing: 0.5 }}>{t.tableTopMedicines || 'TOP MEDICINES'}</div>
                </div>

                {historyData.map((item, index) => (
                  <div
                    key={item.id}
                    className="rxb-history-row"
                    style={{ borderBottom: index === historyData.length - 1 ? 'none' : '1px solid rgba(226,234,245,0.6)' }}
                    onClick={() => handleHistoryClick(item)}
                  >
                    <div>
                      <div style={{ color: '#1a3a6b', fontSize: 14.5, fontWeight: 600 }}>{item.date}</div>
                      {index === 0 && (
                        <div style={{ background: '#1a6fd4', color: '#fff', fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 12, display: 'inline-block', marginTop: 6 }}>
                          {t.badgeLatest || 'Latest'}
                        </div>
                      )}
                    </div>
                    <div style={{ color: '#1a6fd4', fontSize: 16, fontWeight: 700 }}>{item.medicineCount}</div>
                    <div style={{ color: '#dc2626', fontSize: 16, fontWeight: 700 }}>{item.interactionCount}</div>
                    <div style={{ color: '#7b93b8', fontSize: 13.5, lineHeight: 1.6 }}>
                      {item.medicines.join(', ')}
                      {item.medicineCount > 3 ? ` +${item.medicineCount - 3} more` : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {historyData.length > 0 && (
              <button
                className="rxb-clear-btn"
                onClick={() => { localStorage.removeItem('rxbridge_scan_history'); setHistoryData([]); }}
              >
                {t.btnClearHistory || 'Clear History'}
              </button>
            )}
          </div>
        )}

      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}// mobile fix applied
