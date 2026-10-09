import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Command, Copy, Github, Linkedin, Mail, Moon, Sun } from "lucide-react";
import { experience, profile, projects, skills, type Category, type Project } from "./data/profile";
import NeuralField from "./components/NeuralField";
import Terminal from "./components/Terminal";
import CommandMenu from "./components/CommandMenu";
import { go, scrollToSection, useRoute } from "./router";

const fade = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try { return (localStorage.getItem("theme") as "dark" | "light") || "dark"; } catch { return "dark"; }
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch { /* storage unavailable */ }
  }, [theme]);
  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  return { theme, toggle };
}

function Status({ s }: { s: Project["status"] }) {
  return <span className={`status ${s === "In progress" ? "wip" : "live"}`}>{s}</span>;
}

function Pipeline({ steps }: { steps: string[] }) {
  return (
    <div className="pipeline" aria-label="Pipeline">
      {steps.map((s, i) => (
        <span key={s} style={{ display: "contents" }}>
          {i > 0 && <span className="edge" aria-hidden="true" />}
          <span className="node">{s}</span>
        </span>
      ))}
    </div>
  );
}

function Nav({ theme, toggle, openMenu }: { theme: string; toggle: () => void; openMenu: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const link = (id: string, label: string, cls = "") => (
    <a href={`#${id}`} className={cls} onClick={(e) => { e.preventDefault(); scrollToSection(id); }}>{label}</a>
  );
  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="container nav-inner">
        <a href="#" className="brand" onClick={(e) => { e.preventDefault(); scrollToSection("top"); }}>
          <span className="brand-mark">PP</span><span>pratik.dev</span>
        </a>
        <div className="nav-links">
          {link("projects", "Projects", "hide-sm")}
          {link("experience", "Experience", "hide-sm")}
          {link("contact", "Contact", "hide-sm")}
          <button className="kbd-btn" onClick={openMenu} aria-label="Open command menu">
            <Command size={14} /><span>K</span>
          </button>
          <button className="icon-btn" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <header className="hero" id="top">
      <NeuralField />
      <div className="container hero-grid">
        <motion.div className="hero-inner" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="status-pill"><span className="pulse" />{profile.availability}</span>
          <h1>Pratik<br /><span className="surname">Potdukhe</span></h1>
          <p className="role">{profile.role}</p>
          <p className="hero-summary"><strong>{profile.tagline}</strong> {profile.summary}</p>
          <div className="cta-row">
            <button className="btn primary" onClick={() => scrollToSection("projects")}>View projects <ArrowRight size={17} /></button>
            <a className="btn" href={profile.github} target="_blank" rel="noreferrer"><Github size={17} /> GitHub</a>
            <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn</a>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }} style={{ minWidth: 0 }}>
          <Terminal />
        </motion.div>
      </div>
    </header>
  );
}

