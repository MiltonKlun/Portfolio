export const github = "https://github.com/MiltonKlun";
export const email = "miltonericklun@gmail.com";
export const linkedin = "https://www.linkedin.com/in/milton-klun/";

export type Chapter = {
  id: string;
  title: string;
  category: string;
  heading: string;
  description: string;
  path: string;
  action: string;
};

export const chapters: Chapter[] = [
  {
    id: "about",
    title: "About me",
    category: "Engineer · Argentina",
    heading: "Quality,\nby design.",
    description:
      "I’m Milton Klun, an SDET and QA Automation Engineer working on AI quality and LLM evaluation.",
    path: "/about",
    action: "Meet me",
  },
  {
    id: "experience",
    title: "Experience",
    category: "2023–2026 · Professional",
    heading: "Work with\nimpact.",
    description:
      "I’ve evaluated LLM outputs, built test frameworks, and automated business workflows. Here’s what that work involved.",
    path: "/experience",
    action: "View experience",
  },
  {
    id: "projects",
    title: "Projects",
    category: "Engineering · Quality",
    heading: "What I’m\nbuilding.",
    description:
      "Tools for evaluating AI, supporting QA work, and automating everyday tasks. See how they work and how I test them.",
    path: "/work",
    action: "Explore projects",
  },
  {
    id: "skills",
    title: "Skills",
    category: "Testing · Learning",
    heading: "What I\nwork with.",
    description:
      "End-to-end testing, API testing, automation, and LLM evaluation. What I use in practice and what I’m learning.",
    path: "/skills",
    action: "Explore skills",
  },
  {
    id: "contact",
    title: "Contact",
    category: "Contact · Opportunities",
    heading: "Let’s work\ntogether.",
    description:
      "Have a role in AI quality or test automation in mind? Let’s talk about how I could contribute. Based in Argentina, working remotely.",
    path: "/contact",
    action: "Let's talk",
  },
];

