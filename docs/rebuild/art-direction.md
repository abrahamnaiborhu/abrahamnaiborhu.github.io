# Art direction and motion study

Status: Direction A is the working direction following its recommendation and Abraham's instruction to continue. Sprint 0 studies remain static; [Sprint 1](sprint1.md) implements the readable foundation and sample motion.

## A — Quiet confidence (recommended)

Typography leads, with an unboxed, subdued topology on the right. The 72px desktop headline and generous dark space retain the strongest qualities of the existing site. Work uses an open editorial row with a single architecture surface, rather than a dashboard of cards.

[Desktop hero](captures/direction-a-desktop-hero.png) · [Desktop Work](captures/direction-a-desktop-work.png) · [Mobile study](captures/direction-a-mobile-full.png)

## B — Systems in view

A more balanced 7/5 hero, 64px desktop headline and boxed topology give engineering visuals more weight. The Work story sits within a subtle bordered surface. This is more explicit about systems, but slightly less close to the original site's open composition.

[Desktop hero](captures/direction-b-desktop-hero.png) · [Desktop Work](captures/direction-b-desktop-work.png) · [Mobile study](captures/direction-b-mobile-full.png)

## Shared guardrails

Graphite/off-white base with small blue/cyan accents, 1180px maximum content width, 44px mobile headline and stacked mobile CTAs. No photography is required for the hero. The figure is explicitly conceptual; green dots are illustrative, not live health indicators. One H1; the narrative remains legible without the figure.

Previews request Inter with Arial fallback, without loading external font files. Final font delivery/licensing and font-metric checks belong to S1. Review-strip labels are review tooling, not production UI. Social labels are not pretend links. Résumé links disclose the missing current PDF. Remaining-section anchors disclose the limited preview scope.

The supplied section order is retained. On mobile, credentials/capabilities add considerable distance before Work; the direct Work CTA is therefore important. C2 must review that distance with the full shell before adding further decorative height. Do not shrink body text to compensate.

## Motion storyboard — A

| Beat | Normal-motion proposal | Reduced motion / failure |
|---|---|---|
| First paint | Headline, subtitle and CTAs visible immediately; no text splitting or loader | Same readable layout. |
| 0–500 ms after enhancement | Small metadata groups settle from 8px offset using opacity/transform; `power3.out` | No offset or delay. |
| 200–1100 ms | Static topology remains visible; a subtle accent passes source → CI/CD → branches once, using opacity/transform overlays | Static complete topology. |
| After 1100 ms | Entire diagram rests. No blinking status lights or repeated pulses | Same resting composition. |
| Work enters viewport | Nonessential visual settles 12px over 450 ms, once; content is not gated by it | Immediate static visual. |
| Hover/focus | 160 ms underline/accent feedback; arrow moves no more than 3px on pointer hover | Visible focus ring; omit movement. |

## Motion storyboard — B

| Beat | Normal-motion proposal | Reduced motion / failure |
|---|---|---|
| First paint | All hero copy and complete topology visible | Same. |
| 0–600 ms | Diagram surface settles 10px; typography stays still | Static surface. |
| 250–1450 ms | Finite three-beat emphasis: source, delivery, destinations; small blue overlay highlights, not node disappearance | Complete static diagram. |
| After 1450 ms | No ambient loop; diagram and project surface rest | Same. |
| Work enters viewport | One restrained 500 ms visual entrance, then static evidence | Immediate static content. |

Implementation gate for either direction: native scroll; scoped GSAP only where useful; cleanup on unmount and live reduced-motion changes; no hidden terminal states; no scroll hijack, infinite arrows, cursor trails, neon glow, 3D, typing effects or mandatory loader. Prefer transforms/opacity; SVG stroke drawing needs a separately profiled exception. Keyboard focus must not depend on hover.

These timings are review proposals, not measured performance or an already working motion demo. Validate on real mobile hardware in later sprints.

## Verification and C0

Chrome checks at 1440×1000 and 390×844: both directions have one H1, zero broken internal anchors, zero page exceptions and no horizontal overflow. Default A headline remains visible with JavaScript disabled. Both studies are static under reduced motion. Desktop hero/Work and complete mobile captures were visually inspected. [Raw check results](captures/preview-browser.json).

This is not cross-browser certification, a full accessibility audit or an Awwwards score. Production runtime is unchanged.

- [x] Two concrete desktop/mobile compositions delivered.
- [x] Existing elegance mapped to screenshot evidence.
- [x] Motion storyboards and missing-content handling documented.
- [x] Proceed with recommended A following Abraham's instruction to continue.
- [x] Record A as the working direction for foundation tokens; review the signature slice again at C2.
