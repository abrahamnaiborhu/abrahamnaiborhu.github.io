# Sprint 4 — Career, writing, and contact

## S4.1 — Career and credentials

Implemented a single-column, reverse-chronological timeline from rebrand spec §§1.6/15:
PointStar (Application Engineer), Hand Global Solutions (Oracle NetSuite Technical
Consultant), Indomaret (VB.NET Developer), and Mattel (Software Engineer Intern).
Dates and locations match the supplied facts; machine-readable time elements are included.
The 11-application Mattel count is supplied, not estimated. No new impact metrics,
client architecture, internal project details, or completed future Kubernetes work added.

The full credentials section reuses the same four-item data source as the hero strip:
PCA, CKA, Terraform Associate (004), ACE. Identical styling gives all four equal weight.
AWS Academy Cloud Foundations is separated as additional training. Verification links,
credential dates, and expiry status remain absent because none were supplied.

The frontend skill informed the unboxed editorial layout, shared tokens, fine timeline
rail, and readable text. This slice delivers the static timeline. The spec's scrolling
rail/entry effects are explicitly deferred to S5 motion refinement; there is no new
scroll listener, dependency, or hidden content. No-JavaScript/reduced-motion rendering
shows the complete history. Existing hero and project animations are unchanged.

## Verification

- 7 static tests, lint, typecheck, production build.
- All 36 Chrome browser tests passed (48.4s), including career/credential assertions at 390/768/1440px
  without JavaScript and with reduced motion. Broader overflow checks cover 320–1440px.
- Screenshots reviewed for the mobile timeline and desktop credentials; all three widths captured.
- Keyboard navigation, reload CSS delivery, slow hydration, project animation cancellation,
  and Strict Mode cleanup remain covered by the existing tests.
- JS 236.94 kB (81.25 kB gzip), CSS 12.19 kB (3.20 kB gzip).
- Synthetic 4× CPU initial-load trace: max layout 139.606ms, paint 15.22ms,
  function call 29.807ms. Initial-layout attribution remains an S5 item, not a passed
  real-device or field-CWV performance claim.

Captures: [mobile timeline](captures/sprint4-experience-390.png),
[desktop timeline](captures/sprint4-experience-1440.png),
[mobile credentials](captures/sprint4-certifications-390.png),
[desktop credentials](captures/sprint4-certifications-1440.png).
Fixed navigation/skip-link overlays are hidden only for clipped section captures.
Full-page captures retain the real page. Earlier sprint baselines are preserved.

## Remaining

S4.2: four curated writing rows. S4.3: About, education, languages, contact and footer.
Current résumé, confirmed LinkedIn destination, and optional real credential verification
URLs remain release inputs. The obsolete CV is not reused. C4 is not complete.

No push, deployment, domain change, or external account mutation.
