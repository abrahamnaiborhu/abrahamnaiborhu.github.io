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

S4.3: About, education, languages, contact and footer.
Current résumé, confirmed LinkedIn destination, and optional real credential verification
URLs remain release inputs. The obsolete CV is not reused. C4 is not complete.

No push, deployment, domain change, or external account mutation.

## S4.2 — Curated writing complete

Replaced the writing placeholder with four numbered editorial rows, using the exact
titles and order from spec §17. The frontend skill informed text-first rows, fine rules,
topic metadata, and subtle hover feedback in the existing Direction A palette. Each
row is a single link with its title as the accessible name. Focus gets the same color
feedback as hover plus the existing outline. Arrow translation is 3px over 180ms only
when reduced motion is not requested. No thumbnails, timers, or runtime API calls.

Verification on 15 September 2026: the public Dev.to author listing returned HTTP 200;
each article's individual API endpoint also returned 200 and an exact title match:

- [Drift detection and recovery](https://dev.to/abrahamnaiborhu/terraform-drift-detection-and-recovery-on-google-cloud-plan-import-state-and-github-actions-3a83)
- [Plan on PR, apply with approval](https://dev.to/abrahamnaiborhu/terraform-cicd-with-google-cloud-plan-on-pull-request-and-apply-with-approval-3h3m)
- [Production-Lite platform](https://dev.to/abrahamnaiborhu/terraforming-a-production-lite-gcp-web-platform-mig-cloud-nat-load-balancer-and-private-backends-1bfg)
- [Terraform foundation](https://dev.to/abrahamnaiborhu/building-a-gcp-terraform-foundation-vpc-iam-and-remote-state-54jp)

The optional fifth article is omitted to keep the selection focused. The archive CTA
links to the verified author profile. Articles open in the same tab; ordinary browser
modifier keys remain available to open another tab.

8 static tests, lint, typecheck, build, and all 37 browser tests passed (47.1s).
New browser coverage checks all five writing links in keyboard order, exact destinations,
visible focus, reduced-motion arrow behavior, and long-title wrapping at 390/768/1440px
without JavaScript. Inspected [mobile](captures/sprint4-writing-390.png) and
[desktop](captures/sprint4-writing-1440.png); [tablet](captures/sprint4-writing-768.png) captured.

Build: JS 238.74 kB (81.66 kB gzip), CSS 13.24 kB (3.39 kB gzip). No dependencies added.
Latest synthetic 4× CPU load trace: max layout 127.519ms, paint 8.184ms, function call
27.133ms. The existing initial-layout investigation remains in S5; no field-CWV claim.
Reload styling, existing motion cleanup, navigation, and static content checks remain green.

S4.3 and C4 remain open. Current résumé and confirmed LinkedIn are still release inputs.
No push or deployment.
