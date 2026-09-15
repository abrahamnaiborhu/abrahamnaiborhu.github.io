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
  project cleanup tests passed. The résumé view/download/contact journey also passed.
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
  résumé view/PDF download/contact journey, and native navigation without JavaScript.
- Found and fixed a real Chrome console 404: standalone résumé HTML had no icon,
  causing an automatic `/favicon.ico` request. It now uses the existing portfolio
  inline icon. Regenerated résumé artifacts; the PDF remains two tagged pages.
  The compatibility test checks console warnings/errors throughout this journey.
- Build, lint, typecheck, and 12 static tests passed. JS/CSS sizes are unchanged.
- Full default Chrome regression suite passed: 49/49 in 56.2 seconds, including
  reload CSS delivery, slow hydration, diagram cleanup, and the existing load trace.
- Test browsers were installed in `/private/tmp/portfolio-playwright-browsers`;
  use `PLAYWRIGHT_BROWSERS_PATH` with this path to reuse that local installation.
  README documents a standard-cache installation for other machines.

The debugging skill led to reproducing the missing-resource error before fixing it.
Review confirmed the changes are limited to test configuration, compatibility coverage,
and the résumé icon; existing capture edits were not included in this checkpoint.

This is engine compatibility evidence, not Safari app/iPhone certification, full WCAG
conformance, or a visual sign-off. Actual zoom and screen-reader sampling remain open.
Initial-layout attribution and full-scroll/Lighthouse profiling are the next S5 slice;
no performance improvement is claimed from this compatibility work.
