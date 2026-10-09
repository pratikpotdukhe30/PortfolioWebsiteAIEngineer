# Pratik Potdukhe · Portfolio

Personal portfolio with an AI assistant that answers visitors' questions about my projects and experience.

- Front end: React + TypeScript + Vite
- Chat: a Vercel serverless function (`api/chat.ts`) that calls the Google Gemini API
- Knowledge: everything the assistant knows comes from `src/data/profile.ts`, turned into a grounding prompt in `src/data/knowledge.ts`

## Edit content

Update `src/data/profile.ts`. The website and the assistant both read from it.

- Photo: put `pratik.jpg` in `public/` and set `photo: "/pratik.jpg"`
- CV: put the PDF in `public/` and set `cv: "/Pratik_Potdukhe_CV.pdf"`
- Project links: set `repo` / `demo` on each project

## Run locally

```bash
npm install
npm run dev          # site at http://localhost:5173 (chat uses offline answers)
```

To test the real AI chat locally:

```bash
npm i -g vercel
vercel dev           # needs GEMINI_API_KEY in a .env.local file
```

`.env.local`:
```
GEMINI_API_KEY=your-key-here
```

## Get a free Gemini API key

1. Go to https://aistudio.google.com and sign in with a Google account.
2. Click **Get API key → Create API key**. Copy it.
3. Never commit the key to GitHub. It only goes in `.env.local` (ignored by git) and in Vercel.

## Deploy on Vercel (free)

1. Push this folder to a new GitHub repo, e.g. `portfolio`.
2. On vercel.com, sign in with GitHub → **Add New → Project** → select the repo.
3. Framework preset: **Vite**. Name the project `pratikpotdukhe30` to get `pratikpotdukhe30.vercel.app`.
4. Under **Environment Variables** add `GEMINI_API_KEY` with your key. Optional: `GEMINI_MODEL` (default `gemini-2.5-flash`).
5. Click **Deploy**. Every push to `main` redeploys.

## How the assistant works

The profile is small, so the whole of it is sent to the model as context with each question, together with rules to answer only from it and to say "I don't know" otherwise. A natural next step is real retrieval: chunk the profile and project write-ups, embed them, and send only the most relevant chunks.
