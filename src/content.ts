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
  intro: string;
  repo: string;
};
export const projects: Project[] = [
  {
    slug: "evalstand",
    title: "Evalstand",
    category: "LLM evaluation tooling",
    image: "glass",
    intro:
      "Evaluating an LLM application should feel like running a test suite.",
    repo: `${github}/Evalstand`,
  },
  {
    slug: "evalharness",
    title: "EvalHarness",
    category: "RAG & agent evaluation",
    image: "rhythm",
    intro: "Testing RAG systems, agents, and the models that judge their answers.",
    repo: `${github}/EvalHarness`,
  },
  {
    slug: "qaizen",
    title: "Qaizen",
    category: "AI-assisted QA engineering",
    image: "horizon",
    intro: "From a user story to AI-assisted tests, with review at each stage.",
    repo: `${github}/Qaizen`,
  },
  {
    slug: "cartographer",
    title: "Cartographer",
    category: "Evidence systems",
    image: "cartographer",
    intro: "Keeping software documentation connected to the checks behind it.",
    repo: `${github}/Cartographer`,
  },
  {
    slug: "pg-original",
    title: "PG Original",
    category: "Automation & business workflows",
    image: "pg-original",
    intro: "Less manual entry across orders, payments, and reporting.",
    repo: `${github}/PG_Original_POM`,
  },
  {
    slug: "csa-pharma",
    title: "CSA Pharma",
    category: "Risk-based validation",
    image: "csa-pharma",
    intro: "Planning validation around risk and checking the records it produces.",
    repo: `${github}/CSA_Pharma_Framework`,
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
        "Engineering projects with their source on GitHub: Evalstand, EvalHarness, Qaizen, Cartographer, PG Original, and CSA Pharma.",
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
  };