export type Project = {
  slug: string;
  title: string;
  category: string;
  image: string;
  status: string;
  intro: string;
  role: string;
  problem: string;
  decisions: string[];
  flow: string[];
  quality: string;
  outcome: string;
  limitation: string;
  lesson: string;
  technologies: string[];
  sources: { label: string; url: string }[];
};
export const projects: Project[] = [
  {
    slug: "evalstand",
    title: "Evalstand",
    category: "LLM evaluation tooling",
    image: "glass",
    status: "In development · Pre-alpha",
    intro:
      "Evaluating an LLM application should feel like running a test suite.",
    role: "I’m building Evalstand in Python to make it easier for me and other developers to evaluate the AI agents we work on. The aim is a local workflow that feels familiar to someone who already writes tests.",
    problem:
      "Many conventional tests compare an output with a known expected result. An AI agent can give different answers to the same input, so a single successful run tells you less. I wanted a simple way to run evaluations, inspect what happened, and compare results as an agent changes.",
    decisions: [
      "Use stable case IDs to compare runs without silently pairing different cases.",
      "Share an execution runner between the CLI and pytest plugin.",
      "Persist results in SQLite and cache model responses locally.",
      "Capture nested calls, latency, tokens, and cost alongside scores.",
    ],
    flow: [
      "Cases + task",
      "Runner · pytest",
      "Scorers + traces",
      "SQLite + comparison",
    ],
    quality:
      "Tests cover case matching, timeouts, caching, nested traces, scorer protocols, and what reports say about results. An integration test replays responses offline; tests that call live providers run only when enabled.",
    outcome:
      "The local workflow runs evaluations, shows traces, and compares saved results. The terminal UI also has a watch mode. Evalstand is still in development and hasn’t had a public release.",
    limitation:
      "Score differences describe what changed between runs; they don’t establish statistical significance. The LLM judges have not yet been calibrated against human labels.",
    lesson:
      "A lower score needs context before I can call it a regression. Being able to inspect the case and its execution matters as much as seeing the comparison.",
    technologies: [
      "Python",
      "Pytest",
      "SQLite",
      "Pydantic",
      "Textual",
      "LiteLLM",
    ],
    sources: [
      { label: "Source & current status", url: `${github}/Evalstand` },
      {
        label: "Report honesty tests",
        url: `${github}/Evalstand/blob/main/tests/unit/test_report_honesty.py`,
      },
      {
        label: "Run comparison",
        url: `${github}/Evalstand/blob/main/src/evalstand/comparison.py`,
      },
    ],
  },
  {
    slug: "evalharness",
    title: "EvalHarness",
    category: "RAG & agent evaluation",
    image: "rhythm",
    status: "Independent project",
    intro: "Testing RAG systems, agents, and the models that judge their answers.",
    role: "My independent project for exploring RAG evaluation, model judges, adversarial inputs, and agent reliability.",
    problem:
      "An answer can sound right without being supported by its sources. A model judging that answer can get it wrong, too. The evaluation needs its own tests.",
    decisions: [
      "Combine deterministic checks with model-based evaluation.",
      "Use replay data for repeatable checks without provider calls.",
      "Separate fast, judged, and live evaluation tiers.",
      "Compare a judge against a small labeled gold set and document adversarial findings.",
    ],
    flow: [
      "RAG · LangGraph",
      "Deterministic checks",
      "Judge evaluation",
      "Gold-set analysis",
    ],
    quality:
      "The implementation includes scripted agent reliability tests for tool failures, loops, and state behavior, as well as replay-based evaluation and adversarial cases.",
    outcome:
      "The project provides repeatable evaluation runs and documents where model judges fail. The findings include fixes for identified vulnerabilities and a judge-bias issue that remains unresolved.",
    limitation:
      "The gold set is small. Calibration results depend on the chosen threshold and do not establish general safety or held-out accuracy.",
    lesson:
      "A judge’s final score doesn’t show where it disagrees with the labeled examples. Those disagreements and the chosen threshold need to be visible when interpreting results.",
    technologies: [
      "Python",
      "LangGraph",
      "DeepEval",
      "Pytest",
      "GitHub Actions",
    ],
    sources: [
      { label: "Repository", url: `${github}/EvalHarness` },
      {
        label: "Adversarial findings",
        url: `${github}/EvalHarness/blob/main/adversarial/FINDINGS.md`,
      },
      {
        label: "Agent reliability tests",
        url: `${github}/EvalHarness/blob/main/agent_tests/test_reliability.py`,
      },
    ],
  },
  {
    slug: "qaizen",
    title: "Qaizen",
    category: "AI-assisted QA engineering",
    image: "horizon",
    status: "Independent project",
    intro: "From a user story to AI-assisted tests, with review at each stage.",
    role: "I built this personal project to connect AI-assisted test creation with executable checks and human review.",
    problem:
      "AI can generate tests quickly. Someone still needs to check whether they cover the requirement, make the right assertions, and produce useful results.",
    decisions: [
      "Keep four explicit human review gates in the workflow.",
      "Validate artifact schemas before moving between stages.",
      "Connect acceptance criteria, risk, tests, and execution evidence.",
      "Constrain automated healing and preserve human responsibility for approval.",
    ],
    flow: [
      "Story + risk",
      "Human review",
      "Playwright · Newman",
      "Evidence + report",
    ],
    quality:
      "Playwright E2E and Postman/Newman API checks sit alongside schema validation and guarded repair behavior. Example runs and pilot evidence are available in the repository.",
    outcome:
      "The workflow links requirements to tests and their results. A small pilot records the benefits alongside the time needed for review.",
    limitation:
      "Qaizen helps create and run tests. Its expected-dataset results don’t establish how reliably a live model generates correct tests.",
    lesson:
      "Each review step needs to show the reviewer what to check and what they’re approving. Otherwise, it adds a pause without helping them assess the test.",
    technologies: [
      "JavaScript",
      "Playwright",
      "Postman",
      "Newman",
      "JSON Schema",
    ],
    sources: [
      { label: "Repository", url: `${github}/Qaizen` },
      {
        label: "Pilot evidence",
        url: `${github}/Qaizen/blob/main/docs/evidence.md`,
      },
    ],
  },
  {
    slug: "cartographer",
    title: "Cartographer",
    category: "Evidence systems",
    image: "cartographer",
    status: "Independent project",
    intro: "Keeping software documentation connected to the checks behind it.",
    role: "My independent TypeScript project for tracking evidence behind software documentation, with explicit state rules and explanations tied to their sources.",
    problem:
      "Documentation can still say a feature works after the code or its tests have changed. Cartographer tracks whether a statement is verified, stale, asserted, unknown, or failing.",
    decisions: [
      "Represent evidence states explicitly in a local ledger.",
      "Calculate freshness from age, change, and evidence links.",
      "Inject time to keep freshness rules testable.",
      "Keep explanatory prose separate from the deterministic state model.",
    ],
    flow: [
      "Behavior + evidence",
      "SQLite ledger",
      "Freshness rules",
      "Cited explanation",
    ],
    quality:
      "Unit and integration tests exercise evidence states, freshness, CLI behavior, redaction, quarantine, and checks on explanatory claims.",
    outcome:
      "A local system that records supporting evidence and uses explicit rules to flag when it becomes outdated.",
    limitation:
      "Checks on citations and state contradictions are bounded safeguards, not a general guarantee against hallucination.",
    lesson:
      "The age of a check is only part of the picture. Changes to the behavior it covers also affect whether it still supports the documentation.",
    technologies: ["TypeScript", "SQLite", "CLI tooling"],
    sources: [
      { label: "Repository & architecture", url: `${github}/Cartographer` },
    ],
  },
  {
    slug: "pg-original",
    title: "PG Original",
    category: "Automation & business workflows",
    image: "pg-original",
    status: "Client experience + published projects",
    intro: "Less manual entry across orders, payments, and reporting.",
    role: "I worked as a contract SDET · QA Automation Engineer from April 2024 to August 2025. The linked repositories show related automation and test engineering work.",
    problem:
      "Orders, inventory, payments, and reporting were spread across several systems. Entering and reconciling data by hand took time and created opportunities for errors.",
    decisions: [
      "Use Python automation to connect business workflows.",
      "Apply the Page Object Model and BDD principles to Playwright checks of critical e-commerce workflows.",
      "Validate the Tiendanube and MercadoPago integrations with Postman and contract tests.",
      "Separate business services from Telegram and serverless entry points in Pombot.",
    ],
    flow: [
      "Tiendanube · MercadoPago",
      "Python services",
      "Sheets · Telegram",
      "Regression checks",
    ],
    quality:
      "For the client, Postman and contract tests covered order registration, inventory synchronization, and webhooks across the two API integrations. Unit and integration tests checked the monthly balance generator’s income and expense figures against the source APIs, and regression checks guarded the Python automation. The public POM and Pombot repositories provide separate views of test architecture and application behavior.",
    outcome:
      "The Python automation reduced manual data entry by approximately 60% across three platforms. The monthly balance generator saves more than 10 hours of reconciliation per month.",
    limitation:
      "These results come from the client engagement. The public repositories were published later and show related work, rather than an exact snapshot of the client system.",
    lesson:
      "The checks need to follow data across systems. A working storefront alone doesn’t tell you whether payments and financial reports reconcile correctly.",
    technologies: [
      "Python",
      "Playwright",
      "Pytest",
      "REST APIs",
      "Postman",
      "AWS Lambda",
    ],
    sources: [
      { label: "Playwright framework", url: `${github}/PG_Original_POM` },
      { label: "Pombot", url: `${github}/Pombot_PG_Original` },
    ],
  },
  {
    slug: "csa-pharma",
    title: "CSA Pharma",
    category: "Risk-based validation",
    image: "csa-pharma",
    status: "Engineering demonstration",
    intro: "Planning validation around risk and checking the records it produces.",
    role: "I built this demonstration to apply ideas from my pharmacy studies, including risk assessment, traceability, and documentation, to software validation.",
    problem:
      "A test record needs to show what was checked and whether the record has changed. Planning the checks also means deciding which failures carry the greatest risk.",
    decisions: [
      "Use a risk engine to guide validation work.",
      "Capture evidence with SHA-256 sidecars.",
      "Exercise audit and electronic-signature behavior in a demonstration QMS.",
      "Package reproducible checks with Docker.",
    ],
    flow: [
      "Risk assessment",
      "Validation checks",
      "Evidence capture",
      "Integrity review",
    ],
    quality:
      "The repository includes scripted tests, evidence-integrity checks, and demonstration quality-management workflows.",
    outcome:
      "A working validation demonstration with test records and integrity checks available in the repository.",
    limitation:
      "This is a portfolio demonstration, not a validated pharmaceutical production system or a compliance certification.",
    lesson:
      "A checksum helps detect changes to a record. Understanding that record still requires knowing which check produced it and what the result means.",
    technologies: ["Python", "Pytest", "FastAPI", "Docker"],
    sources: [
      {
        label: "Repository & artifacts",
        url: `${github}/CSA_Pharma_Framework`,
      },
    ],
  },
];

