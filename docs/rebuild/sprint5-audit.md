# Audit of the added motion and accessibility work

Reviewed against the rebrand/animation rules after user commit `bf19b79` and the
uncommitted ScrollTrigger, reveal, timeline, surface, and accessibility additions.
The code-review skill guided correctness, accessibility, maintainability, and bundle checks.

## Required fixes implemented

1. **Invalid timeline markup:** decorative `div` was a direct child of `ol`. Moved
   it into a positioned wrapper outside the list. Raised the progress rail above
   the muted item borders so its blue fill is not covered.
2. **Hidden content during enhancement:** `gsap.from({opacity: 0})` immediately hid
   headings, links, and below-fold content. Changed these entrances to start at
   0.85 opacity. Failed/interrupted motion no longer makes essential content invisible.
3. **Replayed entrances:** `once` applies to one ScrollTrigger instance, not to a
   component across reduced-motion changes. Recorded entrances on actual start;
   completed/started sections remain static after preferences are toggled. Career
   roles are tracked individually. Strict Mode's initial setup/cleanup does not consume
   an entrance before it starts. Hero styles clear after completion.
4. **Clipped Contact focus rings:** removed the new overflow clipping from Contact;
   its bounded decorative pseudo-element does not require it.
5. **False-positive accessibility checks:** touch targets now fail if either dimension
   is under 44px; heading levels compare adjacent headings, not the maximum ever seen;
   explicitly empty image alt text is accepted for decoration. The viewport-halving
   test is accurately labeled a reflow proxy, not proof of actual browser zoom.
6. **Lint blocker:** removed the unused `Page` type import in the new accessibility suite.
   Kept border transition motion inside the reduced-motion media guard.

Preserved the new section surfaces, subtle Contact glow, hero sequence, browser-only
ScrollTrigger registration, and timeline progress approach. `ScrollReveal` remains
unused in production; retained it rather than deleting the user's new abstraction.

## Verification

- 11 static tests, lint, typecheck, production build passed.
- All 46 Chrome browser tests passed (51.4 seconds), including the new readable-motion,
  no-replay, list structure, touch target, heading, text size, and reflow checks.
- Existing reload CSS, slow hydration, no-JavaScript, navigation, reduced-motion, and
  project cleanup tests passed. The Resume view/download/contact journey also passed.
- JS 288.57 kB / 100.22 kB gzip; CSS 14.90 kB / 3.81 kB gzip. Roughly +18 kB gzip JS
  versus the pre-ScrollTrigger implementation. No new package installation.
- [4× CPU load trace](captures/sprint5-audit-motion-profile.json): 49 Layout events,
  max 126.077ms; max Paint 8.367ms; max FunctionCall 47.964ms. This measures initial
  load/hero, not all scrolling or real-device frame rate. Initial layout remains a long task.

## Still open before C5

- Shipping Safari/device verification, actual browser zoom, screen-reader/contrast review.
- Dedicated unmount/remount checks for the new ScrollTrigger section effects and rail.
- Profile full-page scrolling and attribute the initial-layout cost; no Lighthouse or
  field-CWV certification is implied by the passing functional tests.
- Visual review of the new surface rhythm and overall mobile reading density.

S5 is in progress, not complete. No deployment, push, or unrelated source deletion.

## Cross-browser checkpoint — 2026-09-15

Added an opt-in `CROSS_BROWSER=1` Playwright matrix using the existing accessibility
suite and three focused compatibility tests. Chrome-only CDP tests stay in the
default suite. No production animation, layout, or bundle changes were needed.

- **30/30 matrix checks passed** in 32.2 seconds on macOS 26.6.2 arm64:
  installed Chrome, Playwright Firefox 155.0, and Playwright WebKit 26.6.
- Coverage: eight responsive widths (320–1440), a 1920px desktop, 14px mobile
  text, 44px targets, heading structure, accessible image names, reflow proxy,
  readable motion and live preference changes, keyboard drawer focus/scroll lock,
  Resume view/PDF download/contact journey, and native navigation without JavaScript.