function Projects() {
  const cats: ("All" | Category)[] = ["All", "AI / ML", "Full-stack", "Backend"];
  const [f, setF] = useState<"All" | Category>("All");
  const list = projects.filter((p) => f === "All" || p.categories.includes(f));
  return (
    <section className="section" id="projects">
      <div className="container">
        <div className="proj-bar">
          <motion.div className="section-head" {...fade}>
            <span className="label"><span className="index">01</span> / Selected work</span>
            <h2>Projects</h2>
            <p>From enterprise Java services to deployed deep learning. Open any project for the full case study.</p>
          </motion.div>
          <div className="filters" role="group" aria-label="Filter projects">
            {cats.map((c) => (
              <button key={c} id={`filter-${c.replace(/\W+/g, "")}`} aria-pressed={f === c} onClick={() => setF(c)}>
                {f === c && <motion.span layoutId="pill" className="pill-bg" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                {c}
              </button>
            ))}
          </div>
        </div>
        <motion.div className="proj-grid" layout>
          {list.map((p) => (
            <motion.button layout key={p.id} className={`card ${p.featured && f === "All" ? "featured" : ""}`}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
              onClick={() => go(`/projects/${p.id}`)}
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
              }}>
              <div className="card-top"><span className="label">{p.context}</span><Status s={p.status} /></div>
              <h3>{p.title}</h3>
              <p>{p.summary}</p>
              {p.featured && f === "All" && p.pipeline && (
                <div className="card-side"><span className="label">Pipeline</span><Pipeline steps={p.pipeline} /></div>
              )}
              <div className="chips">{p.stack.map((s) => <span key={s} className="chip">{s}</span>)}</div>
              <span className="card-foot">Read case study <ArrowRight size={16} /></span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="section alt" id="experience">
      <div className="container two-col">
        <motion.div className="section-head" {...fade}>
          <span className="label"><span className="index">02</span> / Experience</span>
          <h2>Industry first, then research.</h2>
          <p>Enterprise backend engineering at Capgemini, now a master's at Politecnico di Milano focused on machine learning and LLM applications.</p>
        </motion.div>
        <div className="timeline">
          {experience.map((e) => (
            <motion.div key={e.org} className="tl-item" {...fade}>
              <div className="tl-head"><h3>{e.org}</h3><span className="label">{e.period}</span></div>
              <p className="tl-title">{e.title}</p>
              <ul>{e.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section className="section" id="skills">
      <div className="container">
        <motion.div className="section-head" {...fade}>
          <span className="label"><span className="index">03</span> / Toolkit</span>
          <h2>Skills</h2>
        </motion.div>
        <div className="skills-grid">
          {skills.map((s) => (
            <motion.div key={s.group} className="skill-col" {...fade}>
              <h3>{s.group}</h3>
              <div className="chips">{s.items.map((i) => <span key={i} className="chip">{i}</span>)}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CopyEmail() {
  const [label, setLabel] = useState("Copy");
  return (
    <button className="btn" onClick={() => {
      const done = () => { setLabel("Copied"); setTimeout(() => setLabel("Copy"), 1800); };
      try {
        navigator.clipboard.writeText(profile.email).then(done, () => setLabel("Select and copy"));
      } catch { setLabel("Select and copy"); }
    }}><Copy size={16} /> {label}</button>
  );
}

function Contact() {
  return (
    <section className="section" id="contact">
      <div className="container">
        <motion.div className="contact" {...fade}>
          <span className="label"><span className="index">04</span> / Contact</span>
          <h2>Let's build something.</h2>
          <p>I'm looking for software engineering and AI engineering internships, and thesis collaborations in applied AI. Email is the fastest way to reach me.</p>
          <div className="mail-row">
            <code>{profile.email}</code>
            <CopyEmail />
            <a className="btn primary" href={`mailto:${profile.email}`}><Mail size={16} /> Email me</a>
          </div>
          <div className="cta-row">
            <a className="btn" href={profile.github} target="_blank" rel="noreferrer"><Github size={17} /> GitHub <ArrowUpRight size={15} /></a>
            <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn <ArrowUpRight size={15} /></a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ProjectPage({ p }: { p: Project }) {
  const idx = projects.findIndex((x) => x.id === p.id);
  const next = projects[(idx + 1) % projects.length];
  useEffect(() => { window.scrollTo(0, 0); document.title = `${p.title} · Pratik Potdukhe`; }, [p]);
  return (
    <main className="case">
      <div className="container case-inner">
        <button className="back" onClick={() => scrollToSection("projects")}><ArrowLeft size={16} /> All projects</button>
        <motion.header className="case-head" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="card-top"><span className="label">{p.context}</span><Status s={p.status} /></div>
          <h1>{p.title}</h1>
          <p className="case-lede">{p.summary}</p>
          <div className="cta-row">
            {p.repo ? <a className="btn primary" href={p.repo} target="_blank" rel="noreferrer"><Github size={17} /> View code</a>
              : <span className="btn ghost" aria-disabled="true"><Github size={17} /> Code coming soon</span>}
            {p.demo && <a className="btn" href={p.demo} target="_blank" rel="noreferrer">Live demo <ArrowUpRight size={15} /></a>}
          </div>
        </motion.header>

        <div className="case-grid">
          <div className="case-main">
            <section>
              <h2 className="label">The problem</h2>
              <p className="case-text">{p.problem}</p>
            </section>
            {p.pipeline && (
              <section>
                <h2 className="label">Architecture</h2>
                <div className="arch"><Pipeline steps={p.pipeline} /></div>
              </section>
            )}
            <section>
              <h2 className="label">What I built</h2>
              <ol className="steps">{p.approach.map((a) => <li key={a}>{a}</li>)}</ol>
            </section>
            <section>
              <h2 className="label">Screenshots</h2>
              <div className="shots">
                <div className="shot">Screenshot coming soon</div>
                <div className="shot">Screenshot coming soon</div>
              </div>
            </section>
          </div>
          <aside className="case-side">
            <div><span className="label">Stack</span><div className="chips">{p.stack.map((s) => <span key={s} className="chip">{s}</span>)}</div></div>
            <div><span className="label">Area</span><p>{p.categories.join(" · ")}</p></div>
            <div><span className="label">Status</span><p>{p.status}</p></div>
          </aside>
        </div>

        <button className="next" onClick={() => go(`/projects/${next.id}`)}>
          <span className="label">Next project</span>
          <span className="next-title">{next.title} <ArrowRight size={22} /></span>
        </button>
      </div>
    </main>
  );
}

export default function App() {
  const { theme, toggle } = useTheme();
  const [menu, setMenu] = useState(false);
  const route = useRoute();
  const m = route.match(/^\/projects\/([\w-]+)/);
  const project = m ? projects.find((p) => p.id === m[1]) : undefined;

  useEffect(() => { if (!project) document.title = "Pratik Potdukhe · Software & AI Engineer"; }, [project]);

  return (
    <>
      <Nav theme={theme} toggle={toggle} openMenu={() => setMenu(true)} />
      {project ? <ProjectPage p={project} /> : (
        <main>
          <Hero />
          <Projects />
          <Experience />
          <Skills />
          <Contact />
        </main>
      )}
      <footer>
        <div className="container foot-inner">
          <span>© {new Date().getFullYear()} {profile.fullName}</span>
          <span>Press <kbd>Ctrl</kbd> + <kbd>K</kbd> to navigate</span>
        </div>
      </footer>
      <CommandMenu open={menu} setOpen={setMenu} toggleTheme={toggle} />
    </>
  );
}