export const experience = [
  {
    company: "Revelo",
    dates: "Oct 2025 — Jul 2026",
    role: "AI Quality Engineer · SDET",
    type: "Contract · Remote",
    summary:
      "Evaluated 800+ LLM outputs against acceptance criteria and edge-case specifications, using structured test cases and exploratory evaluation to find quality gaps. Executed 100+ acceptance checks in Dockerized environments through CI/CD-ready pipelines, and ran regression checks across model versions against consistent criteria.",
    tags: "LLM evaluation · Model regression · Docker",
  },
  {
    company: "PG Original Ind.",
    dates: "Apr 2024 — Aug 2025",
    role: "SDET · QA Automation Engineer",
    type: "Contract · Remote",
    summary:
      "Built a Playwright framework with the Page Object Model and BDD principles for critical e-commerce workflows. Validated the Tiendanube and MercadoPago API integrations with Postman and contract tests. Defined regression checks for Python automation that cut manual data entry by about 60% across three platforms, and tested a monthly balance generator that saves 10+ reconciliation hours a month.",
    tags: "Playwright · Python · Contract testing · Financial data",
  },
  {
    company: "Wide",
    dates: "Feb 2023 — Mar 2024",
    role: "SDET · QA Automation Engineer",
    type: "Consultant · On-site",
    summary:
      "Built two financial automation systems with Python and Selenium, centralizing payment and reporting operations across four partner platforms. Implemented 30+ scheduled Pytest suites to validate data extraction and financial report accuracy, with Allure reports making the results available for review.",
    tags: "Python · Selenium · Pytest · Allure",
  },
];

