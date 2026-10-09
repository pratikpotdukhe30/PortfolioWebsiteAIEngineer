import { useEffect, useRef, useState, type ReactNode } from "react";
import { profile, projects, skills } from "../data/profile";
import { go } from "../router";

type Line = { kind: "cmd" | "out"; body: ReactNode };

const ext = (href: string, label: string) => (
  <a href={href} target="_blank" rel="noreferrer" className="t-link">{label}</a>
);

function run(raw: string): ReactNode | "clear" {
  const [cmd, ...args] = raw.trim().split(/\s+/);
  switch ((cmd || "").toLowerCase()) {
    case "":
      return null;
    case "help":
      return (
        <div className="t-grid">
          {[
            ["whoami", "who I am"],
            ["projects", "list my projects"],
            ["open <id>", "open a project case study"],
            ["skills", "my toolkit"],
            ["contact", "how to reach me"],
            ["github / linkedin", "my profiles"],
            ["clear", "clear the terminal"],
          ].map(([c, d]) => (
            <div key={c} className="t-row"><span className="t-cmd">{c}</span><span className="t-dim">{d}</span></div>
          ))}
        </div>
      );
    case "whoami":
      return (
        <div>
          <div><span className="t-key">name</span> {profile.name}</div>
          <div><span className="t-key">role</span> {profile.role}</div>
          <div><span className="t-key">base</span> {profile.location}</div>
          <div><span className="t-key">now </span> M.Sc. CSE @ Politecnico di Milano</div>
          <div><span className="t-key">prev</span> Software Engineer → Senior Analyst @ Capgemini</div>
        </div>
      );
    case "projects":
    case "ls":
      return (
        <div className="t-grid">
          {projects.map((p) => (
            <div key={p.id} className="t-row">
              <button className="t-cmd t-btn" onClick={() => go(`/projects/${p.id}`)}>{p.id}</button>
              <span className="t-dim">{p.title}</span>
            </div>
          ))}
          <div className="t-dim">type <span className="t-cmd">open &lt;id&gt;</span> or click one</div>
        </div>
      );
    case "open":
    case "cd": {
      const p = projects.find((x) => x.id === (args[0] || "").toLowerCase());
      if (!p) return <span className="t-err">no such project: {args[0] || "(none)"}. Try <b>projects</b>.</span>;
      setTimeout(() => go(`/projects/${p.id}`), 350);
      return <span className="t-ok">opening {p.title}…</span>;
    }
    case "skills":
      return (
        <div>
          {skills.map((s) => (
            <div key={s.group}><span className="t-key">{s.group.toLowerCase()}</span> {s.items.join(", ")}</div>
          ))}
        </div>
      );
    case "contact":
    case "email":
      return <div><span className="t-key">email</span> {profile.email}</div>;
    case "github":
      return ext(profile.github, profile.github.replace("https://", ""));
    case "linkedin":
      return ext(profile.linkedin, profile.linkedin.replace("https://www.", ""));
    case "clear":
      return "clear";
    case "sudo":
      return <span className="t-ok">Permission granted. Next step: {profile.email}</span>;
    case "hire":
      return <span className="t-ok">Great choice. Email me at {profile.email}</span>;
    default:
      return <span className="t-err">command not found: {cmd}. Type <b>help</b>.</span>;
  }
}

const BOOT: Line[] = [
  { kind: "cmd", body: "whoami" },
  { kind: "out", body: run("whoami") as ReactNode },
  { kind: "out", body: <span className="t-dim">Type <b className="t-cmd">help</b> to explore, or try <b className="t-cmd">projects</b>.</span> },
];

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>(BOOT);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const submit = (cmd: string) => {
    const res = run(cmd);
    if (res === "clear") { setLines([]); }
    else setLines((l) => [...l, { kind: "cmd", body: cmd }, ...(res ? [{ kind: "out" as const, body: res }] : [])]);
    if (cmd.trim()) setHistory((h) => [cmd, ...h].slice(0, 30));
    setHIdx(-1);
    setValue("");
  };

  return (
    <div className="terminal" onClick={() => inputRef.current?.focus({ preventScroll: true })}>
      <div className="t-bar">
        <span className="t-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="t-title">pratik@polimi: ~</span>
        <span className="t-hint">interactive</span>
      </div>
      <div className="t-body" ref={bodyRef} aria-live="polite">
        {lines.map((l, i) =>
          l.kind === "cmd" ? (
            <div key={i} className="t-line"><span className="t-prompt">❯</span> {l.body}</div>
          ) : (
            <div key={i} className="t-out">{l.body}</div>
          )
        )}
        <form
          className="t-line t-input-row"
          onSubmit={(e) => { e.preventDefault(); submit(value); }}
        >
          <label htmlFor="term-input" className="sr-only">Terminal command</label>
          <span className="t-prompt">❯</span>
          <input
            id="term-input"
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" && history.length) {
                e.preventDefault();
                const n = Math.min(hIdx + 1, history.length - 1);
                setHIdx(n); setValue(history[n]);
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                const n = hIdx - 1;
                setHIdx(n); setValue(n >= 0 ? history[n] : "");
              }
            }}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="type help"
          />
        </form>
      </div>
    </div>
  );
}
