import React from 'react';
import { useState, FormEvent, ReactNode, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, X, Heart, Baby, Users } from 'lucide-react';
import { UserProfile, Lang } from '../types';
import { UI } from '../i18n';

interface ProfilePageProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  lang: Lang;
}

const css = `
  @media (max-width: 768px) {
    .rxb-profile-grid { grid-template-columns: 1fr !important; }
  }
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

function LeafSVG({ width = 80, style, animClass = '' }: { width?: number, style?: CSSProperties, animClass?: string }) {
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

function PillSVG({ width = 60, style, animClass = '' }: { width?: number, style?: CSSProperties, animClass?: string }) {
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

function MoleculeSVG({ width = 90, style, animClass = '' }: { width?: number, style?: CSSProperties, animClass?: string }) {
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

export default function ProfilePage({ profile, onUpdate, lang }: ProfilePageProps) {
  // @ts-ignore - Safely bypass strict typing issues if user hasn't updated their i18n file yet
  const t = UI[lang] as Record<string, string>;
  const navigate = useNavigate();
  const [newAllergy, setNewAllergy] = useState('');

  const addAllergy = (e: FormEvent) => {
    e.preventDefault();
    if (newAllergy.trim() && !profile.allergies.includes(newAllergy.trim())) {
      onUpdate({ ...profile, allergies: [...profile.allergies, newAllergy.trim()] });
      setNewAllergy('');
    }
  };

  const removeAllergy = (allergy: string) => {
    onUpdate({ ...profile, allergies: profile.allergies.filter(a => a !== allergy) });
  };

  const toggleCondition = (key: keyof UserProfile) => {
    if (key === 'allergies') return;
    onUpdate({ ...profile, [key]: !profile[key] });
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#E9F3F5', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <style>{css}</style>
      <div className="rxb-bg-pattern"></div>
      <BackgroundElements />

      <div className="relative z-10 p-8 max-w-5xl mx-auto">
        <header className="flex items-center gap-4 mb-10">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-700 hover:text-slate-900 transition-all duration-300 hover:-translate-x-1">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">{t.healthProfile || 'Your Health Profile'}</h1>
        </header>

        <div className="grid grid-cols-3 gap-8 rxb-profile-grid">
          <div className="col-span-2 space-y-8">
            <div>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
                {t.medicationAllergies || 'Medication Allergies'}
              </h2>
              <form onSubmit={addAllergy} className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  placeholder={t.allergyPlaceholder || 'e.g. Penicillin, Sulfa'}
                  className="flex-1 bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                />
                <button type="submit" className="bg-blue-600 text-white p-3 px-5 rounded-2xl hover:bg-blue-700 shadow-md shadow-blue-200 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95">
                  <Plus className="w-6 h-6" />
                </button>
              </form>

              <div className="flex flex-wrap gap-2">
                {profile.allergies.map(allergy => (
                  <span key={allergy} className="bg-blue-50/90 backdrop-blur-md text-blue-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border border-blue-200 shadow-sm transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 hover:shadow-md cursor-default">
                    {allergy}
                    <button onClick={() => removeAllergy(allergy)} className="p-0.5 hover:bg-blue-200 rounded-full transition-colors text-blue-500 hover:text-blue-800">
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
                {profile.allergies.length === 0 && (
                  <p className="text-slate-500 text-sm italic font-medium px-2">{t.noAllergiesYet || 'No allergies listed yet.'}</p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
                {t.specialConsiderations || 'Special Considerations'}
              </h2>
              <div className="grid gap-3">
                <ConditionToggle
                  active={profile.isPregnant}
                  label={t.pregnant || 'Pregnant'}
                  icon={<Baby className="w-5 h-5" />}
                  onClick={() => toggleCondition('isPregnant')}
                />
                <ConditionToggle
                  active={profile.isElderly}
                  label={t.elderly || 'Elderly (65+)'}
                  icon={<Users className="w-5 h-5" />}
                  onClick={() => toggleCondition('isElderly')}
                />
                <ConditionToggle
                  active={profile.isChild}
                  label={t.child || 'Child/Infant'}
                  icon={<Heart className="w-5 h-5" />}
                  onClick={() => toggleCondition('isChild')}
                />
                <ConditionToggle
                  active={profile.isAdult}
                  label={t.adult || 'Adult (18–64)'}
                  icon={<Users size={20} />}
                  onClick={() => toggleCondition('isAdult')}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/85 backdrop-blur-xl rounded-3xl border border-white/90 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                {t.profileStatus || 'Profile Status'}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">{t.allergies || 'Allergies'}</span>
                  <span className={`font-bold ${profile.allergies.length > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {profile.allergies.length > 0 ? `${profile.allergies.length} listed` : (t.none || 'None')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">{t.pregnant || 'Pregnant'}</span>
                  <span className={`font-bold ${profile.isPregnant ? 'text-pink-600' : 'text-slate-400'}`}>
                    {profile.isPregnant ? '✓' : '–'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">{t.elderly || 'Elderly (65+)'}</span>
                  <span className={`font-bold ${profile.isElderly ? 'text-purple-600' : 'text-slate-400'}`}>
                    {profile.isElderly ? '✓' : '–'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">{t.child || 'Child/Infant'}</span>
                  <span className={`font-bold ${profile.isChild ? 'text-amber-600' : 'text-slate-400'}`}>
                    {profile.isChild ? '✓' : '–'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">{t.adult || 'Adult (18–64)'}</span>
                  <span className={`font-bold ${profile.isAdult ? 'text-blue-600' : 'text-slate-400'}`}>
                    {profile.isAdult ? '✓' : '–'}
                  </span>
                </div>
              </div>
            </div>


            <div className="p-6 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-200 border border-blue-500 transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-[1.02]">
              <h3 className="font-bold mb-3 text-lg">{t.whyMatters || 'Why this matters?'}</h3>
              <p className="text-blue-100 text-sm leading-relaxed font-medium">
                {t.whyMattersDesc || 'MedSutra AI uses this information to warn you if a scanned medicine is unsafe for your specific health circumstances.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConditionToggle({ active, label, icon, onClick }: { active: boolean; label: string; icon: ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      /* 🔥 MAGIC HOVER "POP UP" EFFECT ADDED HERE */
      className={`flex items-center justify-between w-full p-4 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-[1.03] hover:shadow-xl hover:z-10 active:scale-[0.98] ${active
        ? 'bg-blue-50/90 backdrop-blur-md border-blue-200 text-blue-800 shadow-md scale-[1.01]'
        : 'bg-white/85 backdrop-blur-md border-white/90 text-slate-600 hover:bg-white shadow-sm'
        }`}
    >
      <div className="flex items-center gap-3 font-semibold">
        {icon}
        {label}
      </div>
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${active
        ? 'bg-blue-600 border-blue-600'
        : 'bg-transparent border-slate-300'
        }`}>
        {active && <div className="w-2 h-2 bg-white rounded-full" />}
      </div>
    </button>
  );
}