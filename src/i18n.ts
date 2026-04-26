import { Lang } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// TRANSLATION MAPS
// These maps are used by ResultPage to translate AI-generated dosage,
// frequency, timing, and food instruction text into the selected language.
// Medicine names are NEVER translated — only contextual medical text.
// ─────────────────────────────────────────────────────────────────────────────

/** Frequency / dosage instruction translations */
export const FREQUENCY_MAP: Record<string, Record<Lang, string>> = {
  // Once / Twice / Thrice
  'once daily': { en: 'Once Daily', hi: 'दिन में एक बार', mr: 'दिवसातून एकदा' },
  'twice daily': { en: 'Twice Daily', hi: 'दिन में दो बार', mr: 'दिवसातून दोनदा' },
  'thrice daily': { en: 'Thrice Daily', hi: 'दिन में तीन बार', mr: 'दिवसातून तीनदा' },
  'three times daily': { en: 'Three Times Daily', hi: 'दिन में तीन बार', mr: 'दिवसातून तीनदा' },
  'four times daily': { en: 'Four Times Daily', hi: 'दिन में चार बार', mr: 'दिवसातून चारदा' },
  'once a day': { en: 'Once a Day', hi: 'दिन में एक बार', mr: 'दिवसातून एकदा' },
  'twice a day': { en: 'Twice a Day', hi: 'दिन में दो बार', mr: 'दिवसातून दोनदा' },
  'every 8 hours': { en: 'Every 8 Hours', hi: 'हर 8 घंटे में', mr: 'दर ८ तासांनी' },
  'every 12 hours': { en: 'Every 12 Hours', hi: 'हर 12 घंटे में', mr: 'दर १२ तासांनी' },
  'every 6 hours': { en: 'Every 6 Hours', hi: 'हर 6 घंटे में', mr: 'दर ६ तासांनी' },
  'as needed': { en: 'As Needed', hi: 'जरूरत पड़ने पर', mr: 'आवश्यकतेनुसार' },
  'sos': { en: 'SOS', hi: 'जरूरत पड़ने पर', mr: 'आवश्यकतेनुसार' },
  'at bedtime': { en: 'At Bedtime', hi: 'सोते समय', mr: 'झोपताना' },
  'before sleep': { en: 'Before Sleep', hi: 'सोने से पहले', mr: 'झोपण्यापूर्वी' },
  'morning': { en: 'Morning', hi: 'सुबह', mr: 'सकाळी' },
  'afternoon': { en: 'Afternoon', hi: 'दोपहर', mr: 'दुपारी' },
  'evening': { en: 'Evening', hi: 'शाम', mr: 'संध्याकाळी' },
  'night': { en: 'Night', hi: 'रात', mr: 'रात्री' },
  'at night': { en: 'At Night', hi: 'रात को', mr: 'रात्री' },
};

/** Food instruction translations */
export const FOOD_MAP: Record<string, Record<Lang, string>> = {
  'after food': { en: 'After food', hi: 'खाने के बाद', mr: 'जेवणानंतर' },
  'after meals': { en: 'After meals', hi: 'भोजन के बाद', mr: 'जेवणानंतर' },
  'before food': { en: 'Before food', hi: 'खाने से पहले', mr: 'जेवणापूर्वी' },
  'before meals': { en: 'Before meals', hi: 'भोजन से पहले', mr: 'जेवणापूर्वी' },
  'with food': { en: 'With food', hi: 'खाने के साथ', mr: 'जेवणासोबत' },
  'with meals': { en: 'With meals', hi: 'भोजन के साथ', mr: 'जेवणासोबत' },
  'on empty stomach': { en: 'On empty stomach', hi: 'खाली पेट', mr: 'रिकाम्या पोटी' },
  'empty stomach': { en: 'Empty stomach', hi: 'खाली पेट', mr: 'रिकाम्या पोटी' },
  'with water': { en: 'With water', hi: 'पानी के साथ', mr: 'पाण्यासोबत' },
  'with milk': { en: 'With milk', hi: 'दूध के साथ', mr: 'दुधासोबत' },
  'avoid alcohol': { en: 'Avoid alcohol', hi: 'शराब से बचें', mr: 'दारू टाळा' },
  'avoid dairy': { en: 'Avoid dairy', hi: 'डेयरी उत्पाद से बचें', mr: 'दुग्धजन्य पदार्थ टाळा' },
};

