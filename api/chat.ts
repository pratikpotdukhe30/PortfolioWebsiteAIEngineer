// Vercel serverless function: POST /api/chat
// Uses OpenAI when OPENAI_API_KEY is set, otherwise Gemini (GEMINI_API_KEY).
// Set keys in Vercel → Project → Settings → Environment Variables.
import { SYSTEM_PROMPT } from "../src/data/knowledge.js";

type Msg = { role: "user" | "assistant"; content: string };

async function askOpenAI(messages: Msg[], key: string): Promise<string> {
  const r = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-6-luna",
      instructions: SYSTEM_PROMPT,
      input: messages.map((m) => ({ role: m.role, content: m.content })),
      reasoning: { effort: "none" },
      max_output_tokens: 400,
    }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error?.message || `OpenAI error ${r.status}`);
  // Find the message item and join its text parts (output may also contain other item types).
  const text = (data.output || [])
    .filter((o: any) => o.type === "message")
    .flatMap((o: any) => o.content || [])
    .filter((c: any) => c.type === "output_text")
    .map((c: any) => c.text)
    .join("");
  return text || data.output_text || "";
}

async function askGemini(messages: Msg[], key: string): Promise<string> {
  const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: messages.map((m) => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.content }] })),
      generationConfig: { temperature: 0.3, maxOutputTokens: 2048 },
    }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error?.message || `Gemini error ${r.status}`);
  return data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") || "";
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

  const openaiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!openaiKey && !geminiKey) return res.status(500).json({ error: "Missing OPENAI_API_KEY or GEMINI_API_KEY" });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const raw: Msg[] = Array.isArray(body.messages) ? body.messages.slice(-8) : [];
  const messages = raw
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.slice(0, 800) }));
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return res.status(400).json({ error: "No question" });
  }

  try {
    const text = openaiKey ? await askOpenAI(messages, openaiKey) : await askGemini(messages, geminiKey!);
    return res.status(200).json({ answer: text.trim() || "Sorry, I couldn't answer that. Try asking another way." });
  } catch (e) {
    return res.status(502).json({ error: (e as Error).message || "Could not reach the model" });
  }
}