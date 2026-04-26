import { PrescriptionResult, UserProfile } from "../types";

async function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function callGemini(
  prompt: string,
  image?: { base64: string; mimeType: string }
): Promise<string> {
  const body: any = { prompt };
  if (image) {
    body.imageBase64 = image.base64;
    body.imageMimeType = image.mimeType;
  }
  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to contact Gemini API");
  }
  const data = await response.json();
  return data.result;
}

export async function processPrescription(
  ocrText: string,
  profile: UserProfile,
  imageFile?: File | Blob
): Promise<PrescriptionResult> {

  let image: { base64: string; mimeType: string } | undefined;
  if (imageFile) {
    const base64 = await fileToBase64(imageFile);
    const mimeType = imageFile instanceof File ? imageFile.type || "image/jpeg" : "image/jpeg";
    image = { base64, mimeType };
  }

  const prompt = `
You are RxBridge, a precise Medical Data Extraction Assistant for Indian patients.
Your top priority is PATIENT SAFETY and DATA ACCURACY.

${image
      ? "Analyze this prescription image carefully. Read ALL handwritten and printed text including medicine names, dosages and instructions. Scan every single line."
      : `Analyze this prescription text: "${ocrText}"`
    }

Patient Profile:
- Allergies: ${profile.allergies.join(", ") || "None"}
- Special Conditions: ${[
      profile.isPregnant ? "Pregnant" : null,
      profile.isElderly ? "Elderly (>60 years)" : null,
      profile.isChild ? "Child (<12 years)" : null,
    ].filter(Boolean).join(", ") || "None"}

EXTRACTION RULES:
1. Extract ALL medicines — look for: Cap, Tab, T=, T-, T--, Syp, Inj prefixes on EVERY line
2. NEVER skip any medicine even if regional language text appears below it
3. Circled numbers at end of line = quantity to dispense, NOT dosage
4. Do NOT replace brand names with generic names
5. Add generic name in brackets e.g. "MOXIFORCE CV (Amoxicillin+Clavulanate)"
6. OD=once daily, BD=twice daily, TDS=three times daily, HS=bedtime, AC=before food, PC=after food
7. ONE entry per medicine — combine all timing into slots
8. Never write "Unknown" — make best medical guess if unclear
9. Detect ALL drug interactions with severity High/Medium/Low
10. If image completely unreadable return rescanRequired: true

Output ONLY valid JSON, no markdown, no backticks, using this EXACT schema:
{
  "rescanRequired": false,
  "medicines": [
    {
      "name": "Exact Name (Generic Name)",
      "dosage": "e.g. 625mg",
      "timing": "e.g. Twice daily after food",
      "slots": {
        "morning": true,
        "afternoon": false,
        "evening": false,
        "night": true
      },
      "purpose": "plain English explanation",
      "foodWarning": "food/drink instructions",
      "usageAlert": "how to take this medicine",
      "caution": "specific warning for this medicine"
    }
  ],
  "interactions": [
    {
      "severity": "High",
      "drugs": ["Drug A", "Drug B"],
      "description": "explanation of interaction risk"
    }
  ],
  "generalWarnings": ["important notes"],
  "usageAlerts": ["Complete full course", "Take after food"],
  "warningsAndCautions": ["May cause drowsiness", "Avoid alcohol"],
  "tabs": {
    "medicationList": [
      {
        "name": "Exact medicine name",
        "dosage": "e.g. 625mg",
        "frequency": "e.g. Twice daily after food"
      }
    ],
    "criticalSafetyAlerts": [
      "Any severe or immediate risks the patient must know"
    ],
    "usageAlerts": [
      "Take after meals",
      "Complete the full course of antibiotics",
      "Take with warm water"
    ],
    "warningsAndCautions": [
      "May cause drowsiness",
      "Avoid alcohol during this course",
      "Do not operate heavy machinery"
    ],
    "actionableItems": {
      "findPharmacyText": "Find Nearby Pharmacies",
      "shareCaregiverText": "Share with Caregiver"
    }
  }
}
`;

  const text = await callGemini(prompt, image);

  try {
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean) as PrescriptionResult & { rescanRequired?: boolean };

    if (parsed.rescanRequired) {
      throw new Error("RESCAN REQUIRED: The prescription is unclear. Please capture a clearer image.");
    }

    if (!parsed.usageAlerts) parsed.usageAlerts = [];
    if (!parsed.warningsAndCautions) parsed.warningsAndCautions = [];
    if (!parsed.tabs) {
      parsed.tabs = {
        medicationList: parsed.medicines.map(m => ({
          name: m.name,
          dosage: m.dosage,
          frequency: m.timing,
        })),
        criticalSafetyAlerts: parsed.generalWarnings || [],
        usageAlerts: parsed.usageAlerts || [],
        warningsAndCautions: parsed.warningsAndCautions || [],
        actionableItems: {
          findPharmacyText: "Find Nearby Pharmacies",
          shareCaregiverText: "Share with Caregiver",
        },
      };
    }

    return parsed as PrescriptionResult;
  } catch (err: any) {
    if (err.message?.includes("RESCAN REQUIRED")) throw err;
    throw new Error("We could not read your prescription clearly. Please make sure the image is well-lit and the text is visible, then try scanning again.");
  }
}

export async function translateResult(
  data: PrescriptionResult,
  targetLanguage: "hi" | "mr"
): Promise<PrescriptionResult> {
  const langName = targetLanguage === "hi" ? "Hindi" : "Marathi";

  const prompt = `
Translate this prescription data into ${langName}.

RULES:
1. NEVER translate medicine names — keep exactly as written
2. Translate ALL other text including tabs sections
3. Translate actionableItems text: findPharmacyText and shareCaregiverText into ${langName}
4. Use simple ${langName} an elderly Indian patient can understand
5. Keep JSON structure exactly the same

Data: ${JSON.stringify(data)}

Return ONLY valid JSON. No markdown, no backticks.
`;

  const text = await callGemini(prompt);

  try {
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean) as PrescriptionResult;
    if (!parsed.usageAlerts) parsed.usageAlerts = [];
    if (!parsed.warningsAndCautions) parsed.warningsAndCautions = [];
    return parsed;
  } catch {
    throw new Error("Translation could not be completed. Showing English version instead.");
  }
}