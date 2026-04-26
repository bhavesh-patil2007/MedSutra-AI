/**
 * useTTS — Text-to-Speech hook for MedSutra AI
 *
 * English  → Web Speech API (built-in, zero cost)
 * Hindi    → MyMemory TTS API (free, no billing needed, perfect hi-IN)
 * Marathi  → MyMemory TTS API (free, no billing needed, perfect mr-IN)
 *
 * BUG FIXES:
 * - Bug 1: `langRef` keeps lang in sync inside async callbacks so audio
 *   always uses the language that was active when play() was called,
 *   not a stale closure value.
 * - Bug 2: `dataRef` keeps data in sync so buildScript always reads the
 *   latest translated text (currentResult), not the original English.
 * - Bug 3: Audio stops automatically when navigating away (unmount cleanup).
 * - Bug 4: Switching language mid-playback stops previous audio immediately.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { Lang } from '../types';

// ─── Medical abbreviation expander ───────────────────────────────────────────
const MEDICAL_ABBR: Record<string, string> = {
  'OD': 'once daily',
  'BD': 'twice daily',
  'TDS': 'three times a day',
  'QID': 'four times a day',
  'HS': 'at bedtime',
  'SOS': 'as needed',
  'PRN': 'as needed',
  'QD': 'once daily',
  'BID': 'twice daily',
  'TID': 'three times a day',
  'AC': 'before food',
  'PC': 'after food',
  'CC': 'with food',
  'PO': 'by mouth',
  'IV': 'intravenous',
  'IM': 'intramuscular',
  'SC': 'subcutaneous',
  'SL': 'under the tongue',
  'MG': 'milligrams',
  'MCG': 'micrograms',
  'ML': 'millilitres',
  'GM': 'grams',
  'CAP': 'capsule',
  'TAB': 'tablet',
  'SYP': 'syrup',
  'INJ': 'injection',
};

function expandAbbreviations(text: string): string {
  let result = text;
  for (const [abbr, expansion] of Object.entries(MEDICAL_ABBR)) {
    const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
    result = result.replace(regex, expansion);
  }
  return result;
}

// ─── MyMemory TTS language codes ─────────────────────────────────────────────
// Using Web Speech API for all languages
const MYMEMORY_LANG: Record<string, string> = {
  hi: 'hi-IN',
  mr: 'mr-IN',
};

// ─── Web Speech lang codes ────────────────────────────────────────────────────
const WEB_SPEECH_LANG: Record<string, string> = {
  en: 'en-IN',
};

// ─── Build script ─────────────────────────────────────────────────────────────
export interface TTSData {
  medicines: {
    name: string;
    dosage: string;
    timing: string;
    purpose: string;
    foodWarning?: string;
    usageAlert?: string;
    caution?: string;
  }[];
  interactions: { drugs: string[]; description: string }[];
  warnings: string[];
}

function buildScript(data: TTSData, lang: Lang): string {
  const lines: string[] = [];

  if (lang === 'en') {
    lines.push('Prescription Summary.');
    lines.push(`You have ${data.medicines.length} medicine${data.medicines.length !== 1 ? 's' : ''}.`);
    data.medicines.forEach((med, i) => {
      lines.push(`Medicine ${i + 1}: ${med.name}, ${med.dosage}.`);
      lines.push(`Take ${expandAbbreviations(med.timing)}.`);
      lines.push(`Purpose: ${med.purpose}.`);
      if (med.foodWarning) lines.push(`Food note: ${med.foodWarning}.`);
      if (med.usageAlert) lines.push(`Usage alert: ${med.usageAlert}.`);
      if (med.caution) lines.push(`Caution: ${med.caution}.`);
    });
    if (data.interactions.length > 0) {
      lines.push(`Warning! ${data.interactions.length} drug interaction${data.interactions.length !== 1 ? 's' : ''} detected.`);
      data.interactions.forEach(inter => {
        lines.push(`${inter.drugs.join(' and ')} — ${inter.description}`);
      });
    }
    if (data.warnings.length > 0) {
      lines.push('Additional warnings:');
      data.warnings.forEach(w => lines.push(w));
    }
    lines.push('Always consult your doctor or pharmacist before taking any medication.');

  } else if (lang === 'hi') {
    lines.push('प्रिस्क्रिप्शन सारांश।');
    lines.push(`आपके पास ${data.medicines.length} दवाइयां हैं।`);
    data.medicines.forEach((med, i) => {
      lines.push(`दवा ${i + 1}: ${med.name}, ${med.dosage}।`);
      lines.push(`लेने का समय: ${med.timing}।`);
      lines.push(`उद्देश्य: ${med.purpose}।`);
      if (med.foodWarning) lines.push(`भोजन संबंधी: ${med.foodWarning}।`);
      if (med.usageAlert) lines.push(`उपयोग सूचना: ${med.usageAlert}।`);
      if (med.caution) lines.push(`सावधानी: ${med.caution}।`);
    });
    if (data.interactions.length > 0) {
      lines.push(`चेतावनी! ${data.interactions.length} दवा प्रतिक्रिया पाई गई।`);
      data.interactions.forEach(inter => {
        lines.push(`${inter.drugs.join(' और ')} — ${inter.description}`);
      });
    }
    if (data.warnings.length > 0) {
      lines.push('अतिरिक्त चेतावनियां:');
      data.warnings.forEach(w => lines.push(w));
    }
    lines.push('कोई भी दवा लेने से पहले अपने डॉक्टर से सलाह लें।');

  } else {
    // Marathi
    lines.push('प्रिस्क्रिप्शन सारांश।');
    lines.push(`तुमच्याकडे ${data.medicines.length} औषधे आहेत।`);
    data.medicines.forEach((med, i) => {
      lines.push(`औषध ${i + 1}: ${med.name}, ${med.dosage}।`);
      lines.push(`घेण्याची वेळ: ${med.timing}।`);
      lines.push(`उद्देश: ${med.purpose}।`);
      if (med.foodWarning) lines.push(`अन्न सूचना: ${med.foodWarning}।`);
      if (med.usageAlert) lines.push(`वापर सूचना: ${med.usageAlert}।`);
      if (med.caution) lines.push(`सावधानता: ${med.caution}।`);
    });
    if (data.interactions.length > 0) {
      lines.push(`इशारा! ${data.interactions.length} औषध प्रतिक्रिया आढळल्या।`);
      data.interactions.forEach(inter => {
        lines.push(`${inter.drugs.join(' आणि ')} — ${inter.description}`);
      });
    }
    if (data.warnings.length > 0) {
      lines.push('अतिरिक्त इशारे:');
      data.warnings.forEach(w => lines.push(w));
    }
    lines.push('कोणतेही औषध घेण्यापूर्वी तुमच्या डॉक्टरांचा सल्ला घ्या।');
  }

  return lines.join(' ');
}

// ─── Split long text into chunks (MyMemory limit = 500 chars) ────────────────
function splitIntoChunks(text: string, maxLen = 450): string[] {
  const sentences = text.split('. ');
  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    const candidate = current ? current + '. ' + sentence : sentence;
    if (candidate.length <= maxLen) {
      current = candidate;
    } else {
      if (current) chunks.push(current);
      current = sentence;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export type TTSState = 'idle' | 'playing' | 'paused' | 'loading' | 'unsupported';

export function useTTS(data: TTSData, lang: Lang) {
  const [ttsState, setTtsState] = useState<TTSState>(() =>
    typeof window !== 'undefined' && 'speechSynthesis' in window ? 'idle' : 'unsupported'
  );

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<string[]>([]);
  const chunkIndexRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);

  // BUG FIX 1 & 2: Keep lang and data in refs so async callbacks always
  // read the current value, never a stale closure from when play() was called.
  const langRef = useRef<Lang>(lang);
  const dataRef = useRef<TTSData>(data);

  useEffect(() => { langRef.current = lang; }, [lang]);
  useEffect(() => { dataRef.current = data; }, [data]);

  // BUG FIX 3: Cleanup on unmount — stop all audio when navigating away
  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  // BUG FIX 4: Stop + reset immediately when language changes mid-playback
  useEffect(() => {
    isPlayingRef.current = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    setTtsState('idle');
  }, [lang]);

  // ─── Play English via Web Speech API ───────────────────────────────────
  const playWebSpeech = useCallback((script: string, lang = 'en') => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-IN'; utterance.rate = 0.88;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.rate = lang === 'en' ? 0.88 : 0.82;

    const speak = () => {
      const voices = window.speechSynthesis.getVoices();
      const voice =
        voices.find(v => v.lang === utterance.lang) ??
        voices.find(v => v.lang.startsWith(lang)) ??
        null;
      if (!voice && lang !== 'en') {
        // No native voice found, force the lang anyway
        utterance.lang = lang === 'hi' ? 'hi-IN' : 'mr-IN';
      }
      if (voice) utterance.voice = voice;

      utterance.onstart = () => setTtsState('playing');
      utterance.onend = () => { isPlayingRef.current = false; setTtsState('idle'); };
      utterance.onerror = (e) => {
        if (e.error !== 'interrupted') console.error('TTS error:', e.error);
        isPlayingRef.current = false;
        setTtsState('idle');
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setTtsState('playing');
    };

    if (window.speechSynthesis.getVoices().length === 0) {

      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        speak();
      };
    } else {
      speak();
    }
  }, []);

  // ─── Fetch audio chunk from MyMemory TTS ───────────────────────────────
  const fetchMyMemoryAudio = async (text: string, langCode: string): Promise<string> => {
    const encoded = encodeURIComponent(text);
    const url = `/api/tts-proxy?q=${encoded}&lang=${langCode}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`MyMemory TTS failed: ${response.status}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  };

  // ─── Play chunks sequentially ───────────────────────────────────────────
  const playChunksSequentially = useCallback(async (
    chunks: string[],
    langCode: string,
    startIndex = 0
  ) => {
    for (let i = startIndex; i < chunks.length; i++) {
      if (!isPlayingRef.current) break;
      chunkIndexRef.current = i;

      try {
        const audioUrl = await fetchMyMemoryAudio(chunks[i], langCode);
        if (!isPlayingRef.current) { URL.revokeObjectURL(audioUrl); break; }

        await new Promise<void>((resolve, reject) => {
          const audio = new Audio(audioUrl);
          audioRef.current = audio;
          audio.onended = () => { URL.revokeObjectURL(audioUrl); audioRef.current = null; resolve(); };
          audio.onplay = () => setTtsState('playing');
          audio.onerror = () => { URL.revokeObjectURL(audioUrl); audioRef.current = null; reject(new Error('Audio playback failed')); };
          audio.play().catch(reject);
        });
      } catch (err) {
        console.error(`Chunk ${i} failed:`, err);
        // Continue to next chunk even if one fails
      }
    }

    if (isPlayingRef.current) {
      isPlayingRef.current = false;
      setTtsState('idle');
    }
  }, []);

  // ─── Play Hindi/Marathi via MyMemory TTS ───────────────────────────────
  const playMyMemoryTTS = useCallback(async (script: string, activeLang: Lang) => {
    setTtsState('loading');
    isPlayingRef.current = true;

    window.speechSynthesis.cancel();

    const langCode = MYMEMORY_LANG[activeLang]; // 'hi-IN' or 'mr-IN'
    const chunks = splitIntoChunks(script, 450);
    chunksRef.current = chunks;
    chunkIndexRef.current = 0;

    await playChunksSequentially(chunks, langCode, 0);
  }, [playChunksSequentially]);

  // ─── Main play ──────────────────────────────────────────────────────────
  const play = useCallback(() => {
    if (ttsState === 'unsupported') return;

    if (ttsState === 'paused' && langRef.current === 'en') {
      window.speechSynthesis.resume();
      setTtsState('playing');
      return;
    }

    // BUG FIX 1 & 2: read from dataRef and langRef — always current, never stale
    const currentLang = langRef.current;
    const currentData = dataRef.current;
    const script = buildScript(currentData, currentLang);

    if (currentLang === 'en') {
      isPlayingRef.current = true;
      playWebSpeech(script);
    } else {
      isPlayingRef.current = true;
      playWebSpeech(script, currentLang);
    }
  }, [ttsState, playWebSpeech, playMyMemoryTTS]);

  // ─── Pause ──────────────────────────────────────────────────────────────
  const pause = useCallback(() => {
    if (ttsState !== 'playing') return;

    if (langRef.current === 'en') {
      window.speechSynthesis.pause();
      setTtsState('paused');
    } else {
      if (audioRef.current) audioRef.current.pause();
      isPlayingRef.current = false;
      setTtsState('paused');
    }
  }, [ttsState]);

  // ─── Stop ───────────────────────────────────────────────────────────────
  const stop = useCallback(() => {
    isPlayingRef.current = false;
    window.speechSynthesis.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    setTtsState('idle');
  }, []);

  // ─── Toggle ─────────────────────────────────────────────────────────────
  const toggle = useCallback(() => {
    if (ttsState === 'playing') {
      pause();
    } else if (ttsState === 'paused') {
      if (langRef.current === 'en') {
        window.speechSynthesis.resume();
        setTtsState('playing');
      } else {
        isPlayingRef.current = true;
        setTtsState('playing');
        playChunksSequentially(
          chunksRef.current,
          MYMEMORY_LANG[langRef.current],
          chunkIndexRef.current
        );
      }
    } else {
      play();
    }
  }, [ttsState, play, pause, playChunksSequentially]);

  return { ttsState, toggle, stop };
}