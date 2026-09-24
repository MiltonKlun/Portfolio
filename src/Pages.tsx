import { Art } from "./Gallery";
import { Credentials } from "./Credentials";
import { HoverSurface, SocialIcon, SocialLinks } from "./SubtleDetails";
import {
  email,
  experience,
  github,
  linkedin,
  projects,
  type Project,
} from "./content";

const cvUrl = "/Milton_Klun_CV.pdf?v=52b1f75ec4de";

export function PageFooter() {
  return (
    <footer className="page-footer">
      <a href="/" className="wordmark">
        MILTON KLUN
      </a>
      <div>
        <SocialLinks />
      </div>
      <p className="footer-quote">
        Quality is not an act, it is a habit
        <em>-Aristotle</em>
      </p>
    </footer>
  );
}

function Intro({
  label,
  title,
  text,
}: {
  label: string;
  title: string;
  text: string;
}) {
  return (
    <div className="page-intro">
      <p className="eyebrow">{label}</p>
      <h1 tabIndex={-1}>{title}</h1>
      <p>{text}</p>
    </div>
  );
}

export function Work() {
  return (
    <main id="main-content" className="editorial-page" tabIndex={-1}>
      <Intro
        label="Projects · 01—06"
        title="What I’m building."
        text="Personal projects and client work in AI evaluation, test automation, and business software. Each case study covers the problem, my approach, and the results so far."
      />
      <div className="work-grid">
        {projects.map((p, i) => (
          <a className="work-item" href={`/work/${p.slug}`} key={p.slug}>
            <HoverSurface className="work-image">
              <Art name={p.image} eager={i < 2} />
              <span className="work-number">0{i + 1}</span>
              <span className="work-open" aria-hidden="true">
                ↗
              </span>
            </HoverSurface>
            <div className="work-caption">
              <h2>{p.title}</h2>
              <span>{p.category}</span>
            </div>
            <p>{p.intro}</p>
          </a>
        ))}
      </div>
      <PageFooter />
    </main>
  );
}

