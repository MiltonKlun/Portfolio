> September 8 navigation update: five landing sections (About me, Experience, Projects, Skills, Contact); persistent system-aware light/dark themes; icon-only CV page entry. The former lab and legacy routes are retired from this build, with their files archived under `research/retired-showcase`. Earlier implementation notes below describe the previous version.

# Implementation notes

## Reference inspection

Reference: https://senawastudio.com/ and its AA House detail route. Inspected at 1440×900, 390×844, and 768×1024. Examined wheel changes, menu panel, chapter rail, progress bar, and the fixed-sidebar detail layout. Reference screenshots are local research artifacts, excluded from version control and production.

Observed chapter-rail transition: approximately 0.9 seconds with `cubic-bezier(.16,1,.3,1)`. The new implementation follows that cadence, uses crossfading scenes with a restrained scale settle, and preserves ordinary vertical scrolling on detail pages. Important intentional adaptations are visible professional copy, accessible navigation controls, direct work/CV access, and reduced-motion fallbacks.

## Module boundaries

- `Gallery.tsx`: bounded chapter state, circular rail, gesture/keyboard handling, background transitions.
- `Navigation.tsx`: native modal dialog, focus restoration, menu, searchable content index.
- `Pages.tsx`: editorial pages, case-study structure, original Lab entry, CV integration.
- `content.ts`: factual content and source links, separated from layout.
- `App.tsx`: local history navigation, route transitions, metadata synchronization.
- `entry-server.tsx` + `scripts/prerender.mjs`: build-time HTML for direct navigation and no-JavaScript reading.
- `scripts/preview.mjs`: static production preview with compression and correct 404 responses.

The primary runtime is React and React DOM. CSS handles transitions; no Motion, GSAP, Lenis, Three.js, or WebGL is loaded into this app. The preserved legacy application retains its own dependencies inside its isolated assets.

## Evidence decisions

Employment dates and scope follow the current supplied CV: Revelo, October 2025–March 2026; PG Original, April 2024–August 2025; Wide, February 2023–March 2024. Employment has not been independently employer-verified.

Evalstand was checked against its public README, package metadata, source tree, comparison implementation, and report-honesty tests. Its unreleased status, uncalibrated judge scorers, and lack of significance testing are stated. No external project test suite was executed or provider API called.

Other project evidence comes from the repository audit: EvalHarness, Qaizen, Cartographer, Pombot/PG Original, CSA Pharma. Each case study links to public evidence and explains limits. Training is separate from professional experience, and no guessed credential IDs or dates are published.

## Legacy snapshot refresh

From the parent portfolio repository, with its existing dependencies installed:

```sh
npx vite build --base=/legacy/ --outDir new_portfolio/public/legacy
```

Copy the resulting `public/legacy/index.html` into the new application's `public/tested.html` and `public/untested.html`, add `noindex, nofollow`, and retain the root public logo assets referenced by the original app. Re-run the new portfolio build and preserved-route tests. Its React Router still uses `/tested` and `/untested`; changing only the bundler asset base is deliberate.

This is a compatibility snapshot, not a refactor of the original QA work. Existing source stays in the parent repository. A future consolidation can replace this boundary after the new design is approved.

## Remaining external decisions

- Review the local design and a hosted preview before changing the production domain.
- Activate the included CI workflow at the repository root if retaining a monorepo; nested GitHub workflows do not execute.
- Add public credential verification links if desired; current training is sourced to the supplied CV.
- Keep project status current as Evalstand develops.

No analytics, newsletter, contact-form backend, mandatory loader, or third-party runtime image requests are included.
