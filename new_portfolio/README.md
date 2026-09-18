# Milton Klun - Personal portfolio

React, TypeScript, and Vite portfolio with prerendered pages, light/dark themes, five landing chapters, project case studies, credentials, and a directly accessible CV. The original QA showcase source remains at the repository root for reference.

## Run locally

Use Node 22 or newer. From new_portfolio, run npm ci followed by npm run dev. Open http://127.0.0.1:5174. For production route handling, run npm run build and npm run preview instead. Development and preview use the same port; run one at a time.

## Content

- src/content.ts: landing copy, experience, case studies, metadata.
- src/Pages.tsx: editorial pages and CV links.
- src/Credentials.tsx: credential groups and verification links.
- public/Milton_Klun_CV.pdf: latest supplied CV, copied without altering its contents.
- CONTENT_FOLLOW_UP.md: deferred CV-to-portfolio wording updates to revisit after launch.

Routes: /, /about, /experience, /work, six /work/:slug pages, /skills, /contact, and /cv. Search and QA Lab are retired. The original source is preserved, but /tested and /untested are not published by the new site.

## Verification

Run npx playwright install chromium, npm run build, and npm test inside new_portfolio.

Tests cover navigation, keyboard/touch interactions, responsive layout, both themes, reduced motion, accessibility, credentials, CV downloads, static content, 404 responses, and visual comparisons. Screenshot baselines use Windows. The active monorepo workflow is .github/workflows/portfolio.yml at the repository root.

npm run test:performance runs Lighthouse audits against a running production preview. Reports are local measurements, not field Core Web Vitals. Historical research notes are not current release guarantees.

## Production deployment

The existing Vercel project builds from the repository root. Root vercel.json installs and builds new_portfolio, publishes new_portfolio/dist, and enables clean URLs and security/cache headers. The old catch-all SPA rewrite is removed so prerendered routes and real 404 responses work correctly.

GitHub main is the production source. Validate a branch preview and CI before merging. No new domain or DNS configuration is needed for this migration.

Previous production commit: d5c5a46482315e6d314169fa783e02468b6d37ff. Vercel retains earlier deployments for rollback. Alternatively, revert the migration commit on main to restore the original deployment configuration.

new_portfolio/vercel.json remains available if this folder becomes a standalone project. ASSETS.md and THIRD_PARTY_NOTICES.txt document asset origins and licenses.
