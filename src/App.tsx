/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProfile, PrescriptionResult, Lang } from './types';
import ScanPage from './components/ScanPage';
import ProfilePage from './components/ProfilePage';
import ResultPage from './components/ResultPage';
import NearbyPharmacies from './components/NearbyPharmacies';
import AboutPage from './AboutPage';
import TermsModal from './components/TermsModal';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('rxbridge_profile');
    return saved ? JSON.parse(saved) : {
      allergies: [],
      isPregnant: false,
      isElderly: false,
      isChild: false,
      isAdult: false
    };
  });

  const [lastResult, setLastResult] = useState<PrescriptionResult | null>(() => {
    const saved = localStorage.getItem('rxbridge_last_result');
    return saved ? JSON.parse(saved) : null;
  });

  // Global language state — persisted so it survives page navigation
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem('rxbridge_lang') as Lang) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('rxbridge_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    if (lastResult) {
      localStorage.setItem('rxbridge_last_result', JSON.stringify(lastResult));
    }
  }, [lastResult]);

  useEffect(() => {
    localStorage.setItem('rxbridge_lang', lang);
  }, [lang]);

  return (
    <>
      <TermsModal />
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
          <Routes>
            <Route
              path="/"
              element={
                <ScanPage
                  onResult={setLastResult}
                  profile={profile}
                  lang={lang}
                  onLangChange={setLang}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <ProfilePage
                  profile={profile}
                  onUpdate={setProfile}
                  lang={lang}
                />
              }
            />
            <Route
              path="/result"
              element={
                lastResult
                  ? <ResultPage result={lastResult} profile={profile} lang={lang} />
                  : <Navigate to="/" />
              }
            />
            <Route
              path="/pharmacies"
              element={<NearbyPharmacies lang={lang} />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}