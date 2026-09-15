# Existing-site baseline

Captured 2026-09-14, repository HEAD `13c1d3d325e29313d08f4c91c901e666dc05c9cf`.
Existing `.gitignore` modification preserved. These are local development captures, not an audit of the deployed domain.

## Evidence and observations

Chrome via temporary Playwright tooling; desktop 1440×1000, mobile 390×844, DPR 1.
Chrome DevTools MCP was unavailable. Browser capture waited for a visible H1 and then four seconds; menu capture followed open/close interaction. Work captured after scrolling into the project section.

| Characteristic | Observed evidence | Rebuild decision |
|---|---|---|
| Dark foundation | [Desktop hero](captures/baseline-desktop-hero.png), [mobile hero](captures/baseline-mobile-hero.png): almost black with off-white typography | Preserve; translate to the graphite palette. |
| Large type and personal identity | Hero's two large statements dominate; compact personal mark at top | Preserve confident scale, but use one H1 and the new name/positioning. |
| Negative space | Desktop hero spreads supporting copy around large statements; mobile separates two reading groups generously | Preserve breathing room without retaining oversized gaps mechanically. |
| Geometry | [Desktop Work](captures/baseline-desktop-work.png), [mobile Work](captures/baseline-mobile-work.png): bordered, dark image tiles | Retain alignment and restraint; replace dense mobile two-column tiles with readable case-study blocks. |
| Navigation | [Desktop menu](captures/baseline-desktop-menu.png), [mobile menu](captures/baseline-mobile-menu.png): full-screen charcoal overlay and large labels | Preserve clarity, not the theatrical transition or oversized social graphics. |
| Movement | Menu opened/closed successfully, scrolling reached Work. Source uses character entrances, looping arrows, size tweens and background-position effects | Replace with finite transform/opacity motion. Screenshots do not establish frame rate. |

[Browser data](captures/baseline-browser.json) records current anchors, titles and console messages.
Both widths had document width equal to viewport width. Desktop logged one resource 404; the capture did not identify its URL, so its cause remains unclassified. No page exception was reported on the successful run.
An initial cold capture was blank and its script failed because H1 was absent. A repeat showed content without application errors; the capture was corrected to await a visible H1 instead of assuming a fixed delay proved readiness. This is not evidence of a production fix.

## Build and source baseline

- `npm run build`: passed, 273 modules, 16.35 seconds on this machine.
- Emitted main JavaScript: 311.16 kB (103.13 kB gzip); CSS: 92.31 kB (14.27 kB gzip).
- Warnings: outdated Browserslist data and deprecated Tailwind `@variants`.
- `npm run lint`: failed, **93 errors / 3 warnings**; includes unused symbols, prop validation, hooks and configuration issues. These predate Sprint 0. No clean-lint claim.
- React 18 / Vite 4 / Tailwind 3 / GSAP; several overlapping animation packages. Lenis is installed but no active use was found. Dependency migration belongs to S1.
- Empty React root in source HTML: current no-JavaScript content requirement is unmet. Build-time HTML is an S1 decision.
- Hero source contains multiple H1s and nested interactive elements; reduced-motion handling is missing in the inspected active motion. These are rebuild requirements, not preserved patterns.
- No Lighthouse, field Core Web Vitals, low-end-device profiling or accessibility certification performed. Bundle output is not a measurement of actual initial network transfer.

## Asset and deployment inventory

| Existing assets/configuration | Disposition |
|---|---|
| `src/assets/abraham*.png`, `abraham*.webp` | Potential portrait sources; optional About asset only after crop/quality approval. |
| `src/assets/files/CV.pdf` | Outdated; retain as historical source, do not ship as the current résumé. |
| `src/assets/projects/*` | Old web-project screenshots; archive/reference, not the three cloud case studies. |
| `src/assets/skillset/*`, `navIcons/*` | Inventory only; new restrained icon treatment need not reuse these. |
| `src/assets/pictures/*`, `numbers/*`, `doomsday.jpg`, `forInstagram.png` | No requirement in the new one-page brief; exclude from future delivery unless justified. Existing files not deleted. |
| `public/react.svg`, `public/vite.svg`, duplicate source logos | Starter assets, not brand assets. |
| Build emits `doomsday.jpg` ~7.75 MB, `forInstagram.png` ~7.09 MB | Investigate import graph in S1. Emitted does not mean downloaded by the active page. |
| `package.json` homepage `abrahamparn.github.io`; deploy `gh-pages -d dist --cname abrahamnaiborhu.me` | Legacy identity/domain. Do not change or deploy without cutover verification. |
| Netlify CLI scripts; `src/assets/_redirects` | Competing hosting hints; verify actual host and whether redirect asset is deployed before assuming behavior. |
| Intended `abrahamnaiborhu.com` | DNS resolution failed in this environment; ownership/hosting confirmation is a launch dependency. |

Preservation gate: the six characteristics above now have rendered references or explicit source-only qualifications. Keep the old application until the replacement passes later checkpoints.