export const pageInfo: Record<string, { title: string; description: string }> =
  {
    "/": {
      title: "Milton Klun — AI Quality Engineer & SDET",
      description:
        "SDET and QA Automation Engineer specializing in AI Quality and LLM evaluation. Explore professional experience, Python tooling, and test engineering projects.",
    },
    "/about": {
      title: "About — Milton Klun",
      description:
        "Meet Milton Klun, an SDET with professional LLM evaluation experience, based in Bahía Blanca, Argentina.",
    },
    "/experience": {
      title: "Experience — Milton Klun",
      description:
        "Professional experience at Revelo, PG Original, and Wide in AI quality, test automation, and financial workflows.",
    },
    "/skills": {
      title: "Skills — Milton Klun",
      description:
        "The tools Milton Klun uses for AI quality, Python automation, and API testing, alongside selected courses and certifications.",
    },
    "/work": {
      title: "Projects — Milton Klun",
      description:
        "Engineering case studies: Evalstand, EvalHarness, Qaizen, Cartographer, PG Original, and CSA Pharma.",
    },
    "/contact": {
      title: "Contact — Milton Klun",
      description:
        "Contact Milton Klun for AI Quality, SDET, and QA Automation opportunities. Argentina, UTC−3. View or download a CV.",
    },
    "/cv": {
      title: "CV — Milton Klun",
      description:
        "View or download Milton Klun’s CV. SDET, QA Automation, AI Quality and LLM Evaluation.",
    },
    ...Object.fromEntries(
      projects.map((p) => [
        `/work/${p.slug}`,
        { title: `${p.title} — Milton Klun`, description: p.intro },
      ]),
    ),
  };
