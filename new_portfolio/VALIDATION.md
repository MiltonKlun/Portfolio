## Five landing compositions and search removal

Production build passes. Full Playwright suite: 52 passed, 4 intentional device-specific skips. Tests cover the five backgrounds, menu/CV flow, routes, accessibility, visual regression and reduced-motion still-frame equality. Search is absent from active source and navigation; the landing contains no image elements or chapter subtitles.

Fresh mobile Lighthouse after adaptive rendering: home Performance 98 / Accessibility 100 / Best Practices 100 / SEO 100 (LCP 1.7 s). Evalstand and Contact: 99 / 100 / 100 / 100. Initial shader rendering scored 70; reduced render resolution plus measured frame-cost adaptation resolved the regression. Low-power devices can reduce quality and frame rate or retain a still composition. These are local lab measurements, not field Core Web Vitals.

## September 8 theme and navigation update

Production build passes. Playwright: **48 passed, 4 intentional device-specific skips**, across desktop (1440), wide (1920), tablet and mobile. Updated gallery visual baselines; checked menu, Skills, case study and CV screenshots. Coverage now includes five-section navigation, icon-only CV access, keyboard theme switching, system preference, persisted theme across navigation/reload, and accessibility in both themes. Retired routes return 404; published HTML, CSS, JavaScript and sitemap contain no QA Lab or old Capabilities navigation references. Earlier results below describe the previous version.

# Validation — September 8, 2026

## Build and browser checks

- Application TypeScript check: passed.
- Production client build and static HTML prerender: passed.
- Playwright: **44 passed, 4 intentionally skipped**. The skips are wheel input on the mobile project and mobile-only touch input on the three other viewport projects.
- Four viewport projects: 1440×900, 1920×1080, 768×1024, and Pixel 5 mobile emulation.
- Twelve visual baselines reviewed across homepage, Evalstand chapter, and case-study views. The subsequent comparison run passed without updating snapshots.
- Additional inspection: 390×844, 320×568, and 844×390 landscape. Every chapter's content fits between the header and footer at the two smallest inspected layouts.
- Main routes, menu, search, and editorial layouts inspected with browser screenshots.
- Nineteen distinct internal link URLs collected from primary pages: no broken responses.
- Twelve GitHub case-study source/evidence URLs checked: HTTP 200 at inspection time.
- The original `/tested` and `/untested` applications load from the preserved snapshot; unknown routes return HTTP 404 in the production preview.
- Primary case-study content remains readable without JavaScript.

The suite covers WCAG A/AA axe checks on the homepage, Evalstand case study, Lab, Contact, capabilities, and the open menu. It also exercises keyboard focus, Escape, reduced motion, touch input, browser history, search, CV download, responsive overflow, and the Lab's failing/passing states. Automated checks do not replace a full assistive-technology audit.

## Lighthouse

Production build served locally with compression. Lighthouse 13.4.1, default simulated mobile throttling, Chromium. Scores are a single synthetic run per route, not production field measurements.

| Route | Performance | Accessibility | Best practices | SEO | LCP |
|---|---:|---:|---:|---:|---:|
| `/` | 94 | 100 | 100 | 100 | 3.1 s |
| `/work/evalstand` | 97 | 100 | 100 | 100 | 2.5 s |
| `/contact` | 99 | 100 | 100 | 100 | 2.1 s |

All requested score thresholds were met. Homepage LCP is still above the 2.5-second “good” field threshold under this simulated mobile run; the score must not be presented as a field Core Web Vitals pass. Raw HTML/JSON reports are in the local ignored `reports/` folder.

The primary client bundle is approximately 186 KB raw / 59.4 KB gzip; CSS approximately 26.5 KB raw / 6.5 KB gzip. The measured homepage transfer was approximately 506 KiB including images and fonts. The legacy bundle is separate and not loaded on primary routes.

## External limits

- No production deployment or domain change was performed.
- The included CI workflow is a standalone-repository template. It is not active while nested under `new_portfolio` in the current monorepo. Activation requires a root workflow; existing root CI was left unchanged.
- Real Safari/iOS and Firefox were not tested. Mobile coverage is Chromium device emulation and touch input, not physical-device verification.
- The preserved original showcase retains its original intentional defects and pre-existing verification/accessibility limitations. New-page audit scores do not certify the legacy app.
- Project evidence and business outcomes are explicitly scoped in content; public source inspection is not employer verification or execution of those external project suites.
