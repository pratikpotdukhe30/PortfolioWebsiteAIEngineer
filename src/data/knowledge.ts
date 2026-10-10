import { experience, now, profile, projects, skills } from "./profile.js";

// The knowledge base the assistant answers from. Everything here comes from profile.ts,
// so updating that one file updates both the website and the chat.
export function buildKnowledge(): string {
  const parts: string[] = [];
  parts.push(`# About ${profile.name}\n${profile.about.join(" ")}\nRole: ${profile.role}. Location: ${profile.location}.`);
  parts.push(`# What he is looking for\n${profile.lookingFor}.`);
  parts.push(`# Contact\nEmail: ${profile.email}\nLinkedIn: ${profile.linkedin}\nGitHub: ${profile.github}`);
  parts.push(`# Experience and education\n${experience.map((e) => `- ${e.where}, ${e.what} (${e.when}): ${e.note}`).join("\n")}`);
  parts.push(`# Skills\n${skills.map(([k, v]) => `- ${k}: ${v}`).join("\n")}`);
  for (const p of projects) {
    parts.push(
      `# Project: ${p.title}\nContext: ${p.where}\nStack: ${p.stack}\n${p.body.join(" ")}` +
        (p.repo ? `\nCode: ${p.repo}` : "") + (p.demo ? `\nDemo: ${p.demo}` : "")
    );
  }
  parts.push(`# Currently\n${now}`);
  return parts.join("\n\n");
}

export const SYSTEM_PROMPT = `You are the assistant on ${profile.name}'s portfolio website. Visitors are mostly recruiters, hiring managers and engineers.

Answer questions about ${profile.name.split(" ")[0]} using ONLY the profile below. Speak about him in the third person ("Pratik built...").
Rules:
- If the profile doesn't contain the answer, say you don't know that and suggest emailing him at ${profile.email}. Never invent facts, numbers, dates, employers or results.
- Keep answers short: 2 to 5 sentences, plain text, no markdown headings or bold.
- Be friendly and direct. Don't oversell; describe what he did accurately.
- If asked something unrelated to Pratik, briefly say you can only answer questions about him.

PROFILE
${buildKnowledge()}`;

// Offline fallback used when the API isn't reachable (local `npm run dev`, previews).
// Written in the third person to match the assistant's voice.
const FALLBACK = {
  capgemini:
    "From March 2022 to August 2024 Pratik worked at Capgemini, first as a Software Engineer and then as a Senior Analyst. He built REST APIs in Java and Spring Boot for the Stellantis AfterSales platform, on Oracle databases, delivered through Jenkins and Git.",
  potato:
    "For his Numerical Analysis for Machine Learning course, Pratik trained a CNN in TensorFlow and Keras that predicts potato leaf disease from a photo. He served it through FastAPI on Google Cloud Functions, with a React web app and a React Native Android app as clients.",
  sleep:
    "With his team, Team Nyx, Pratik worked on predicting sleep quality from Garmin wearable data using federated learning, so raw data never leaves each participant's side. He worked on it end to end: data preparation, federated training and evaluation.",
  inbox:
    "As a take-home assignment for Arcus Corp, Pratik built a conversation inbox in TypeScript, Express, React and SQLite. It receives messages through a webhook, sends automatic replies, and updates the UI live with unread counts.",
  skills:
    "On the AI side Pratik works with LangChain, RAG, TensorFlow and Keras, including CNNs and federated learning. He also has a solid engineering base in Python, Java, Spring Boot, FastAPI, React and SQL, plus Google Cloud and Docker.",
  looking: `Pratik is looking for ${profile.lookingFor}.`,
  study:
    "Pratik has been doing an M.Sc. in Computer Science and Engineering at Politecnico di Milano since September 2024, with a focus on machine learning.",
  now: "Pratik is currently learning retrieval-augmented generation by building a chatbot that answers questions about YouTube videos from their transcripts.",
  contact: `You can email Pratik at ${profile.email} or reach him on LinkedIn.`,
  intro:
    "Pratik is a software engineer in Milan. He spent two and a half years at Capgemini building Java backend services, and is now doing a master's at Politecnico di Milano focused on machine learning and LLM applications.",
};

export function localAnswer(q: string): string {
  const t = q.toLowerCase();
  const has = (...w: string[]) => w.some((x) => t.includes(x));
  if (has("potato", "classifier", "cnn", "leaf")) return FALLBACK.potato;
  if (has("sleep", "federated", "garmin")) return FALLBACK.sleep;
  if (has("inbox", "arcus", "webhook")) return FALLBACK.inbox;
  if (has("capgemini", "stellantis", "java", "spring", "experience", "work")) return FALLBACK.capgemini;
  if (has("skill", "stack", "tech", "tools", "ai ")) return FALLBACK.skills;
  if (has("look", "intern", "job", "role", "available", "open")) return FALLBACK.looking;
  if (has("contact", "email", "reach", "hire")) return FALLBACK.contact;
  if (has("study", "polimi", "politecnico", "master", "education", "degree")) return FALLBACK.study;
  if (has("now", "current", "learning", "rag", "youtube")) return FALLBACK.now;
  return FALLBACK.intro;
}
