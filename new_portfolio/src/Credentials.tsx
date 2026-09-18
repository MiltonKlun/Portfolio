type Credential = {
  id: string;
  title: string;
  issuer: string;
  detail: string;
  file: string;
  verify?: string;
};

const groups: { title: string; items: Credential[] }[] = [
  {
    title: "AI & data",
    items: [
      {
        id: "google-ai-professional",
        title: "Google AI Professional Certificate",
        issuer: "Google",
        detail: "18 June 2026",
        file: "google-ai-professional.pdf",
        verify: "https://www.credly.com/badges/6a104ccd-e94a-484c-8b92-c57f76afb951",
      },
      {
        id: "google-data-analytics",
        title: "Google Advanced Data Analytics Professional Certificate",
        issuer: "Google · Coursera",
        detail: "Version 2 · 16 June 2026",
        file: "google-data-analytics.pdf",
        verify: "https://www.credly.com/go/0NSajYVZ",
      },
      {
        id: "google-ai-essentials",
        title: "Google AI Essentials",
        issuer: "Google Career Certificates",
        detail: "16 June 2026",
        file: "google-ai-essentials.pdf",
        verify: "https://www.credly.com/go/uWJyTdbf",
      },
    ],
  },
  {
    title: "Agent engineering",
    items: [
      {
        id: "reliable-agents",
        title: "Building Reliable Agents",
        issuer: "LangChain Academy",
        detail: "Foundation · 24 June 2026",
        file: "reliable-agents.png",
      },
      {
        id: "agent-observability",
        title: "Introduction to Agent Observability & Evaluations",
        issuer: "LangChain Academy",
        detail: "Foundation · 24 June 2026",
        file: "agent-observability.png",
      },
      {
        id: "langchain-python",
        title: "Introduction to LangChain · Python",
        issuer: "LangChain Academy",
        detail: "Foundation · 24 June 2026",
        file: "langchain-python.png",
      },
      {
        id: "langgraph-python",
        title: "Introduction to LangGraph · Python",
        issuer: "LangChain Academy",
        detail: "Foundation · 24 June 2026",
        file: "langgraph-python.png",
      },
      {
        id: "langgraph-essentials",
        title: "LangGraph Essentials · Python",
        issuer: "LangChain Academy",
        detail: "Quickstart · 1 June 2026",
        file: "langgraph-essentials.pdf",
      },
    ],
  },
  {
    title: "QA & delivery",
    items: [
      {
        id: "globant-automation",
        title: "Quality Control Automation",
        issuer: "Globant University · Egg",
        detail: "405 hours · 23 May 2025",
        file: "globant-automation.jpg",
      },
      {
        id: "postman-fundamentals",
        title: "API Fundamentals Student Expert",
        issuer: "Postman",
        detail: "Completion badge",
        file: "postman-fundamentals.png",
      },
      {
        id: "scrum-basics",
        title: "Registered Scrum Basics",
        issuer: "Agile Education · Scrum Inc.",
        detail: "6 June 2026",
        file: "scrum-basics.pdf",
      },
    ],
  },
  {
    title: "Languages",
    items: [
      {
        id: "ef-set-english",
        title: "English · C1 Advanced",
        issuer: "EF SET",
        detail: "66/100 · 19 April 2026",
        file: "ef-set-english.pdf",
        verify: "https://cert.efset.org/en/g93sqo",
      },
    ],
  },
];

export function Credentials() {
  return (
    <section className="credentials" aria-labelledby="credentials-heading">
      <p className="eyebrow">Education · Continuous learning</p>
      <h2 id="credentials-heading">What I’ve been learning.</h2>
      <p className="editorial-note">
        Courses and certifications that complement my work in testing and AI.
        Open a certificate for the full details, or follow its verification link.
      </p>
      {groups.map((group) => (
        <section className="credential-group" key={group.title} aria-label={group.title}>
          <h3>{group.title}</h3>
          <ul className="credential-grid">
            {group.items.map((item) => (
              <li className="credential-card" key={item.id}>
                <img
                  className="credential-preview"
                  src={`/credentials/${item.id}-preview.webp`}
                  alt=""
                  width="144"
                  height="102"
                  loading="lazy"
                  decoding="async"
                />
                <div className="credential-copy">
                  <p className="credential-issuer">{item.issuer}</p>
                  <h4>{item.title}</h4>
                  <p className="credential-date">{item.detail}</p>
                  <div className="credential-actions">
                    <a href={`/credentials/${item.file}`} target="_blank" rel="noreferrer"
                      aria-label={`View ${item.title} ${item.id === "postman-fundamentals" ? "badge" : "certificate"} (opens in new tab)`}>
                      {item.id === "postman-fundamentals" ? "View badge" : "View certificate"} <span aria-hidden="true">↗</span>
                    </a>
                    {item.verify && (
                      <a href={item.verify} target="_blank" rel="noreferrer"
                        aria-label={`Verify ${item.title} (opens in new tab)`}>
                        Verify <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <div className="credential-education">
        <p className="eyebrow">University education</p>
        <p>Pharmacy · Universidad Nacional del Sur</p>
      </div>
      <a className="text-link dark-link" href="https://www.credly.com/users/milton-klun" target="_blank" rel="noreferrer">
        Credly profile <span aria-hidden="true">↗</span>
      </a>
    </section>
  );
}
