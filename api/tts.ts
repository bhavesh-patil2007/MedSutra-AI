import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API key not configured." });

  const { text, languageCode, voiceName } = req.body;
  if (!text || !languageCode) return res.status(400).json({ error: "text and languageCode required." });

  const r = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input: { text }, voice: { languageCode, name: voiceName, ssmlGender: "FEMALE" }, audioConfig: { audioEncoding: "MP3", speakingRate: 0.9 } }),
  });
  const data = await r.json();
  return res.json(data);
}