- Found and fixed a real Chrome console 404: standalone Resume HTML had no icon,
  causing an automatic `/favicon.ico` request. It now uses the existing portfolio
  inline icon. Regenerated Resume artifacts; the PDF remains two tagged pages.
  The compatibility test checks console warnings/errors throughout this journey.
- Build, lint, typecheck, and 12 static tests passed. JS/CSS sizes are unchanged.
- Full default Chrome regression suite passed: 49/49 in 56.2 seconds, including
  reload CSS delivery, slow hydration, diagram cleanup, and the existing load trace.
- Test browsers were installed in `/private/tmp/portfolio-playwright-browsers`;
  use `PLAYWRIGHT_BROWSERS_PATH` with this path to reuse that local installation.
  README documents a standard-cache installation for other machines.

The debugging skill led to reproducing the missing-resource error before fixing it.
Review confirmed the changes are limited to test configuration, compatibility coverage,
and the Resume icon; existing capture edits were not included in this checkpoint.

This is engine compatibility evidence, not Safari app/iPhone certification, full WCAG
conformance, or a visual sign-off. Actual zoom and screen-reader sampling remain open.
Initial-layout attribution and full-scroll/Lighthouse profiling are the next S5 slice;
no performance improvement is claimed from this compatibility work.

## Tinted-band layout fix

