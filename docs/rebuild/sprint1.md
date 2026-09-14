# Sprint 1 — Technical foundation checkpoint

Completed locally 2026-09-14 on `feature/rebrand-foundation`. **C1 functional checks pass. No deployment.**
Working direction: A, following the recommendation and Abraham's instruction to continue.

## Delivered

- [x] S1.1: strict TypeScript, TS-aware lint, selected Vite/tooling versions and a reproducible clean install.
- [x] S1.2: real build-time HTML from the same public React content; browser hydration without duplicated content.
- [x] S1.3: Direction A tokens, semantic responsive shell, visible keyboard focus, native links, one scoped GSAP registration boundary, live motion preference subscription and a finite sample reveal.

[Architecture decision, official sources and version constraints](../decisions/001-static-react-foundation.md).

## Verification

| Check | Result |
|---|---|
| `npm ci --no-audit --no-fund` | Pass from updated lockfile; 1966 packages, including retained legacy tooling |
| `npm run lint` | Pass on new TS application, active configs, scripts and tests |
| `npm run typecheck` | Pass |
| `npm test` | 3 passing static-rendering contract tests |
| `npm run build` | Pass; Vite assets plus mandatory HTML injection |
| `npm run test:browser` | 14 passing Chrome tests in 20.8 seconds |
| JS disabled/enabled | Heading, copy, navigation and links readable at 320, 390, 768, 1024 and 1440px |
| Keyboard | First Tab reveals skip link with solid focus outline; activation focuses main; Work CTA reaches its real anchor |
| Motion lifecycle | One active tween under Strict Mode; three active mount/unmount cycles clean up to zero; live reduced motion cancels movement and restores opacity/transform; returning to normal runs one finite reveal |
| Slow development hydration | Pass at 100ms latency / 200kB/s download; no page or console errors/warnings |
| Blocked JS | Production heading and Work anchor remain available |
| Visual review | Desktop hero/full shell and mobile hero opened and checked against A's restrained type/spacing/palette |
| `git diff --check` | Pass |
| Dependency vulnerability audit | **Unverified**: registry audit endpoint failed DNS resolution; not a clean security report |

Tests were introduced red: static renderer was missing; motion test could not find the not-yet-built harness. Both passed after implementation. The initial motion check was strengthened to assert a running tween before testing cancellation.

### Output snapshot

Final generated HTML: 3,800 bytes. Main JS: 218.10 kB / 75.60 kB gzip; CSS: 3.59 kB / 1.33 kB gzip.
These numbers describe the incomplete shell, **not the final site or measured Core Web Vitals**.
The old multi-megabyte imagery, old CV and test harness are not in the rebuilt output. Two unused public starter SVGs remain copied, but are not requested by this shell; remove with the later asset cleanup.

## Screenshots

- [Desktop hero](captures/sprint1-desktop-hero.png)
- [Desktop complete shell](captures/sprint1-desktop-full.png)
- [Mobile hero](captures/sprint1-mobile-hero.png)
- [Mobile complete shell](captures/sprint1-mobile-full.png)

## Review findings and boundaries

Correctness: static/browser output share App and data; template injection fails loudly; old App import ambiguity avoided with explicit `.tsx` imports. Readability: small focused renderer, hook and motion sample; no new routing/framework layer. Security: public facts only, React escaping, no live fetch, credentials or private future-case data. Performance: no old assets imported and no perpetual animation. Architecture: static hosting is retained; deployment configuration is not changed.

Known limitations:

1. ESLint 9 is a peer-compatible transitional choice for the retained legacy lint setup, but the registry marks it unsupported. Migrate that legacy lint path and ESLint together before release; see the ADR.
2. Legacy JS lint debt remains; a passing new-source lint check does not claim it was fixed. Old components/assets remain in source as requested preservation references.
3. Audit availability, final browser/accessibility/performance certification, current résumé and domain cutover remain open. No Lighthouse or award score is claimed.
4. This is the shell, not the final hero or complete content. System fonts are intentional for this checkpoint; the hero topology, responsive drawer, active-section tracking and credential strip are S2. Detailed Work, Writing and Experience content follow in later sprints.
5. The public résumé link is omitted rather than serving the outdated PDF. Contact remains usable.

Next: **S2.1 navigation**, then the Direction A signature hero and credential strip. Keep the original screenshots and S0 studies as the C2 elegance comparison.
