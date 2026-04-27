import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY not configured." });

  const { prompt, imageBase64, imageMimeType } = req.body;
  if (!prompt) return res.status(400).json({ error: "prompt is required." });

  const contents = imageBase64
    ? [{ parts: [{ inline_data: { mime_type: imageMimeType || "image/jpeg", data: imageBase64 } }, { text: prompt }] }]
    : [{ parts: [{ text: prompt }] }];

  const models = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-2.0-flash"];

  for (const model of models) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents }),
      });
      if (!r.ok) continue;
      const data = await r.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response.";
      return res.json({ result: text });
    } catch { continue; }
  }
  return res.status(503).json({ error: "All Gemini models unavailable." });
}
