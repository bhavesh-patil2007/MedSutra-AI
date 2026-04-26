import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <button onClick={() => navigate(-1)} className="mb-6 ml-4 text-blue-600 flex items-center gap-1">← Back</button>

            {/* Hero */}
            <div className="max-w-3xl mx-auto text-center mb-16">
                <h1 className="text-4xl font-bold text-blue-600 mb-4">About AyurRx</h1>
                <p className="text-lg text-gray-500">Smart Medicine Assistant for every Indian family</p>
            </div>

            {/* Mission Statement */}
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-10 mb-8 border-l-4 border-blue-500">
                <div className="mb-6">
                    <img
                        src="/logo.jpeg"
                        alt="AyurRx Logo"
                        style={{
                            width: '90px',  /* Slightly larger than the original 5xl heart */
                            height: '90px',
                            objectFit: 'contain',
                            mixBlendMode: 'multiply' /* Removes the white background */
                        }}
                    />
                </div>
                <p className="text-xl text-gray-700 leading-relaxed">
                    At <span className="font-bold text-blue-600">AyurRx</span>, we believe healthcare should be{' '}
                    <span className="font-semibold text-gray-800">understandable</span>,{' '}
                    <span className="font-semibold text-gray-800">accessible</span>, and{' '}
                    <span className="font-semibold text-gray-800">safe</span> for everyone.
                </p>
                <p className="text-xl text-gray-700 leading-relaxed mt-4">
                    Our mission is to eliminate confusion caused by handwritten prescriptions using
                    AI-powered text recognition and intelligent processing. We are committed to reducing
                    medication errors and empowering patients with clarity and confidence.
                </p>
            </div>

            {/* Three pillars */}
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                    { emoji: "🔍", title: "Understandable", desc: "Plain-language explanations of your medicines in English, Hindi & Marathi" },
                    { emoji: "🌍", title: "Accessible", desc: "Designed for every Indian patient, regardless of literacy or language" },
                    { emoji: "🛡️", title: "Safe", desc: "AI-powered drug interaction checks and allergy alerts to protect you" },
                ].map(({ emoji, title, desc }) => (
                    <div key={title} className="bg-white rounded-2xl shadow p-6 text-center">
                        <div className="text-4xl mb-3">{emoji}</div>
                        <h3 className="font-bold text-gray-800 text-lg mb-2">{title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                    </div>
                ))}
            </div>

            {/* Footer note */}
            <div className="max-w-3xl mx-auto text-center text-gray-400 text-sm mt-8">
                Not a replacement for professional medical advice. Always consult your doctor.
            </div>

        </div>
    );
}