/** Purpose / medical use keyword translations — partial match, used for sentence-level replacement */
export const PURPOSE_MAP: Record<string, Record<Lang, string>> = {
  'antibiotic to treat bacterial infections':
    { en: 'Antibiotic to treat bacterial infections', hi: 'जीवाणु संक्रमण के इलाज के लिए एंटीबायोटिक', mr: 'जिवाणूजन्य संसर्गावर उपचारासाठी प्रतिजैविक' },
  'pain reliever and fever reducer':
    { en: 'Pain reliever and fever reducer', hi: 'दर्दनाशक और बुखार कम करने वाली', mr: 'वेदनाशामक आणि ताप कमी करणारे' },
  'pain reliever':
    { en: 'Pain reliever', hi: 'दर्दनाशक', mr: 'वेदनाशामक' },
  'fever reducer':
    { en: 'Fever reducer', hi: 'बुखार कम करने वाला', mr: 'ताप कमी करणारे' },
  'antifungal':
    { en: 'Antifungal', hi: 'ऐंटिफंगल', mr: 'बुरशीविरोधी' },
  'antiviral':
    { en: 'Antiviral', hi: 'एंटीवायरल', mr: 'विषाणूविरोधी' },
  'anti-inflammatory':
    { en: 'Anti-inflammatory', hi: 'सूजन-रोधी', mr: 'दाहशामक' },
  'reduces inflammation':
    { en: 'Reduces inflammation', hi: 'सूजन कम करता है', mr: 'जळजळ कमी करते' },
  'blood pressure':
    { en: 'Blood pressure', hi: 'रक्तचाप', mr: 'रक्तदाब' },
  'diabetes':
    { en: 'Diabetes', hi: 'मधुमेह', mr: 'मधुमेह' },
  'controls blood sugar':
    { en: 'Controls blood sugar', hi: 'रक्त शर्करा नियंत्रित करता है', mr: 'रक्तातील साखर नियंत्रित करते' },
  'stomach acid':
    { en: 'Stomach acid', hi: 'पेट का एसिड', mr: 'पोटातील आम्ल' },
  'reduces stomach acid':
    { en: 'Reduces stomach acid', hi: 'पेट का एसिड कम करता है', mr: 'पोटातील आम्ल कमी करते' },
  'vitamin':
    { en: 'Vitamin', hi: 'विटामिन', mr: 'जीवनसत्त्व' },
  'supplement':
    { en: 'Supplement', hi: 'पूरक', mr: 'पूरक' },
  'cough':
    { en: 'Cough', hi: 'खांसी', mr: 'खोकला' },
  'cold':
    { en: 'Cold', hi: 'जुकाम', mr: 'सर्दी' },
  'allergy':
    { en: 'Allergy', hi: 'एलर्जी', mr: 'ॲलर्जी' },
  'antiallergic':
    { en: 'Antiallergic', hi: 'एंटी-एलर्जी', mr: 'ॲलर्जीविरोधी' },
  'antihistamine':
    { en: 'Antihistamine', hi: 'एंटीहिस्टामाइन', mr: 'अँटीहिस्टामाइन' },
  'sleep':
    { en: 'Sleep', hi: 'नींद', mr: 'झोप' },
  'anxiety':
    { en: 'Anxiety', hi: 'चिंता', mr: 'चिंता' },
  'muscle relaxant':
    { en: 'Muscle relaxant', hi: 'मांसपेशी शिथिलक', mr: 'स्नायू शिथिल करणारे' },
  'laxative':
    { en: 'Laxative', hi: 'रेचक', mr: 'जुलाब' },
  'constipation':
    { en: 'Constipation', hi: 'कब्ज', mr: 'बद्धकोष्ठता' },
  'diarrhea':
    { en: 'Diarrhea', hi: 'दस्त', mr: 'जुलाब' },
  'infection':
    { en: 'Infection', hi: 'संक्रमण', mr: 'संसर्ग' },
  'inflammation':
    { en: 'Inflammation', hi: 'सूजन', mr: 'जळजळ' },
  'thyroid':
    { en: 'Thyroid', hi: 'थायराइड', mr: 'थायरॉईड' },
  'heart':
    { en: 'Heart', hi: 'हृदय', mr: 'हृदय' },
  'kidney':
    { en: 'Kidney', hi: 'गुर्दे', mr: 'मूत्रपिंड' },
  'liver':
    { en: 'Liver', hi: 'यकृत', mr: 'यकृत' },
};

/**
 * translateMedText()
 * ─────────────────
 * Translates AI-generated medical text (dosage timing, food instructions,
 * purpose descriptions) into the target language.
 *
 * Rules:
 * - Medicine NAMES must never be passed into this function.
 * - Only pass fields like: timing, foodWarning, usageAlert, purpose, caution.
 * - Matching is case-insensitive; longest match wins.
 */
export function translateMedText(text: string, lang: Lang): string {
  if (!text || lang === 'en') return text;

  let result = text;
  const lower = text.toLowerCase();

  // Merge all maps for a single pass (longest key first to avoid partial clobber)
  const allMaps = [
    ...Object.entries(FREQUENCY_MAP),
    ...Object.entries(FOOD_MAP),
    ...Object.entries(PURPOSE_MAP),
  ].sort((a, b) => b[0].length - a[0].length); // longest key first

  for (const [key, translations] of allMaps) {
    if (lower.includes(key.toLowerCase())) {
      const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      result = result.replace(regex, translations[lang] ?? translations['en']);
    }
  }

  return result;
}

