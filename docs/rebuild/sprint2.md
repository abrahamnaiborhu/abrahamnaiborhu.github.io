# Sprint 2 — Direction A signature slice

Implemented locally 2026-09-15. **C2 visual review is ready; no deployment.**

## Delivered

- S2.1: sticky navigation, active-section underline, mobile modal drawer, no-JavaScript details fallback, résumé availability anchor, and About destination.
- S2.2: approved headline/subtitle, personal identity, real GitHub/Dev.to links, and the unboxed conceptual infrastructure diagram.
- S2.3: four equal-weight primary credentials immediately after the hero; compact capabilities-to-Work transition.

The original dark palette, dominant typography, negative space and restrained geometry remain the comparison criteria. The signature visual is secondary to the headline. No neon, loader, scroll hijack, recurring pulse or fabricated deployment status was added.

## Review captures

- [Desktop hero](captures/sprint2-desktop-hero.png)
- [Desktop full page](captures/sprint2-desktop-full.png)
- [Mobile hero](captures/sprint2-mobile-hero.png)
- [Mobile full page](captures/sprint2-mobile-full.png)
- [Mobile drawer](captures/sprint2-mobile-drawer.png)
- [Original Direction A study](captures/direction-a-desktop-hero.png)

Work remains directly reachable from the hero. On mobile the topology adds reading distance before credentials and Work; retain the direct CTA and compact capability section as full case studies are added. The diagram is not pinned and does not delay access to content.

## Behavior and implementation

The drawer uses native `dialog.showModal()` to make the background inert, with explicit Tab wrapping, close-button focus, Escape handling, overflow restoration and resize closure. Selecting a section closes the drawer and focuses that destination. Resizing to desktop returns focus to the first desktop link. Before JavaScript, the same Menu control opens a native details navigation, avoiding hydration-dependent control replacement.

The diagram has one GSAP timeline ending at **1.08 seconds**: visible nodes gain emphasis, a blue highlight travels along three connector segments, then all motion rests. It animates opacity/transform, not SVG stroke geometry. Its complete static diagram is present in HTML. Reduced-motion changes revert the scoped timeline, including its visual state; the headline and links never depend on animation.

Sources checked: [native modal behavior](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal), [GSAP timelines](https://gsap.com/docs/v3/GSAP/Timeline/), and the [existing React/GSAP integration decision](../decisions/001-static-react-foundation.md).

## Verification

Build, new-source lint, strict typecheck and the three static-rendering contract tests pass.
All **28 browser tests pass** (33.6 seconds on the final run). Coverage includes:

- JS enabled/disabled at 320, 375, 390, 430, 768, 1024, 1280 and 1440px; no horizontal overflow.
- Skip link and real Work anchor, with visible keyboard focus.
- Drawer entry/exit focus, Tab wrap, Escape, close-on-navigation, scroll restoration at a nonzero scroll position, and mobile-to-desktop resize.
- Real mobile no-JavaScript navigation and direct hash/active-section feedback.
- Four primary credentials, conceptual diagram labeling and exact H1.
- Finite timeline completion, live reduced-motion cancellation, Strict Mode cleanup, and 6.5 seconds with no further diagram style mutations after completion.
- Styles available without scripts on initial load and reload in development and production. The earlier flash-of-unstyled-content fix remains intact.
- Slow-load development hydration and a 4× CPU-throttled Chrome trace.
- Mobile metadata at 14px, with SVG text scaled to at least 14px at 320px viewport width.

The initial acceptance tests failed on missing navigation/diagram. The first drawer implementation exposed a reverse-Tab focus issue, reproduced by the test and fixed with explicit wrapping.

Latest synthetic trace: [summary](captures/sprint2-motion-profile.json). The full Chrome trace is generated under the ignored Playwright `test-results/` directory and attached to its test result. Trace Layout/Paint/FunctionCall timings include initial loading; they are not field Core Web Vitals or a 60fps guarantee. The final 4× trace recorded a maximum layout event of 115.168ms, maximum paint of 6.454ms and maximum FunctionCall of 21.199ms. The layout event needs further attribution in S5; no full performance certification is claimed. Real-device and broader performance profiling remain S5 work.

Final bundle snapshot: 225.45 kB JavaScript / 77.83 kB gzip; 8.07 kB CSS / 2.38 kB gzip. No new runtime dependency was added in this sprint.

## Remaining boundaries

The résumé actions lead to an explicit availability note because the current PDF is missing. LinkedIn is not enabled until its destination is confirmed. No credential verification URLs were invented. Credentials/capabilities stay static rather than adding more entrance sequences around the signature animation. The header uses an opaque/translucent dark surface without a backdrop-blur effect.

Work case studies, the complete experience timeline, full Writing, About/Education and remaining certification details are later-sprint content. Existing shell headings are not a claim those sections are finished. Domain cutover, dependency audit availability and legacy tooling debt remain open from S1.

**C2 decision:** review the desktop/mobile signature composition before repeating its design language throughout Sprint 3. Recommended: keep Direction A and proceed to the first complete engineering case study.
