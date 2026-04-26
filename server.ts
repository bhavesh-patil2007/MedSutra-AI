import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import dotenv from "dotenv";

// Load .env file for local development
dotenv.config();

// Proper ESM __dirname reconstruction
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer(): Promise<void> {
  const app = express();
  const PORT = 3000;

  // IMPORTANT: Increase limit for base64 image uploads
  app.use(express.json({ limit: "10mb" }));

  // CORS headers for dev (Vite on 5173 -> Express on 3000)
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }
    next();
  });

  // Route: TTS proxy (avoids CORS)
  app.get("/api/tts-proxy", async (req: Request, res: Response) => {
    const { q, lang } = req.query;
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(q as string)}&tl=${lang}&client=tw-ob`;
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Accept-Ranges", "none");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Content-Length", buffer.byteLength.toString());
    res.send(Buffer.from(buffer));
  });

  // Route: static JSON data
  app.get("/api/data/:type", async (req: Request, res: Response) => {
    const { type } = req.params;
    const allowed = ["shorthand", "interactions", "food_warnings"];
    if (!allowed.includes(type)) {
      return res.status(404).json({ error: "Data type not found" });
    }
    try {
      const filePath = path.join(__dirname, "src", "data", `${type}.json`);
      const data = await fs.readFile(filePath, "utf-8");
      res.json(JSON.parse(data));
    } catch (err) {
      res.status(500).json({ error: "Failed to load data" });
    }
  });

  // Secure Gemini proxy route — supports both text and image (Vision)
  app.post("/api/gemini", async (req: Request, res: Response) => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }

    const { prompt, imageBase64, imageMimeType } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "A 'prompt' string is required in the request body." });
    }

    const contents = imageBase64
      ? [
        {
          parts: [
            {
              inline_data: {
                mime_type: imageMimeType || "image/jpeg",
                data: imageBase64,
              },
            },
            { text: prompt },
          ],
        },
      ]
      : [{ parts: [{ text: prompt }] }];

    const models = [
      "gemini-2.5-flash-lite",
      "gemini-2.5-flash",
      "gemini-2.0-flash",
    ];

    let lastError = "";

    for (const model of models) {
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        attempts++;
        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ contents }),
            }
          );

          if (geminiRes.status === 503 && attempts < maxAttempts) {
            console.log(`[${model}] 503 overload, retrying (${attempts}/${maxAttempts})...`);
            await new Promise(resolve => setTimeout(resolve, 2000 * attempts));
            continue;
          }
          if (geminiRes.status === 404) {
            console.log(`[${model}] 404 not found, trying next model...`);
            lastError = `Model ${model} not found`;
            break;
          }
          if (geminiRes.status === 429) {
            console.log(`[${model}] 429 quota exceeded, trying next model...`);
            lastError = `Model ${model} quota exceeded`;
            break;
          }
          if (!geminiRes.ok) {
            const errText = await geminiRes.text();
            lastError = errText;
            break;
          }

          const data = await geminiRes.json();
          const text =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response from Gemini.";
          console.log(`[${model}] Success! ${imageBase64 ? '(Vision mode)' : '(Text mode)'}`);
          return res.json({ result: text });

        } catch (err) {
          console.error(`[${model}] Network error:`, err);
          lastError = "Network error contacting Gemini API";
          break;
        }
      }
    }

    console.error("All Gemini models failed. Last error:", lastError);
    return res.status(503).json({
      error: "All Gemini models are currently unavailable. Please try again in a few minutes."
    });
  });

  // ─── NEW: Google Cloud TTS proxy — Hindi and Marathi voices ───────────────
  app.post("/api/tts", async (req: Request, res: Response) => {
    // Uses same API key as Gemini — Google Cloud key works for both
    const apiKey = process.env.GOOGLE_TTS_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "TTS API key not configured." });
    }

    const { text, languageCode, voiceName } = req.body;

    if (!text || !languageCode) {
      return res.status(400).json({ error: "text and languageCode are required." });
    }

    try {
      console.log(`[TTS] Requesting voice: ${languageCode} — ${voiceName || 'default'}`);

      const ttsRes = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: { text },
            voice: {
              languageCode,
              name: voiceName || undefined,
              ssmlGender: "FEMALE",
            },
            audioConfig: {
              audioEncoding: "MP3",
              speakingRate: 0.9,
              pitch: 0.0,
            },
          }),
        }
      );

      if (!ttsRes.ok) {
        const errText = await ttsRes.text();
        console.error("[TTS] API error:", errText);

        // If Wavenet voice not available, retry with standard voice
        if (errText.includes('voice') && voiceName?.includes('Wavenet')) {
          console.log("[TTS] Wavenet not available, retrying with standard voice...");
          const retryRes = await fetch(
            `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                input: { text },
                voice: {
                  languageCode,
                  ssmlGender: "FEMALE",
                },
                audioConfig: {
                  audioEncoding: "MP3",
                  speakingRate: 0.9,
                  pitch: 0.0,
                },
              }),
            }
          );

          if (!retryRes.ok) {
            const retryErr = await retryRes.text();
            return res.status(retryRes.status).json({ error: retryErr });
          }

          const retryData = await retryRes.json();
          console.log("[TTS] Standard voice success!");
          return res.json({ audioContent: retryData.audioContent });
        }

        return res.status(ttsRes.status).json({ error: errText });
      }

      const data = await ttsRes.json();
      console.log(`[TTS] Success! Language: ${languageCode}`);
      return res.json({ audioContent: data.audioContent });

    } catch (err) {
      console.error("[TTS] Proxy error:", err);
      return res.status(500).json({ error: "Failed to contact Google TTS API." });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve built static files
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RxBridge Server running at http://localhost:${PORT}`);
  });
}

startServer();