export const UI: Record<Lang, {
  // ScanPage
  scanTitle: string;
  scanSubtitle: string;
  useCamera: string;
  uploadGallery: string;
  processing: string;
  activeProfile: string;
  allergies: string;
  none: string;
  noSpecialConditions: string;
  safe: string;
  safeDesc: string;
  multiLingual: string;
  multiLingualDesc: string;
  edit: string;
  langLabel: string;

  // Nav bar
  navHome: string;
  navHistory: string;
  navHowItWorks: string;
  navAboutUs: string;
  navNearbyPharmacies: string;
  navTagline: string;

  // Hero section
  heroHeadline: string;
  heroPriorityWord: string;
  heroSubtext: string;

  // Scan card privacy note
  privacyNote: string;
  privacySafe: string;
  privacyPrivate: string;

  // Feature cards
  featSafeTitle: string;
  featSafeDesc: string;
  featMultiLangTitle: string;
  featMultiLangDesc: string;
  featReliableTitle: string;
  featReliableDesc: string;
  featFastTitle: string;
  featFastDesc: string;

  // Footer
  footerLine1: string;
  footerLine2: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  adult: string;
  step4Title: string;
  step4Desc: string;
  step5Title: string;
  step5Desc: string;
  step6Title: string;
  step6Desc: string;
  howToUseTitle: string;
  howToUseSubtitle: string;
  aboutTitle: string;
  aboutTagline: string;
  aboutMission1: string;
  aboutMission2: string;
  aboutUnderstandable: string;
  aboutUnderstandableDesc: string;
  aboutAccessible: string;
  aboutAccessibleDesc: string;
  aboutSafe: string;
  aboutSafeDesc: string;

  // Camera overlay
  cameraAlignHint: string;
  cameraRetake: string;
  cameraUsePhoto: string;

  // History Tab
  historyHeader: string;
  tableDate: string;
  tableMedicines: string;
  tableInteractions: string;
  tableTopMedicines: string;
  badgeLatest: string;
  btnClearHistory: string;

  // ProfilePage
  healthProfile: string;
  medicationAllergies: string;
  specialConsiderations: string;
  pregnant: string;
  elderly: string;
  child: string;
  profileStatus: string;
  whyMatters: string;
  whyMattersDesc: string;
  noAllergiesYet: string;
  allergyPlaceholder: string;

  // ResultPage tabs
  tabMedications: string;
  tabSafety: string;
  tabUsage: string;
  tabWarnings: string;
  tabActions: string;
  tabHistory: string;

  // ResultPage labels
  prescriptionSummary: string;
  medicationList: string;
  criticalSafetyAlerts: string;
  usageAlerts: string;
  warningsAndCautions: string;
  actionableItems: string;
  shareWithCaregiver: string;
  findNearbyPharmacies: string;
  disclaimer: string;
  noMedicinesFound: string;
  noMedicinesExtracted: string;
  noCriticalAlerts: string;
  prescriptionLooksSafe: string;
  noUsageAlerts: string;
  noWarnings: string;
  translating: string;
  summary: string;
  medicines: string;
  interactions: string;
  warnings: string;

  // Medicine card labels
  purpose: string;
  morning: string;
  afternoon: string;
  evening: string;
  night: string;

  // Error messages
  errorScanFailed: string;
  errorTranslationFailed: string;
  errorGeminiFailed: string;
  errorRescan: string;

  // NearbyPharmacies
  nearbyTitle: string;
  gettingLocation: string;
  nearbyBanner: string;
  searchByCategory: string;
  openAllMaps: string;
  pharmacy: string;
  medicalStore: string;
  hospital: string;
  clinic: string;
  dawakhana: string;
  dispensary: string;
}> = {

  /* ════════════════════════════════════════════════════════════════════════
     ENGLISH
  ════════════════════════════════════════════════════════════════════════ */
  en: {
    scanTitle: 'Scan Prescription',
    scanSubtitle: 'Take a photo or upload an image of your prescription.',
    useCamera: 'Use Camera',
    uploadGallery: 'Upload from Gallery',
    processing: 'Processing...',
    activeProfile: 'Active Profile',
    allergies: 'Allergies',
    none: 'None',
    noSpecialConditions: 'No special conditions',
    safe: 'Safe',
    safeDesc: 'AI checks for drug-drug interactions automatically.',
    multiLingual: 'Multi-Lingual',
    multiLingualDesc: 'Instant translation to Hindi and Marathi.',
    edit: 'Edit',
    langLabel: 'Language',
    navHome: 'Home',
    navHistory: 'History',
    navHowItWorks: 'How It Works',
    navAboutUs: 'About Us',
    navNearbyPharmacies: 'Nearby Pharmacies',
    navTagline: 'Smart Medicine Assistant',
    heroHeadline: 'Your Prescription, Our',
    heroPriorityWord: 'Priority',
    heroSubtext: 'Upload your prescription and get clear, safe and easy to understand information about your medicines.',
    privacyNote: 'We keep your data',
    privacySafe: 'safe',
    privacyPrivate: 'private',
    featSafeTitle: 'Safe',
    featSafeDesc: 'AI checks for drug interactions to keep you safe.',
    featMultiLangTitle: 'Multi-Language',
    featMultiLangDesc: 'Instant translation in multiple languages.',
    featReliableTitle: 'Reliable',
    featReliableDesc: 'Accurate information you can trust.',
    featFastTitle: 'Fast & Easy',
    featFastDesc: 'Get clear results in just a few seconds.',
    footerLine1: 'Not a replacement for professional medical advice.',
    footerLine2: 'Always consult your doctor.',
    cameraAlignHint: 'Align prescription within the frame',
    cameraRetake: 'Retake',
    cameraUsePhoto: 'Use Photo',
    historyHeader: 'HISTORY',
    tableDate: 'DATE & TIME',
    tableMedicines: 'MEDICINES',
    tableInteractions: 'INTERACTIONS',
    tableTopMedicines: 'TOP MEDICINES',
    badgeLatest: 'Latest',
    btnClearHistory: 'Clear History',
    healthProfile: 'Your Health Profile',
    medicationAllergies: 'Medication Allergies',
    specialConsiderations: 'Special Considerations',
    pregnant: 'Pregnant',
    elderly: 'Elderly (65+)',
    child: 'Child/Infant',
    profileStatus: 'Profile Status',
    whyMatters: 'Why this matters?',
    whyMattersDesc: 'MedSutra AI uses this information to warn you if a scanned medicine is unsafe for your specific health circumstances.',
    noAllergiesYet: 'No allergies listed yet.',
    allergyPlaceholder: 'e.g. Penicillin, Sulfa',
    tabMedications: 'Medications',
    tabSafety: 'Safety',
    tabUsage: 'Usage',
    tabWarnings: 'Warnings',
    tabActions: 'Actions',
    tabHistory: 'History',
    prescriptionSummary: 'Prescription Summary',
    medicationList: 'Medication List',
    criticalSafetyAlerts: 'Critical Safety Alerts',
    usageAlerts: 'Usage Alerts',
    warningsAndCautions: 'Warnings & Cautions',
    actionableItems: 'Actionable Items',
    shareWithCaregiver: 'Share with Caregiver',
    findNearbyPharmacies: 'Find Nearby Pharmacies',
    disclaimer: 'Disclaimer: MedSutra AI is an AI assistant. Always verify instructions with your doctor or pharmacist before taking any medication.',
    noMedicinesFound: 'No medicines found',
    noMedicinesExtracted: 'No medicines extracted. Please rescan.',
    noCriticalAlerts: 'No critical safety alerts',
    prescriptionLooksSafe: 'This prescription looks safe',
    noUsageAlerts: 'No usage alerts available.',
    noWarnings: 'No warnings available.',
    translating: 'Translating medical context...',
    summary: 'Summary',
    medicines: 'Medicines',
    interactions: 'Interactions',
    warnings: 'Warnings',
    purpose: 'Purpose',
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    night: 'Night',
    errorScanFailed: 'We could not read your prescription clearly. Please make sure the image is well-lit and the text is visible, then try scanning again.',
    errorTranslationFailed: 'Translation could not be completed. Showing English version instead.',
    errorGeminiFailed: 'All Gemini models are currently unavailable. Please try again in a few minutes.',
    errorRescan: 'The prescription is unclear. Please capture a clearer image.',
    nearbyTitle: 'Nearby Medical Services',
    gettingLocation: 'Getting your location...',
    nearbyBanner: 'Showing medical services near',
    searchByCategory: 'Search by Category',
    openAllMaps: 'Open All Medical Services in Maps',
    pharmacy: 'Pharmacy / Chemist',
    medicalStore: 'Medical Store',
    hospital: 'Hospital',
    clinic: 'Clinic / Doctor',
    dawakhana: 'Dawakhana',
    step1Title: "Choose Who It's For",
    step1Desc: "Select if it's for you, a child, elderly or pregnant person.",
    step2Title: 'Scan or Upload',
    step2Desc: 'Take a photo or safely upload your medical prescription.',
    step3Title: 'Let AI Do the Work',
    step3Desc: 'Our smart AI reads and accurately understands your prescription.',
    adult: 'Adult (18–64)',
    step4Title: 'See Your Medicines',
    step4Desc: 'Get clear medicine names, purpose, dosage and timing.',
    step5Title: 'Stay Safe',
    step5Desc: 'Get instant alerts for drug interactions and special care.',
    step6Title: 'Take Action Easily',
    step6Desc: 'Find pharmacies, share, listen, and view your history.',
    howToUseTitle: 'How to Use MedSutra AI',
    howToUseSubtitle: 'Just upload your prescription and get clear, safe instructions in seconds.',
    dispensary: 'Dispensary',
    aboutTitle: 'About MedSutra AI',
    aboutTagline: 'Smart Medicine Assistant for every Indian family',
    aboutMission1: 'At MedSutra AI, we believe healthcare should be understandable, accessible, and safe for everyone.',
    aboutMission2: 'Our mission is to eliminate confusion caused by handwritten prescriptions using AI-powered text recognition and intelligent processing. We are committed to reducing medication errors and empowering patients with clarity and confidence.',
    aboutUnderstandable: 'Understandable',
    aboutUnderstandableDesc: 'Plain-language explanations in English, Hindi & Marathi',
    aboutAccessible: 'Accessible',
    aboutAccessibleDesc: 'Designed for every Indian patient regardless of language',
    aboutSafe: 'Safe',
    aboutSafeDesc: 'AI-powered drug interaction checks and allergy alerts',
  },

  /* ════════════════════════════════════════════════════════════════════════
     HINDI
  ════════════════════════════════════════════════════════════════════════ */
  hi: {
    scanTitle: 'पर्चा स्कैन करें',
    scanSubtitle: 'अपने पर्चे की फोटो लें या छवि अपलोड करें।',
    useCamera: 'कैमरा उपयोग करें',
    uploadGallery: 'गैलरी से अपलोड करें',
    processing: 'प्रक्रिया हो रही है...',
    activeProfile: 'सक्रिय प्रोफ़ाइल',
    allergies: 'एलर्जी',
    none: 'कोई नहीं',
    noSpecialConditions: 'कोई विशेष स्थिति नहीं',
    safe: 'सुरक्षित',
    safeDesc: 'AI स्वचालित रूप से दवाओं के बीच प्रतिक्रियाओं की जाँच करता है।',
    multiLingual: 'बहुभाषी',
    multiLingualDesc: 'हिंदी और मराठी में तत्काल अनुवाद।',
    edit: 'संपादित करें',
    langLabel: 'भाषा',
    navHome: 'होम',
    navHistory: 'इतिहास',
    navHowItWorks: 'यह कैसे काम करता है',
    navAboutUs: 'हमारे बारे में',
    navNearbyPharmacies: 'नज़दीकी दवाखाना',
    navTagline: 'स्मार्ट दवा सहायक',
    heroHeadline: 'आपका पर्चा, हमारी',
    heroPriorityWord: 'प्राथमिकता',
    heroSubtext: 'अपना पर्चा अपलोड करें और अपनी दवाओं के बारे में स्पष्ट, सुरक्षित और आसानी से समझने वाली जानकारी प्राप्त करें।',
    privacyNote: 'हम आपका डेटा रखते हैं',
    privacySafe: 'सुरक्षित',
    privacyPrivate: 'निजी',
    featSafeTitle: 'सुरक्षित',
    featSafeDesc: 'AI दवाओं के बीच प्रतिक्रियाओं की जाँच करता है।',
    featMultiLangTitle: 'बहुभाषी',
    featMultiLangDesc: 'कई भाषाओं में तत्काल अनुवाद।',
    featReliableTitle: 'विश्वसनीय',
    featReliableDesc: 'सटीक जानकारी जिस पर आप भरोसा कर सकते हैं।',
    featFastTitle: 'तेज़ और आसान',
    featFastDesc: 'कुछ ही सेकंड में स्पष्ट परिणाम प्राप्त करें।',
    footerLine1: 'पेशेवर चिकित्सा सलाह का विकल्प नहीं।',
    footerLine2: 'हमेशा अपने डॉक्टर से परामर्श करें।',
    cameraAlignHint: 'पर्चे को फ्रेम के अंदर रखें',
    cameraRetake: 'फिर से लें',
    cameraUsePhoto: 'फोटो उपयोग करें',
    historyHeader: 'इतिहास',
    tableDate: 'दिनांक और समय',
    tableMedicines: 'दवाएं',
    tableInteractions: 'इंटरैक्शन',
    tableTopMedicines: 'प्रमुख दवाएं',
    badgeLatest: 'नवीनतम',
    btnClearHistory: 'इतिहास मिटाएं',
    healthProfile: 'आपकी स्वास्थ्य प्रोफ़ाइल',
    medicationAllergies: 'दवा एलर्जी',
    specialConsiderations: 'विशेष ध्यान',
    pregnant: 'गर्भवती',
    elderly: 'बुजुर्ग (65+)',
    child: 'बच्चा/शिशु',
    profileStatus: 'प्रोफ़ाइल स्थिति',
    whyMatters: 'यह क्यों महत्वपूर्ण है?',
    whyMattersDesc: 'MedSutra AI इस जानकारी का उपयोग करके आपको चेतावनी देता है यदि स्कैन की गई दवा आपकी स्वास्थ्य परिस्थितियों के लिए असुरक्षित है।',
    noAllergiesYet: 'अभी तक कोई एलर्जी दर्ज नहीं।',
    allergyPlaceholder: 'जैसे Penicillin, Sulfa',
    tabMedications: 'दवाइयाँ',
    tabSafety: 'सुरक्षा',
    tabUsage: 'उपयोग',
    tabWarnings: 'चेतावनी',
    tabActions: 'कार्य',
    tabHistory: 'इतिहास',
    prescriptionSummary: 'पर्चा सारांश',
    medicationList: 'दवा सूची',
    criticalSafetyAlerts: 'गंभीर सुरक्षा चेतावनी',
    usageAlerts: 'उपयोग सूचनाएँ',
    warningsAndCautions: 'चेतावनियाँ और सावधानियाँ',
    actionableItems: 'कार्य योग्य आइटम',
    shareWithCaregiver: 'देखभालकर्ता के साथ साझा करें',
    findNearbyPharmacies: 'नज़दीकी दवाखाना खोजें',
    disclaimer: 'अस्वीकरण: MedSutra AI एक AI सहायक है। कोई भी दवा लेने से पहले अपने डॉक्टर या फार्मासिस्ट से सत्यापित करें।',
    noMedicinesFound: 'कोई दवा नहीं मिली',
    noMedicinesExtracted: 'कोई दवा नहीं निकाली। कृपया पुनः स्कैन करें।',
    noCriticalAlerts: 'कोई गंभीर सुरक्षा चेतावनी नहीं',
    prescriptionLooksSafe: 'यह पर्चा सुरक्षित लगता है',
    noUsageAlerts: 'कोई उपयोग सूचना उपलब्ध नहीं।',
    noWarnings: 'कोई चेतावनी उपलब्ध नहीं।',
    translating: 'चिकित्सा संदर्भ अनुवाद हो रहा है...',
    summary: 'सारांश',
    medicines: 'दवाइयाँ',
    interactions: 'प्रतिक्रियाएँ',
    warnings: 'चेतावनियाँ',
    purpose: 'उद्देश्य',
    morning: 'सुबह',
    afternoon: 'दोपहर',
    evening: 'शाम',
    night: 'रात',
    errorScanFailed: 'हम आपका पर्चा स्पष्ट रूप से नहीं पढ़ सके। कृपया सुनिश्चित करें कि छवि अच्छी रोशनी में है और पाठ दिखाई दे रहा है, फिर दोबारा स्कैन करें।',
    errorTranslationFailed: 'अनुवाद पूरा नहीं हो सका। अंग्रेजी संस्करण दिखाया जा रहा है।',
    errorGeminiFailed: 'सभी AI मॉडल अभी उपलब्ध नहीं हैं। कृपया कुछ मिनट बाद पुन: प्रयास करें।',
    errorRescan: 'पर्चा अस्पष्ट है। कृपया एक स्पष्ट तस्वीर लें।',
    nearbyTitle: 'नज़दीकी चिकित्सा सेवाएँ',
    gettingLocation: 'आपका स्थान प्राप्त हो रहा है...',
    nearbyBanner: 'नज़दीकी चिकित्सा सेवाएँ दिखाई जा रही हैं',
    searchByCategory: 'श्रेणी द्वारा खोजें',
    openAllMaps: 'मैप में सभी चिकित्सा सेवाएँ खोलें',
    pharmacy: 'दवाखाना / केमिस्ट',
    medicalStore: 'मेडिकल स्टोर',
    hospital: 'अस्पताल',
    clinic: 'क्लिनिक / डॉक्टर',
    dawakhana: 'दवाखाना',
    step1Title: 'यह किसके लिए है चुनें',
    step1Desc: 'चुनें कि यह आपके लिए है, बच्चे, बुजुर्ग या गर्भवती के लिए।',
    step2Title: 'स्कैन करें या अपलोड करें',
    step2Desc: 'अपने पर्चे की फोटो लें या सुरक्षित रूप से अपलोड करें।',
    step3Title: 'AI को काम करने दें',
    step3Desc: 'हमारा स्मार्ट AI आपके पर्चे को पढ़ता और समझता है।',
    adult: 'वयस्क (18–64)',
    step4Title: 'अपनी दवाइयाँ देखें',
    step4Desc: 'दवा के नाम, उद्देश्य, खुराक और समय स्पष्ट रूप से जानें।',
    step5Title: 'सुरक्षित रहें',
    step5Desc: 'दवाओं की प्रतिक्रिया और विशेष देखभाल के लिए तत्काल सूचनाएँ पाएँ।',
    step6Title: 'आसानी से कार्य करें',
    step6Desc: 'दवाखाना खोजें, साझा करें, सुनें और अपना इतिहास देखें।',
    howToUseTitle: 'MedSutra AI कैसे उपयोग करें',
    howToUseSubtitle: 'बस अपना पर्चा अपलोड करें और सेकंडों में स्पष्ट, सुरक्षित निर्देश पाएँ।',
    dispensary: 'औषधालय',
    aboutTitle: 'MedSutra AI के बारे में',
    aboutTagline: 'हर भारतीय परिवार के लिए स्मार्ट दवा सहायक',
    aboutMission1: 'MedSutra AI में, हम मानते हैं कि स्वास्थ्य सेवा सभी के लिए समझने योग्य, सुलभ और सुरक्षित होनी चाहिए।',
    aboutMission2: 'हमारा मिशन AI-संचालित टेक्स्ट पहचान और बुद्धिमान प्रसंस्करण का उपयोग करके हस्तलिखित नुस्खों से होने वाली भ्रांति को दूर करना है।',
    aboutUnderstandable: 'समझने योग्य',
    aboutUnderstandableDesc: 'अंग्रेजी, हिंदी और मराठी में सरल भाषा में स्पष्टीकरण',
    aboutAccessible: 'सुलभ',
    aboutAccessibleDesc: 'भाषा की परवाह किए बिना हर भारतीय मरीज के लिए डिज़ाइन किया गया',
    aboutSafe: 'सुरक्षित',
    aboutSafeDesc: 'AI-संचालित दवा इंटरैक्शन जांच और एलर्जी अलर्ट',
  },

  /* ════════════════════════════════════════════════════════════════════════
     MARATHI
  ════════════════════════════════════════════════════════════════════════ */
  mr: {
    scanTitle: 'प्रिस्क्रिप्शन स्कॅन करा',
    scanSubtitle: 'तुमच्या प्रिस्क्रिप्शनचा फोटो घ्या किंवा प्रतिमा अपलोड करा.',
    useCamera: 'कॅमेरा वापरा',
    uploadGallery: 'गॅलरीतून अपलोड करा',
    processing: 'प्रक्रिया सुरू आहे...',
    activeProfile: 'सक्रिय प्रोफाइल',
    allergies: 'ॲलर्जी',
    none: 'काहीही नाही',
    noSpecialConditions: 'कोणतीही विशेष अट नाही',
    safe: 'सुरक्षित',
    safeDesc: 'AI आपोआप औषधांमधील प्रतिक्रिया तपासते.',
    multiLingual: 'बहुभाषिक',
    multiLingualDesc: 'हिंदी आणि मराठीत त्वरित भाषांतर.',
    edit: 'संपादित करा',
    langLabel: 'भाषा',
    navHome: 'मुख्यपृष्ठ',
    navHistory: 'इतिहास',
    navHowItWorks: 'हे कसे कार्य करते',
    navAboutUs: 'आमच्याबद्दल',
    navNearbyPharmacies: 'जवळील औषधालय',
    navTagline: 'स्मार्ट औषध सहायक',
    heroHeadline: 'तुमचे प्रिस्क्रिप्शन, आमची',
    heroPriorityWord: 'प्राथमिकता',
    heroSubtext: 'तुमचे प्रिस्क्रिप्शन अपलोड करा आणि तुमच्या औषधांबद्दल स्पष्ट, सुरक्षित आणि सहज समजेल अशी माहिती मिळवा.',
    privacyNote: 'आम्ही तुमचा डेटा ठेवतो',
    privacySafe: 'सुरक्षित',
    privacyPrivate: 'खाजगी',
    featSafeTitle: 'सुरक्षित',
    featSafeDesc: 'AI औषधांमधील प्रतिक्रिया तपासून तुम्हाला सुरक्षित ठेवते.',
    featMultiLangTitle: 'बहुभाषिक',
    featMultiLangDesc: 'अनेक भाषांमध्ये त्वरित भाषांतर.',
    featReliableTitle: 'विश्वासार्ह',
    featReliableDesc: 'तुम्ही विश्वास ठेवू शकता अशी अचूक माहिती.',
    featFastTitle: 'जलद आणि सोपे',
    featFastDesc: 'काही सेकंदांमध्ये स्पष्ट निकाल मिळवा.',
    footerLine1: 'व्यावसायिक वैद्यकीय सल्ल्याचा पर्याय नाही.',
    footerLine2: 'नेहमी तुमच्या डॉक्टरांचा सल्ला घ्या.',
    cameraAlignHint: 'प्रिस्क्रिप्शन फ्रेमच्या आत ठेवा',
    cameraRetake: 'पुन्हा घ्या',
    cameraUsePhoto: 'फोटो वापरा',
    historyHeader: 'इतिहास',
    tableDate: 'तारीख आणि वेळ',
    tableMedicines: 'औषधे',
    tableInteractions: 'परस्पर क्रिया',
    tableTopMedicines: 'प्रमुख औषधे',
    badgeLatest: 'नवीनतम',
    btnClearHistory: 'इतिहास पुसा',
    healthProfile: 'तुमची आरोग्य प्रोफाइल',
    medicationAllergies: 'औषध ॲलर्जी',
    specialConsiderations: 'विशेष विचार',
    pregnant: 'गर्भवती',
    elderly: 'वृद्ध (65+)',
    child: 'मूल/बालक',
    profileStatus: 'प्रोफाइल स्थिती',
    whyMatters: 'हे का महत्त्वाचे आहे?',
    whyMattersDesc: 'MedSutra AI ही माहिती वापरून तुम्हाला सावध करते जर स्कॅन केलेले औषध तुमच्या आरोग्यासाठी असुरक्षित असेल.',
    noAllergiesYet: 'अद्याप कोणतीही ॲलर्जी नोंदवलेली नाही.',
    allergyPlaceholder: 'उदा. Penicillin, Sulfa',
    tabMedications: 'औषधे',
    tabSafety: 'सुरक्षा',
    tabUsage: 'वापर',
    tabWarnings: 'इशारे',
    tabActions: 'कृती',
    tabHistory: 'इतिहास',
    prescriptionSummary: 'प्रिस्क्रिप्शन सारांश',
    medicationList: 'औषध यादी',
    criticalSafetyAlerts: 'गंभीर सुरक्षा इशारे',
    usageAlerts: 'वापर सूचना',
    warningsAndCautions: 'इशारे आणि सावधानता',
    actionableItems: 'कृती आयटम',
    shareWithCaregiver: 'काळजीवाहकाशी शेअर करा',
    findNearbyPharmacies: 'जवळील औषधालय शोधा',
    disclaimer: 'अस्वीकरण: MedSutra AI एक AI सहायक आहे. कोणतेही औषध घेण्यापूर्वी तुमच्या डॉक्टर किंवा फार्मासिस्टशी खात्री करा.',
    noMedicinesFound: 'कोणतेही औषध सापडले नाही',
    noMedicinesExtracted: 'कोणतेही औषध काढले नाही. कृपया पुन्हा स्कॅन करा.',
    noCriticalAlerts: 'कोणतेही गंभीर सुरक्षा इशारे नाहीत',
    prescriptionLooksSafe: 'हे प्रिस्क्रिप्शन सुरक्षित दिसते',
    noUsageAlerts: 'कोणत्याही वापर सूचना उपलब्ध नाहीत.',
    noWarnings: 'कोणतेही इशारे उपलब्ध नाहीत.',
    translating: 'वैद्यकीय संदर्भाचे भाषांतर होत आहे...',
    summary: 'सारांश',
    medicines: 'औषधे',
    interactions: 'प्रतिक्रिया',
    warnings: 'इशारे',
    purpose: 'उद्देश',
    morning: 'सकाळ',
    afternoon: 'दुपार',
    evening: 'संध्याकाळ',
    night: 'रात्र',
    errorScanFailed: 'आम्ही तुमचे प्रिस्क्रिप्शन स्पष्टपणे वाचू शकलो नाही. कृपया प्रतिमा चांगल्या प्रकाशात असल्याची खात्री करा आणि पुन्हा स्कॅन करण्याचा प्रयत्न करा.',
    errorTranslationFailed: 'भाषांतर पूर्ण होऊ शकले नाही. इंग्रजी आवृत्ती दाखवत आहे.',
    errorGeminiFailed: 'सर्व AI मॉडेल सध्या उपलब्ध नाहीत. कृपया काही मिनिटांनी पुन्हा प्रयत्न करा.',
    errorRescan: 'प्रिस्क्रिप्शन अस्पष्ट आहे. कृपया स्पष्ट फोटो काढा.',
    nearbyTitle: 'जवळील वैद्यकीय सेवा',
    gettingLocation: 'तुमचे स्थान मिळवत आहे...',
    nearbyBanner: 'जवळील वैद्यकीय सेवा दाखवत आहे',
    searchByCategory: 'श्रेणीनुसार शोधा',
    openAllMaps: 'नकाशात सर्व वैद्यकीय सेवा उघडा',
    pharmacy: 'औषधालय / केमिस्ट',
    medicalStore: 'मेडिकल स्टोअर',
    hospital: 'रुग्णालय',
    clinic: 'दवाखाना / डॉक्टर',
    dawakhana: 'दवाखाना',
    step1Title: 'हे कोणासाठी आहे ते निवडा',
    step1Desc: 'हे तुमच्यासाठी, मुलासाठी, वृद्धासाठी किंवा गर्भवतीसाठी आहे का ते निवडा.',
    step2Title: 'स्कॅन करा किंवा अपलोड करा',
    step2Desc: 'तुमच्या प्रिस्क्रिप्शनचा फोटो घ्या किंवा सुरक्षितपणे अपलोड करा.',
    step3Title: 'AI ला काम करू द्या',
    step3Desc: 'आमचे स्मार्ट AI तुमचे प्रिस्क्रिप्शन वाचते आणि समजते.',
    adult: 'प्रौढ (18–64)',
    step4Title: 'तुमची औषधे पहा',
    step4Desc: 'औषधाची नावे, उद्देश, मात्रा आणि वेळ स्पष्टपणे जाणून घ्या.',
    step5Title: 'सुरक्षित राहा',
    step5Desc: 'औषधांच्या प्रतिक्रिया आणि विशेष काळजीसाठी त्वरित इशारे मिळवा.',
    step6Title: 'सहजपणे कृती करा',
    step6Desc: 'औषधालय शोधा, शेअर करा, ऐका आणि इतिहास पहा.',
    howToUseTitle: 'MedSutra AI कसे वापरावे',
    howToUseSubtitle: 'फक्त तुमचे प्रिस्क्रिप्शन अपलोड करा आणि सेकंदात स्पष्ट, सुरक्षित सूचना मिळवा.',
    dispensary: 'औषध वितरण केंद्र',
    aboutTitle: 'MedSutra AI बद्दल',
    aboutTagline: 'प्रत्येक भारतीय कुटुंबासाठी स्मार्ट औषध सहाय्यक',
    aboutMission1: 'MedSutra AI मध्ये, आम्ही विश्वास ठेवतो की आरोग्य सेवा सर्वांसाठी समजण्यायोग्य, सुलभ आणि सुरक्षित असावी.',
    aboutMission2: 'आमचे ध्येय AI-चालित मजकूर ओळख आणि बुद्धिमान प्रक्रिया वापरून हस्तलिखित प्रिस्क्रिप्शनमुळे होणारा गोंधळ दूर करणे आहे.',
    aboutUnderstandable: 'समजण्यायोग्य',
    aboutUnderstandableDesc: 'इंग्रजी, हिंदी आणि मराठीत सोप्या भाषेत स्पष्टीकरण',
    aboutAccessible: 'सुलभ',
    aboutAccessibleDesc: 'भाषेची पर्वा न करता प्रत्येक भारतीय रुग्णासाठी डिझाइन केलेले',
    aboutSafe: 'सुरक्षित',
    aboutSafeDesc: 'AI-चालित औषध परस्परक्रिया तपासणी आणि ऍलर्जी सतर्कता',
  },
};