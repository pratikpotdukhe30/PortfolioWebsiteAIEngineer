// Vercel serverless function: POST /api/chat
// Set GEMINI_API_KEY in Vercel → Project → Settings → Environment Variables.
import { SYSTEM_PROMPT } from "../src/data/knowledge";

type Msg = { role: "user" | "assistant"; content: string };

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({ error: "Missing GEMINI_API_KEY" });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const messages: Msg[] = Array.isArray(body.messages) ? body.messages.slice(-8) : [];
  const clean = messages
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.content.slice(0, 800) }] }));
  if (!clean.length || clean[clean.length - 1].role !== "user") return res.status(400).json({ error: "No question" });

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: clean,
        generationConfig: { temperature: 0.3, maxOutputTokens: 400 },
      }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(502).json({ error: data?.error?.message || "Model error" });
    const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") || "";
    return res.status(200).json({ answer: text.trim() || "Sorry, I couldn't answer that. Try asking another way." });
  } catch {
    return res.status(502).json({ error: "Could not reach the model" });
  }
}