export function CaseStudy({ project: p }: { project: Project }) {
  const next = projects[(projects.indexOf(p) + 1) % projects.length];
  return (
    <main id="main-content" className="case-page" tabIndex={-1}>
      <aside className="case-sidebar">
        <a className="eyebrow breadcrumb" href="/work">
          Projects <span>· {p.category}</span>
        </a>
        <div className="case-name">
          <h1 tabIndex={-1}>
            <span>·</span> {p.title}
          </h1>
          <p>{p.category}</p>
        </div>
        <dl>
          <dt>Focus</dt>
          <dd>Quality engineering</dd>
          <dt>Context</dt>
          <dd>{p.status}</dd>
          <dt>Technology</dt>
          <dd>{p.technologies.join(" · ")}</dd>
          <dt>Source</dt>
          <dd>
            <a href={p.sources[0].url}>View on GitHub ↗</a>
          </dd>
        </dl>
      </aside>
      <article className="case-content">
        <div className="case-cover">
          <Art name={p.image} eager />
          <p>{p.intro}</p>
        </div>
        <section className="case-section">
          <p className="eyebrow">01 · Context</p>
          <h2>{p.intro}</h2>
          <div className="case-columns">
            <div>
              <h3>The problem</h3>
              <p>{p.problem}</p>
            </div>
            <div>
              <h3>My role</h3>
              <p>{p.role}</p>
            </div>
          </div>
        </section>
        <section className="case-section architecture-section">
          <p className="eyebrow">02 · Engineering decisions</p>
          <h2>How it works.</h2>
          <ol className="decisions">
            {p.decisions.map((d, i) => (
              <li key={d}>
                <span>0{i + 1}</span>
                {d}
              </li>
            ))}
          </ol>
          <figure className="architecture">
            <figcaption className="eyebrow">Conceptual architecture</figcaption>
            <ol>
              {p.flow.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </figure>
        </section>
        <section className="case-section">
          <p className="eyebrow">03 · Quality strategy</p>
          <h2>How I tested it.</h2>
          <p>{p.quality}</p>
          <div className="evidence-links">
            {p.sources.map((s) => (
              <a href={s.url} key={s.url}>
                {s.label}
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </section>
        <section className="case-section outcome-section">
          <p className="eyebrow">04 · Result & reflection</p>
          <h2>Results so far.</h2>
          <p>{p.outcome}</p>
          <div className="scope-note">
            <h3>Scope & limitations</h3>
            <p>{p.limitation}</p>
          </div>
          <h3>What I learned</h3>
          <p>{p.lesson}</p>
        </section>
        <a className="next-project" href={`/work/${next.slug}`}>
          <Art name={next.image} />
          <div>
            <span className="eyebrow">Next project</span>
            <h2>
              {next.title} <span aria-hidden="true">↗</span>
            </h2>
          </div>
        </a>
        <PageFooter />
      </article>
    </main>
  );
}

export function About() {
  return (
    <main id="main-content" className="editorial-page" tabIndex={-1}>
      <Intro
        label="About · Milton Klun"
        title={"Quality has always\nbeen part of my work."}
        text="I’m an SDET and QA Automation Engineer with professional experience in LLM evaluation. My work has taken me from financial and e-commerce automation to testing AI-generated answers."
      />
      <div className="about-layout">
        <div className="about-art portrait-frame">
          <img
            className="about-portrait"
            src="/images/milton-klun.webp"
            alt="Milton Klun"
            width="1080"
            height="1130"
            decoding="async"
          />
        </div>
        <div className="about-copy">
          <p className="eyebrow">How I think about quality</p>
          <h2>You notice when it’s missing.</h2>
          <p>
            When things work well, quality often goes unnoticed. When they
            don’t, the impact can be hard to ignore. That’s what draws me to
            this work: understanding where things can go wrong and building
            checks that help catch problems early.
          </p>
          <p>
            At Revelo, I evaluated more than 500 LLM outputs and ran acceptance
            checks in Docker. I’m also building tools to make AI evaluation
            easier. An agent can answer the same question differently each
            time, which makes deciding whether it’s working well an interesting
            testing problem.
          </p>
          <p>
            My pharmacy studies gave me this quality mindset before I moved
            into software. The program emphasized standards, traceability, test
            planning, risk management, and careful documentation. I still draw
            on that training when deciding what to test and how to record the
            results.
          </p>
          <a className="text-link dark-link" href="/experience">
            Professional experience <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <div className="about-facts">
        <div>
          <span className="eyebrow">Based in</span>
          <p>Bahía Blanca, Argentina</p>
        </div>
        <div>
          <span className="eyebrow">Working across</span>
          <p>Remote teams · UTC−3</p>
        </div>
        <div>
          <span className="eyebrow">Languages</span>
          <p>Spanish · English C1</p>
        </div>
      </div>
      <PageFooter />
    </main>
  );
}

export function Experience() {
  return (
    <main id="main-content" className="editorial-page" tabIndex={-1}>
      <Intro
        label="Experience · 2023—2026"
        title="Quality in practice."
        text="I’ve worked on AI evaluation, e-commerce workflows, and financial automation. These roles combine building software with checking that it behaves as intended."
      />
      <div className="experience-list">
        {experience.map((job, i) => (
          <section className="experience-row" key={job.company}>
            <div>
              <span className="eyebrow">
                0{i + 1} · {job.dates}
              </span>
              <h2>{job.company}</h2>
              <p>{job.type}</p>
            </div>
            <div>
              <h3>{job.role}</h3>
              <p>{job.summary}</p>
              <p className="eyebrow job-tags">{job.tags}</p>
            </div>
          </section>
        ))}
      </div>
      <p className="editorial-note">
        You can also explore my independent projects and the code I’ve
        published in Projects.
      </p>
      <div className="inline-actions">
        <a className="text-link dark-link" href="/work">
          Projects ↗
        </a>
      </div>
      <PageFooter />
    </main>
  );
}

export function Skills() {
  const groups = [
    {
      title: "AI quality",
      context: "Professional work · Personal projects",
      description:
        "I’ve evaluated LLM outputs against acceptance criteria and tested edge cases across model versions. My personal projects explore RAG checks, judge calibration, traces, and agent reliability.",
      tools: "Python · Docker · LangGraph · DeepEval",
      href: "/work/evalharness",
      label: "See EvalHarness",
    },
    {
      title: "Test automation",
      context: "Professional work",
      description:
        "I build API, integration, and end-to-end checks, using Page Object Models where they help keep UI tests maintainable. I prioritize regression checks by risk and record failures so they can be reproduced.",
      tools: "Playwright · Pytest · Selenium · Postman · Allure",
      href: "/work/pg-original",
      label: "See PG Original",
    },
    {
      title: "Engineering & data",
      context: "Professional work · Personal projects",
      description:
        "I use Python to automate business workflows, connect APIs, and validate financial data. My personal projects also include TypeScript tools and SQLite storage for results and test records.",
      tools: "Python · JavaScript · TypeScript · SQL · SQLite",
      href: "/work/cartographer",
      label: "See Cartographer",
    },
    {
      title: "Delivery & reproducibility",
      context: "Professional work · Personal projects",
      description:
        "I use Docker, versioned test data, and CI workflows to make checks easier to repeat. My project work also includes AWS Lambda for running automation.",
      tools: "Git · GitHub Actions · Docker · AWS Lambda",
      href: "/work/evalstand",
      label: "See Evalstand",
    },
  ];
  return (
    <main id="main-content" className="editorial-page" tabIndex={-1}>
      <Intro
        label="Skills · Tools & learning"
        title="What I work with."
        text="These are the tools and approaches I use in professional work and personal projects. The links below show where I’ve put them to use."
      />
      <div className="skills">
        {groups.map((g, i) => (
          <section key={g.title}>
            <span className="eyebrow">
              0{i + 1} · {g.context}
            </span>
            <h2>{g.title}</h2>
            <p>{g.description}</p>
            <p className="tool-line">{g.tools}</p>
            <a className="text-link dark-link" href={g.href}>
              {g.label} ↗
            </a>
          </section>
        ))}
      </div>
      <Credentials />
      <PageFooter />
    </main>
  );
}

export function Contact() {
  return (
    <main id="main-content" className="contact-page" tabIndex={-1}>
      <Art name="horizon" eager />
      <div className="contact-shade" />
      <div className="contact-content">
        <p className="eyebrow">Contact · Get in touch</p>
        <h1 tabIndex={-1}>
          Tell me about
          <br />
          your team.
        </h1>
        <p>
          Looking for help with AI quality or test automation?
          <br />
          I’d like to hear what you’re working on.
        </p>
        <a className="contact-email" href={`mailto:${email}`}>
          {email}
          <span aria-hidden="true">↗</span>
        </a>
        <div className="contact-links">
          <a href={github}>
            <SocialIcon name="github" />
            GitHub ↗
          </a>
          <a href={linkedin}>
            <SocialIcon name="linkedin" />
            LinkedIn ↗
          </a>
          <a href={cvUrl} download="Milton_Klun_CV.pdf">
            Download CV ↓
          </a>
        </div>
        <p className="eyebrow contact-location">
          Bahía Blanca, Argentina · UTC−3
          <br />
          Spanish native · English C1
        </p>
      </div>
    </main>
  );
}

export function CV() {
  return (
    <main id="main-content" className="editorial-page cv-page" tabIndex={-1}>
      <Intro
        label="Curriculum vitae"
        title="Milton Eric Klun"
        text="SDET · QA Automation Engineer · AI Quality & LLM Evaluation"
      />
      <div className="inline-actions">
        <a
          className="text-link dark-link"
          href={cvUrl}
          target="_blank"
          rel="noreferrer"
        >
          Open PDF ↗
        </a>
        <a className="text-link dark-link" href={cvUrl} download="Milton_Klun_CV.pdf">
          Download CV ↓
        </a>
      </div>
      <object
        data={cvUrl}
        type="application/pdf"
        className="cv-document"
        aria-label="Milton Klun’s CV"
      >
        <p>
          Your browser can open the{" "}
          <a href={cvUrl}>CV PDF here</a>.
        </p>
      </object>
      <PageFooter />
    </main>
  );
}

export function NotFound() {
  return (
    <main id="main-content" className="editorial-page" tabIndex={-1}>
      <Intro
        label="404 · Not found"
        title="An unexpected path."
        text="This page doesn’t exist. The work is still here."
      />
      <a className="text-link dark-link" href="/">
        Return to the portfolio ↗
      </a>
      <PageFooter />
    </main>
  );
}
