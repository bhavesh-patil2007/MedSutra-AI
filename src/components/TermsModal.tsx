import React, { useState, useEffect } from 'react';

export default function TermsModal() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const accepted = localStorage.getItem('terms_accepted');
        if (!accepted) setShow(true);
    }, []);

    const handleAccept = () => {
        localStorage.setItem('terms_accepted', 'true');
        setShow(false);
    };

    if (!show) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
        }}>
            <div style={{
                background: 'white', borderRadius: 20, maxWidth: 520, width: '100%',
                maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
            }}>
                {/* Header */}
                <div style={{ padding: '24px 28px 16px', borderBottom: '1px solid #e5e7eb' }}>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a3a6b', margin: 0 }}>Terms & Conditions</h2>
                    <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Please read before using MedSutra AI</p>
                </div>

                {/* Content */}
                <div style={{ padding: '20px 28px', overflowY: 'auto', flex: 1, fontSize: 14, color: '#374151', lineHeight: 1.7 }}>
                    {[
                        { title: 'Not Medical Advice', desc: 'This website is an AI tool and not a substitute for professional medical advice.' },
                        { title: 'Verification Required', desc: 'Consult a doctor before making any medication decisions based on results from this site.' },
                        { title: 'AI Interpretation', desc: 'MedSutra uses Google Gemini AI to analyze prescriptions; results may be inaccurate due to handwriting or image quality.' },
                        { title: 'No Emergency Use', desc: 'This website is not for emergency use; seek immediate professional help for urgent health concerns.' },
                        { title: 'Local Storage', desc: 'Your profile and scan results are stored only on your device via browser localStorage.' },
                        { title: 'Translation Limits', desc: 'AI-generated translations for Hindi and Marathi are for convenience; medicine names remain in English for safety.' },
                        { title: 'Pharmacy Finder', desc: 'Nearby search results rely on device geolocation and third-party Google Maps data.' },
                        { title: 'Limitation of Liability', desc: 'This website is provided "as is," and the developers are not responsible for any harm resulting from AI output.' },
                        { title: 'Governing Law', desc: 'Use of this website is subject to the laws and jurisdiction of India.' },
                        { title: 'Contact', desc: 'For support or inquiries, email support@medsutra.com.' },
                    ].map((item, i) => (
                        <p key={i} style={{ marginTop: i === 0 ? 0 : 14 }}>
                            <strong>{i + 1}. {item.title}</strong><br />{item.desc}
                        </p>
                    ))}
                </div>

                {/* Buttons */}
                <div style={{ padding: '16px 28px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 12 }}>
                    <button
                        onClick={handleAccept}
                        style={{
                            flex: 1, background: '#1a6fd4', color: 'white', border: 'none',
                            borderRadius: 12, padding: '12px 0', fontSize: 15, fontWeight: 700, cursor: 'pointer'
                        }}
                    >
                        I Accept
                    </button>
                </div>
            </div>
        </div>
    );
}