The tinted sections (`#work`, `#certifications`, `#writing`) carried their
background on the same element as `.wrap`, so the tint painted only the 1180px
content column and text sat flush against the panel edge. The tint now runs
edge to edge while its content keeps the page measure: `--gutter` (24px mobile,
40px from 768px) drives both `.wrap` and the bands' `padding-inline: max(var(--gutter),
calc((100% - var(--measure)) / 2))`. Measured at 1440px and 390px, band content
starts at the same x as untinted sections (130px and 24px).

Two related fixes: `.writing-row` hover used `var(--surface)` inside a
`var(--surface)` band, so hover was invisible; it now uses `--surface-raised`.
Projects and Writing were the only sections without scroll reveals; both now use
the shared `reveal` tokens, per-project triggers, and the reduced-motion guard.

## Hero topology: ambient branch loop

Requested change: the hero diagram animated once per page load. It now keeps a
slow ambient pass — trunk plus one branch draw with `stroke-dashoffset`, hold,
fade — with a 2.6–4.4 s random gap between passes. The branch side is random,
capped at two identical sides in a row so a run never reads as stuck. The
right-hand branch (`image → kubernetes`) gained its own accent paths; before this
only the left branch had them.

This reverses the S1 deferral in `REBUILD_SPRINT_PLAN` §tradeoffs ("initial release
uses one finite topology sequence, then rests") and takes up rebrand §11/§22's
6–8 s pulse, at a shorter interval. It is also the stroke-drawing exception the
art-direction gate calls out, so the constraints that keep it cheap are:
reduced motion runs nothing, the loop idles while the figure is off-screen
(IntersectionObserver) or the tab is hidden, and only two or three small paths
animate per pass.

State model: `data-motion-state` still reaches `complete` after the 1.08 s
entrance — the figure element itself has no resting-style churn — and
`data-ambient` carries `idle`/`running` for the loop. `motion-profile.spec`
now asserts the accent group keeps changing while the figure rests, the inverse
of its old anti-loop guard; `signature.spec` watches ~28 s and requires both
branches to be drawn.

Verified with system Chrome: passes alternated at 3.8 s, 10.7 s, 22.3 s and 35.0 s,
and switching to `prefers-reduced-motion: reduce` returned `data-motion-state=static`,
`data-ambient=idle`, and every accent path to opacity 0.

The two previously recorded GSAP tween-leak failures were harness false positives:
the global-timeline count included GSAP startup and ScrollTrigger refresh callbacks
whose targets are functions, not detached page elements. The lifecycle assertions now
use the existing element-targeted diagnostic; explicit component cleanup was retained.

## Motion pass: page-wide text interaction

The rebuild had entrance reveals but nothing that answered the visitor. The old
site's character entrances, slide-in blocks and looping arrows (see `baseline.md`)
were the reference for energy, not for technique. What exists now:

| Where | Motion |
| --- | --- |
| Hero eyebrow | The discipline word flips between Cloud, Platform, DevOps and Kubernetes on two stacked layers. The job title never rotates. |
| Every `h1`/`h2` | Words arrive from 18px left, staggered 35 ms, opacity 0.86 to 1 — never hidden. |
| Section eyebrows | Characters type in from 0.35 opacity on scroll-in. |
| Links, buttons, nav | Characters jump 5px on hover and on keyboard focus. |
| `h3` in writing, capabilities, certifications, projects, career | Characters flip 360° on hover, 22 ms apart. |
| Writing rows | An accent rule wipes left to right under the row. |
| Capability cards | The card shifts 3px and its rule turns accent. |
| About | Copy slides in from the left, the education column staggers, and its rail draws itself. |
| Top of viewport | A two-pixel scroll indicator, scrubbed by document scroll. |
| Hero topology | The ambient branch redraw described above. |

Splitting happens at runtime in `textMotion.ts` and only when JavaScript is
present and reduced motion is off: the served HTML, the accessible names, and
the no-JavaScript reading experience are unchanged, and every splitter returns a
restore function that puts the original markup back. Verified: with
`prefers-reduced-motion: reduce` the page has 0 split elements, 0 character
spans, no rotator animation, and no scroll indicator.

Three defects this pass exposed and fixed, all pre-existing:

- `.secondary-credential span`, `.eyebrow span`, `.credential-strip span` and
  `.identity span` were descendant selectors written for one child span each.
  They also matched the split spans and, being more specific than `.char`,
  blockified them — the AWS credential link collapsed to 13px wide and 841px
  tall, breaking the 44px touch-target check. All are now scoped to the direct
  child they were written for.
- Split characters inside a flex control (`.text-link`, `nav a`) made the
  container size itself from its items' min-content. Those two controls are now
  `inline-block`, which keeps the 44px target and lets characters lay out as
  text; elements still using flex (`.button`) move as a whole instead of per
  character.
- `.writing-row:hover` used `var(--surface)` inside the `var(--surface)` band.

Accessible names survive the split because `splitChars` sets the element's
original text as `aria-label` while it is split (inline-block characters would
otherwise be announced letter by letter) and removes it on restore.

## Sprint 5 closeout — 2026-09-16

Sprint 5 is locally complete. The final audit added technical SEO and AI-search
discovery coverage, corrected fragmented native link underlines, restored complete
accessible names on credential/writing links, and fixed WebKit's cross-document
résumé-to-contact fragment alignment after font layout settles.

- Build, lint, typecheck, and 13/13 static/render tests passed.
- The full Chrome regression suite passed 52/52.
- 33/33 focused checks passed across Chrome, Firefox, and WebKit.
- Lighthouse: Performance 94, Accessibility 100, Best Practices 100, SEO 100,
  Agentic Browsing 100; CLS 0.025.
- Added canonical résumé metadata, updated sitemap dates, richer Person/ProfilePage
  JSON-LD, a crawler-readable `llms.txt`, and durable SEO/GEO reports.
- Project text actions are no longer split into character boxes. Their 1px underlines
  render as continuous rules, and arrow glyphs stay outside the decoration.

See [QA](qa.md), [SEO audit](seo-audit.md), and
[GEO analysis](../../GEO-ANALYSIS.md). Shipping Safari/iPhone, physical Android,
screen-reader sampling, field Core Web Vitals, index coverage, and live AI citations
remain external release evidence—not hidden requirements for this local checkpoint.

The bounded ambient topology redraw remains a recorded exception to S5.1's original
no-loop wording. It pauses offscreen and on hidden tabs, and reduced motion disables it.
No deployment or Sprint 6 work was performed.
