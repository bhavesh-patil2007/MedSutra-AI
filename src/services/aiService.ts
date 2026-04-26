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
You are MedSutra AI, a precise Medical Data Extraction Assistant for Indian patients.
Your top priority is PATIENT SAFETY and DATA ACCURACY.

${image
    ? "Analyze this prescription image carefully. Read ALL handwritten and printed text including medicine names, dosages and instructions."
    : `Analyze this prescription text: "${ocrText}"`
  }

Patient Profile:
- Allergies: ${profile.allergies.join(", ") || "None"}
- Special Conditions: ${[
    profile.isPregnant ? "Pregnant" : null,
    profile.isElderly ? "Elderly (>60 years)" : null,
    profile.isChild ? "Child (<12 years)" : null,
  ].filter(Boolean).join(", ") || "None"}

RULES:
1. Extract medicine names EXACTLY as written on prescription
2. Do NOT replace brand names with generic names
3. Add generic name in brackets e.g. "MOXIFORCE CV (Amoxicillin+Clavulanate)"
4. OD=once daily, BD=twice daily, TDS=three times, HS=bedtime, AC=before food, PC=after food, SOS=as needed
5. ONE entry per medicine
6. Detect ALL drug interactions with severity High/Medium/Low
7. If image is completely unreadable return rescanRequired: true

Return ONLY valid JSON, no markdown, no backticks:
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
      "foodWarning": "food/drink instructions"
    }
  ],
  "interactions": [
    {
      "severity": "High",
      "drugs": ["Drug A", "Drug B"],
      "description": "explanation of risk"
    }
  ],
  "generalWarnings": ["important notes"]
}
`;

  const text = await callGemini(prompt, image);
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean) as PrescriptionResult & { rescanRequired?: boolean };
    if (parsed.rescanRequired) {
      throw new Error("RESCAN REQUIRED: The prescription is unclear. Please capture a clearer image.");
    }
    return parsed as PrescriptionResult;
  } catch (err: any) {
    if (err.message?.includes("RESCAN REQUIRED")) throw err;
    throw new Error("AI returned invalid JSON. Please try again.");
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
1. NEVER translate medicine names
2. Translate ALL other text
3. Use simple ${langName} for elderly patients
4. Keep JSON structure exactly the same
Data: ${JSON.stringify(data)}
Return ONLY valid JSON. No markdown, no backticks.
`;
  const text = await callGemini(prompt);
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean) as PrescriptionResult;
  } catch {
    throw new Error("Translation returned invalid JSON. Please try again.");
  }
}
