import { useEffect } from "react";
import { experience, now, profile, projects, skills, type Project } from "./data/profile";
import { go, useRoute } from "./router";

function Links() {
  const items = [
    { href: `mailto:${profile.email}`, label: "Email" },
    { href: profile.github, label: "GitHub" },
    { href: profile.linkedin, label: "LinkedIn" },
    { href: profile.cv, label: "CV" },
  ].filter((i) => i.href);
  return (
    <p className="links">
      {items.map((i) => (
        <a key={i.label} href={i.href} target={i.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
          {i.label}
        </a>
      ))}
    </p>
  );
}

function Home() {
  useEffect(() => { document.title = profile.name; }, []);
  return (
    <main>
      <header className="intro">
        {profile.photo && <img className="photo" src={profile.photo} alt={profile.name} width={88} height={88} />}
        <h1>{profile.name}</h1>
        <Links />
      </header>

      <section className="prose">
        <p>
          I'm a software engineer based in Milan. At Capgemini I worked as a Software Engineer and later a Senior
          Analyst, building Java and Spring Boot services for the Stellantis AfterSales platform.
        </p>
        <p>
          I'm now doing a master's in Computer Science and Engineering at Politecnico di Milano. Most of my recent
          work is in machine learning, and I'm moving toward AI engineering, which for me means building
          applications on top of language models.
        </p>
        <p>I'm looking for an internship in software or AI engineering.</p>
      </section>

      <section>
        <h2>Projects</h2>
        <ul className="projects">
          {projects.map((p) => (
            <li key={p.id}>
              <a href={`#/${p.id}`} onClick={(e) => { e.preventDefault(); go(`/${p.id}`); }}>{p.title}</a>
              <span className="where">{p.where}</span>
              <p>{p.line}</p>
            </li>
          ))}
        </ul>
        <p className="now"><span>Now</span> {now}</p>
      </section>

      <section>
        <h2>Experience</h2>
        <dl className="rows">
          {experience.map((e) => (
            <div key={e.where}>
              <dt>{e.when}</dt>
              <dd><strong>{e.where}</strong>, {e.what}<br /><span className="muted">{e.note}</span></dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2>Tools I use</h2>
        <dl className="rows">
          {skills.map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Email is the best way to reach me: <a href={`mailto:${profile.email}`}>{profile.email}</a>.
        </p>
      </section>
    </main>
  );
}

function Writeup({ p }: { p: Project }) {
  const i = projects.findIndex((x) => x.id === p.id);
  const next = projects[(i + 1) % projects.length];
  useEffect(() => { document.title = `${p.title} · ${profile.name}`; window.scrollTo(0, 0); }, [p]);
  return (
    <main>
      <p className="back"><a href="#" onClick={(e) => { e.preventDefault(); go("/"); }}>← {profile.name}</a></p>
      <article>
        <h1>{p.title}</h1>
        <p className="meta">{p.where}</p>
        <div className="prose">
          {p.body.map((para) => <p key={para.slice(0, 24)}>{para}</p>)}
        </div>
        <dl className="rows tight">
          <div><dt>Built with</dt><dd>{p.stack}</dd></div>
          {p.repo && <div><dt>Code</dt><dd><a href={p.repo} target="_blank" rel="noreferrer">{p.repo.replace("https://", "")}</a></dd></div>}
          {p.demo && <div><dt>Demo</dt><dd><a href={p.demo} target="_blank" rel="noreferrer">{p.demo.replace("https://", "")}</a></dd></div>}
        </dl>
      </article>
      <p className="next">
        Next: <a href={`#/${next.id}`} onClick={(e) => { e.preventDefault(); go(`/${next.id}`); }}>{next.title}</a>
      </p>
    </main>
  );
}

export default function App() {
  const route = useRoute();
  const project = projects.find((p) => route === `/${p.id}`);
  return (
    <div className="page">
      {project ? <Writeup p={project} /> : <Home />}
      <footer>Last updated {profile.updated}</footer>
    </div>
  );
}
