# Pratik Potdukhe · Portfolio

Personal portfolio built with React, TypeScript, Vite and Framer Motion.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

## Edit content

All text, projects, experience and skills live in `src/data/profile.ts`.

- Add a repo link: set `repo: "https://github.com/pratikpotdukhe30/<repo>"` on a project.
- Add a live demo: set `demo: "https://..."`.
- Add a CV: put `Pratik_Potdukhe_CV.pdf` in `public/` and set `cv: "/Pratik_Potdukhe_CV.pdf"`.
- Screenshots: put images in `public/projects/<id>/` (wiring them into the case-study page is the next step).

## Deploy to Vercel (free)

1. Create a GitHub repo named `pratikpotdukhe30.github.io` or `portfolio` and push this folder.
2. Go to vercel.com, sign in with GitHub, click **Add New → Project**, select the repo.
3. Framework preset: **Vite**. Build command `npm run build`, output `dist`. Click **Deploy**.
4. Your site is live at `https://<project-name>.vercel.app`. Name the Vercel project `pratikpotdukhe30` to get `pratikpotdukhe30.vercel.app`.

Every push to `main` redeploys automatically.

## Custom domain (optional)

Buy `pratikpotdukhe30.dev` or `.com` (Cloudflare, Namecheap, Porkbun), then in Vercel open
**Project → Settings → Domains**, add the domain and copy the DNS records it shows to your registrar.

## Routing

Pages use hash routes (`/#/projects/potato`), so the site works on any static host without server config.
