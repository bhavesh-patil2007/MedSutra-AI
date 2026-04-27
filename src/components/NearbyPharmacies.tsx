import { useEffect, useState, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Navigation } from 'lucide-react';
import { Lang } from '../types';
import { UI } from '../i18n';

interface NearbyPharmaciesProps {
    lang: Lang;
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

export default function NearbyPharmacies({ lang }: NearbyPharmaciesProps) {
    // @ts-ignore - Safely bypass strict typing issues if user hasn't updated their i18n file yet
    const t = UI[lang] as Record<string, string>;
    const navigate = useNavigate();
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationName, setLocationName] = useState('your location');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    setLoading(false);
                },
                () => {
                    setLocation({ lat: 18.5204, lng: 73.8567 });
                    setLocationName('Pune');
                    setLoading(false);
                }
            );
        } else {
            setLocation({ lat: 18.5204, lng: 73.8567 });
            setLocationName('Pune');
            setLoading(false);
        }
    }, []);

    const openSearch = (query: string) => {
        if (!location) return;
        window.open(
            `https://maps.google.com/?q=${encodeURIComponent(query)}&ll=${location.lat},${location.lng}&z=15`,
            '_blank'
        );
    };

    const openDirections = (query: string) => {
        if (!location) return;
        window.open(
            `https://maps.google.com/?q=${encodeURIComponent(query)}&ll=${location.lat},${location.lng}&z=15`,
            '_blank'
        );
    };

    const categories = [
        {
            label: t.pharmacy || 'Pharmacy',
            query: 'pharmacy chemist near me',
            icon: '💊',
            color: 'bg-blue-50/80 hover:bg-blue-100/80 border-blue-200',
            textColor: 'text-blue-800',
        },
        {
            label: t.medicalStore || 'Medical Store',
            query: 'medical store medicine shop near me',
            icon: '🏪',
            color: 'bg-emerald-50/80 hover:bg-emerald-100/80 border-emerald-200',
            textColor: 'text-emerald-800',
        },
        {
            label: t.hospital || 'Hospital',
            query: 'hospital near me',
            icon: '🏥',
            color: 'bg-red-50/80 hover:bg-red-100/80 border-red-200',
            textColor: 'text-red-800',
        },
        {
            label: t.clinic || 'Clinic',
            query: 'clinic doctor near me',
            icon: '👨‍⚕️',
            color: 'bg-purple-50/80 hover:bg-purple-100/80 border-purple-200',
            textColor: 'text-purple-800',
        },
        {
            label: t.dawakhana || 'Dawakhana',
            query: 'dawakhana aushadhalaya near me',
            icon: '🌿',
            color: 'bg-orange-50/80 hover:bg-orange-100/80 border-orange-200',
            textColor: 'text-orange-800',
        },
        {
            label: t.dispensary || 'Dispensary',
            query: 'dispensary health centre near me',
            icon: '🏨',
            color: 'bg-teal-50/80 hover:bg-teal-100/80 border-teal-200',
            textColor: 'text-teal-800',
        },
    ];

    return (
        <div style={{ fontFamily: 'Inter, sans-serif', background: '#E9F3F5', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
            <style>{css}</style>
            <div className="rxb-bg-pattern"></div>
            <BackgroundElements />

            <div className="relative z-10 p-6 max-w-2xl mx-auto">

                <div className="flex items-center gap-2 mb-8">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-700 hover:text-slate-900 transition-all duration-300 hover:-translate-x-1">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900">{t.nearbyTitle || 'Nearby Medical Services'}</h1>
                </div>

                <div className="bg-white/85 backdrop-blur-xl rounded-3xl border border-white/90 p-5 shadow-sm mb-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                        {!loading && location && (
                            <iframe
                                title="Nearby Map"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                allowFullScreen
                                src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
                            />
                        )}
                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                                <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
                                    <span className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></span>
                                    {t.gettingLocation || 'Getting your location...'}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 p-4 bg-blue-50/80 backdrop-blur-sm border border-blue-100 rounded-2xl flex gap-3 text-blue-800 text-sm">
                        <Navigation className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
                        <p className="leading-relaxed">
                            {t.nearbyBanner || 'Showing medical services near'} <strong className="text-blue-900">{locationName}</strong>.{' '}
                            {lang === 'en'
                                ? 'Tap any category below to open in Google Maps.'
                                : lang === 'hi'
                                    ? 'किसी भी श्रेणी पर टैप करके Google Maps में खोलें।'
                                    : 'कोणत्याही श्रेणीवर टॅप करून Google Maps मध्ये उघडा.'}
                        </p>
                    </div>
                </div>

                <div className="bg-white/85 backdrop-blur-xl rounded-3xl border border-white/90 p-6 shadow-sm mb-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                        {t.searchByCategory || 'Search by Category'}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {categories.map((cat, i) => (
                            <button
                                key={i}
                                onClick={() => openSearch(cat.query)}
                                /* 🔥 MAGIC HOVER "POP UP" EFFECT ADDED HERE */
                                className={`flex items-center gap-3 p-4 rounded-2xl border backdrop-blur-sm shadow-sm transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-[1.03] hover:shadow-xl hover:z-10 text-left active:scale-95 ${cat.color}`}
                            >
                                <span className="text-2xl drop-shadow-sm">{cat.icon}</span>
                                <span className={`text-sm font-bold ${cat.textColor}`}>{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pb-8">
                    <button
                        onClick={() => openDirections('pharmacy medical store hospital near me')}
                        /* 🔥 MAGIC HOVER "POP UP" EFFECT ADDED HERE */
                        className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-xl hover:bg-blue-700 active:scale-95"
                    >
                        <MapPin className="w-5 h-5" />
                        {t.openAllMaps || 'Open All Medical Services in Maps'}
                    </button>
                </div>

            </div>
        </div>
    );
}