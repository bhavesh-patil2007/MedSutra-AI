# RxBridge: AI Medical Translator & Safety App

RxBridge is a full-stack web application designed for Indian patients to translate complex medical prescriptions into plain, understandable language. It focus on safety by detecting drug-drug interactions and providing dietary warnings.

## Key Features
- **OCR Prescription Scanner**: Uses Tesseract.js (client-side) to extract text from photos.
- **AI-Powered Analysis**: Uses Google Gemini (1.5-flash) to parse medical shorthand and explain purposes.
- **Multilingual Support**: Instant translation to Hindi and Marathi.
- **Safety Engine**: Intelligent detection of drug-drug interactions and allergy conflicts.
- **Auto-Generated Timetable**: Visual 4-slot dosage schedule (Morning, Afternoon, Evening, Night).
- **Find Nearby Pharmacies**: Integrated Google Maps for locating open pharmacies.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Tesseract.js.
- **Backend**: Node.js Express (Serving static files & API).
- **AI**: Google Gemini API via `@google/genai`.
- **Icons**: Lucide React.
- **Animation**: Motion (Framer Motion).

## Setup Instructions

### 1. Environment Variables
Create a `.env` file from `.env.example`:
```env
GEMINI_API_KEY="your_api_key_here"
GOOGLE_MAPS_API_KEY="your_api_key_here"
```

### 2. Local Development
```bash
npm install
npm run dev
```
The app will run on `http://localhost:3000`.

### 3. Docker Deployment
```bash
docker build -t rxbridge .
docker run -p 3000:3000 rxbridge
```

### 4. Cloud Run Deployment
Use the provided `cloudbuild.yaml` or run:
```bash
gcloud run deploy rxbridge --source .
```

## Folder Structure
- `/src/components`: UI Views (Scan, Profile, Result).
- `/src/services`: AI and Translation logic.
- `/src/data`: Shorthand and interaction JSON datasets.
- `/server.ts`: Express backend entry point.
- `/Dockerfile`: Containerization config.

## Disclaimer
RxBridge is an AI assistant and should not be used as a replacement for professional medical advice. Always consult your doctor or pharmacist.
