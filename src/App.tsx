import { useEffect, type MouseEvent, type ReactNode } from "react";
import { profile, projects, skills, type Project } from "./data/profile";
import { go, useRoute } from "./router";

function L({ to, children }: { to: string; children: ReactNode }) {
  const onClick = (e: MouseEvent) => { e.preventDefault(); go(to); };
  return <a href={`#${to}`} onClick={onClick}>{children}</a>;
}

function Header({ route }: { route: string }) {
  return (
    <header className="site-header">
      <div className="wrap head-row">
        <L to="/">{profile.name}</L>
        <nav>
          <L to="/projects"><span className={route.startsWith("/projects") || projects.some((p) => route === `/${p.id}`) ? "here" : ""}>Projects</span></L>
          {profile.cv && <a href={profile.cv} target="_blank" rel="noreferrer">CV</a>}
          <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </div>
    </header>
  );
}

const p = (id: string) => `/${id}`;

function Home() {
  useEffect(() => { document.title = `${profile.name} | Software engineer`; }, []);
  return (
    <main className="wrap">
      {profile.photo && <img className="photo" src={profile.photo} alt="Pratik Potdukhe" />}

      <p>
        I'm a software engineer in Milan. I'm currently doing my master's in Computer Science and Engineering at{" "}
        <a href="https://www.polimi.it/en" target="_blank" rel="noreferrer">Politecnico di Milano</a>, where most of
        my work is in machine learning. I'm moving toward AI engineering, which for me means building applications
        on top of language models.
      </p>
      <p>
        Before my master's I worked at Capgemini, first as a Software Engineer and then as a Senior Analyst. I built
        Java and Spring Boot services for the <L to={p("stellantis-aftersales")}>Stellantis AfterSales platform</L>,
        working with Oracle databases and Jenkins pipelines.
      </p>
      <p>
        At Polimi I built a <L to={p("potato-disease")}>potato disease classifier</L> that you can use from a web app
        or an Android app, and worked with my team on <L to={p("federated-sleep")}>predicting sleep quality from
        Garmin data with federated learning</L>. I also built a <L to={p("conversation-inbox")}>conversation
        inbox</L> in TypeScript and React as a take-home assignment for Arcus Corp.
      </p>
      <p>
        Right now I'm learning retrieval-augmented generation by building a chatbot that answers questions about
        YouTube videos from their transcripts.
      </p>
      <p>
        I'm looking for an internship in software or AI engineering, ideally one I can connect to my thesis. If you
        think I'd be a good fit, I'd be glad to hear from you.
      </p>

      <ul className="dash">
        <li>Email: <a href={`mailto:${profile.email}`}>{profile.email}</a></li>
        <li>LinkedIn: <a href={profile.linkedin} target="_blank" rel="noreferrer">pratik-potdukhe</a></li>
        <li>GitHub: <a href={profile.github} target="_blank" rel="noreferrer">pratikpotdukhe30</a></li>
      </ul>
    </main>
  );
}

function ProjectList() {
  useEffect(() => { document.title = `Projects | ${profile.name}`; window.scrollTo(0, 0); }, []);
  return (
    <main className="wrap">
      <h1>Projects</h1>
      <ul className="plist">
        {projects.map((x) => (
          <li key={x.id}>
            <L to={p(x.id)}>{x.title}</L>
            <p>{x.line}</p>
            <p className="small">{x.where}</p>
          </li>
        ))}
      </ul>
      <h2>Things I work with</h2>
      <ul className="dash">
        {skills.map(([k, v]) => <li key={k}>{k}: {v}</li>)}
      </ul>
    </main>
  );
}

function Writeup({ x }: { x: Project }) {
  const i = projects.findIndex((y) => y.id === x.id);
  const next = projects[(i + 1) % projects.length];
  useEffect(() => { document.title = `${x.title} | ${profile.name}`; window.scrollTo(0, 0); }, [x]);
  return (
    <main className="wrap">
      <article>
        <h1>{x.title}</h1>
        <p className="small">{x.where}</p>
        {x.body.map((para) => <p key={para.slice(0, 32)}>{para}</p>)}
        <ul className="dash">
          <li>Built with: {x.stack}</li>
          {x.repo && <li>Code: <a href={x.repo} target="_blank" rel="noreferrer">{x.repo.replace("https://", "")}</a></li>}
          {x.demo && <li>Demo: <a href={x.demo} target="_blank" rel="noreferrer">{x.demo.replace("https://", "")}</a></li>}
        </ul>
      </article>
      <p className="next">Next project: <L to={p(next.id)}>{next.title}</L></p>
    </main>
  );
}

export default function App() {
  const route = useRoute();
  const project = projects.find((x) => route === p(x.id));
  return (
    <>
      <Header route={route} />
      {project ? <Writeup x={project} /> : route === "/projects" ? <ProjectList /> : <Home />}
      <footer className="wrap">© {new Date().getFullYear()} {profile.fullName}</footer>
    </>
  );
}
