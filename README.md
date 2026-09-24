# Portfolio

[![Personal portfolio](https://github.com/MiltonKlun/Portfolio/actions/workflows/portfolio.yml/badge.svg)](https://github.com/MiltonKlun/Portfolio/actions/workflows/portfolio.yml)

Source for **[miltonklun.com](https://www.miltonklun.com)**: the portfolio of Milton Klun, an SDET and QA Automation Engineer working on AI quality and LLM evaluation. It holds case studies in AI evaluation and test automation, along with the Playwright suite that verifies the site itself.

## What's on the site

- **About, Experience, Skills:** professional work at Revelo, PG Original, and Wide, plus the tools and practices behind it.
- **Projects:** six case studies (Evalstand, EvalHarness, Qaizen, Cartographer, PG Original, CSA Pharma). Each covers the problem, engineering decisions, test strategy, results, and stated limitations, with links to the source.
- **Credentials and CV:** certificates with verification links, and the CV as a PDF to view or download.

## How it's built

- React 18, TypeScript, and Vite 7, with hand-written CSS in light and dark themes.
- The landing page is a five-chapter gallery, navigable by wheel, keyboard, touch, and chapter links. Its WebGL backgrounds are rendered with [OGL](https://github.com/oframe/ogl) and fall back to a still composition for reduced motion.
- Every route is prerendered to static HTML at build time, so content and links work without JavaScript and unknown paths return real 404 responses. The same step writes the sitemap and structured data.
- Hosted on Vercel.

## How it's tested

| Command | What it checks |
| --- | --- |
| `npm test` | Playwright end-to-end tests on four Chromium projects: desktop, wide, touch tablet, and mobile. They cover navigation, menu focus, themes, reduced motion, routes and metadata, pages without JavaScript, 404s, CV and credential links, and axe-core WCAG 2.1 A/AA scans in both themes. |
| `npm run test:visual` | Visual regression against Windows-rendered baselines. |
| `CROSS_BROWSER=1 npm test` | Adds Firefox and WebKit (desktop and iPhone). |
| `SHOW_KNOWN_DEFECTS=1 npm test` | Runs `tests/regressions.spec.ts` as ordinary tests, showing the real failure of any defect that isn't fixed yet. |
| `npm run test:performance` | Lighthouse audits with score thresholds, against a running `npm run preview`. |
| `node scripts/probe.mjs routes\|wheel\|shader` | Repeatable exploratory measurements: route sweep, wheel-gesture replay, and shader frame rate with long tasks. |

CI builds the site and runs the Playwright suite on Windows with Node 22 for every push and pull request to `main`.

## Run it locally

Requires Node 22.

```sh
npm ci
npx playwright install chromium
npm run dev                        # http://127.0.0.1:5174
npm run build && npm run preview   # production build with real routing and 404s
npm test
```

Development and preview share port 5174, so run one at a time.

## Layout

| Path | Contents |
| --- | --- |
| `src/content.ts` | Landing chapters, projects, experience, and page metadata. |
| `src/Pages.tsx`, `src/Credentials.tsx` | Editorial pages, case studies, the CV page, and credentials. |
| `src/Gallery.tsx`, `src/Navigation.tsx`, `src/App.tsx` | Landing gallery, menu dialog, and client-side routing. |
| `src/effects/` | Shader backgrounds and their renderer. |
| `scripts/` | Prerendering, production preview server, Lighthouse audits, and probes. |
| `tests/` | Playwright tests, helpers, and visual baselines. |
| `public/` | Fonts, artwork, credentials, and the CV. |

## License

Copyright © 2026 Milton Klun. All rights reserved. The source is public so it can be read and evaluated, but no part of it, including the code, CV, portrait, credentials, copy, and artwork, may be reused without permission. See [LICENSE](LICENSE). Third-party components and fonts keep their own licenses; see [THIRD_PARTY_NOTICES.txt](THIRD_PARTY_NOTICES.txt).
