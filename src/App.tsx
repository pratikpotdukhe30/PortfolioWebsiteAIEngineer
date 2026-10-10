import { useEffect, useRef, useState, type FormEvent } from "react";
import { experience, profile, projects, skills, type Project } from "./data/profile";
import { localAnswer } from "./data/knowledge";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What did Pratik build at Capgemini?",
  "Tell me about the potato disease classifier",
  "What AI skills does he have?",
  "What kind of role is he looking for?",
];

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi! I'm an AI assistant that knows Pratik's projects, experience and skills. Ask me anything, or pick a question below.",
};

type Theme = "light" | "dark";

function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch { /* storage unavailable */ }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch { /* storage unavailable */ }
  }, [theme]);
  return { theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) };
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const toLight = theme === "dark";
  return (
    <button type="button" className="theme-toggle" onClick={toggle}
      aria-label={toLight ? "Switch to light mode" : "Switch to dark mode"} title={toLight ? "Light mode" : "Dark mode"}>
      {toLight ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />
        </svg>
      )}
    </button>
  );
}

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2);
}

function Chat() {
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, busy]);

  async function ask(q: string) {
    const question = q.trim();
    if (!question || busy) return;
    const next = [...msgs, { role: "user" as const, content: question }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    let answer = "";
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.filter((m) => m !== GREETING) }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.answer) throw new Error(data.error || `HTTP ${r.status}`);
      answer = data.answer;
    } catch (err) {
      const local = ["localhost", "127.0.0.1", ""].includes(window.location.hostname);
      if (local) {
        answer = `[Offline answer, API error: ${(err as Error).message}]\n\n${localAnswer(question)}`;
      } else {
        console.error("Chat API error:", err);
        answer = `Sorry, the assistant isn't available right now. You can email Pratik at ${profile.email}.`;
      }
    }
    setMsgs((m) => [...m, { role: "assistant", content: answer }]);
    setBusy(false);
  }

  const onSubmit = (e: FormEvent) => { e.preventDefault(); ask(input); };
  const fresh = msgs.length === 1;

  return (
    <section className="chat" aria-label="Ask about Pratik">
      <div className="chat-head">
        <span className="dot" aria-hidden="true" />
        <span>Ask me about Pratik</span>
      </div>
      <div className="chat-list" ref={listRef} aria-live="polite">
        {msgs.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>{m.content}</div>
        ))}
        {busy && <div className="bubble assistant typing" aria-label="Thinking"><i /><i /><i /></div>}
      </div>
      {fresh && (
        <div className="suggest">
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" onClick={() => ask(s)}>{s}</button>
          ))}
        </div>
      )}
      <form className="chat-input" onSubmit={onSubmit}>
        <label htmlFor="ask" className="sr-only">Your question</label>
        <input id="ask" value={input} onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about projects, experience, skills…" maxLength={500} autoComplete="off" />
        <button type="submit" disabled={busy || !input.trim()} aria-label="Send">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
      </form>
      <p className="chat-note">Answers are generated by AI from Pratik's profile and can contain mistakes.</p>
    </section>
  );
}

function ProjectCard({ p }: { p: Project }) {
  const [open, setOpen] = useState(false);
  return (
    <article className={`proj ${open ? "open" : ""}`}>
      <p className="eyebrow">{p.where}</p>
      <h3>{p.title}</h3>
      <p>{p.line}</p>
      <p className="stack">{p.stack}</p>
      {open && <div className="more">{p.body.map((b) => <p key={b.slice(0, 30)}>{b}</p>)}</div>}
      <div className="proj-actions">
        <button type="button" className="text-btn" onClick={() => setOpen(!open)} aria-expanded={open}>
          {open ? "Show less" : "Read more"}
        </button>
        {p.repo && <a href={p.repo} target="_blank" rel="noreferrer">Code ↗</a>}
        {p.demo && <a href={p.demo} target="_blank" rel="noreferrer">Demo ↗</a>}
      </div>
    </article>
  );
}

export default function App() {
  return (
    <div className="page">
      <ThemeToggle />
      <header className="hero">
        {profile.photo
          ? <img className="avatar" src={profile.photo} alt={profile.name} />
          : <div className="avatar" aria-hidden="true">{initials(profile.name)}</div>}
        <h1>{profile.name}</h1>
        <p className="role">{profile.role} · {profile.location}</p>
        <p className="status"><span className="dot" aria-hidden="true" />Open to AI and software engineering internships</p>
        <nav className="links">
          <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={`mailto:${profile.email}`}>Email</a>
          {profile.cv && <a href={profile.cv} target="_blank" rel="noreferrer">CV</a>}
        </nav>
      </header>

      <Chat />

      <section className="block">
        <h2>Projects</h2>
        <div className="grid">{projects.map((p) => <ProjectCard key={p.id} p={p} />)}</div>
      </section>

      <section className="block">
        <h2>Experience</h2>
        <ol className="timeline">
          {experience.map((e) => (
            <li key={e.where}>
              <span className="when">{e.when}</span>
              <div>
                <strong>{e.where}</strong>
                <span className="what">{e.what}</span>
                <p>{e.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="block">
        <h2>Skills</h2>
        <dl className="skills">
          {skills.map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd>{v.split(", ").map((s) => <span key={s} className="tag">{s}</span>)}</dd></div>
          ))}
        </dl>
      </section>

      <footer>
        <p>{profile.email}</p>
        <p>© {new Date().getFullYear()} {profile.fullName}</p>
      </footer>
    </div>
  );
}