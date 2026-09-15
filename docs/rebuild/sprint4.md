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
Current Resume, confirmed LinkedIn destination, and optional real credential verification
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

S4.3 and C4 remain open. Current Resume and confirmed LinkedIn are still release inputs.
No push or deployment.

## S4.3 — Page sections implemented; release inputs pending

Added About, education, languages, email-first Contact, and Footer from spec §§18–20.
The frontend skill informed a restrained two-column About layout on desktop, stacked
content on smaller screens, and typography/rules matching the rest of Direction A.
Education results and language proficiency reproduce user-supplied facts. No phone,
unapproved client detail, or invented achievement is published.

Contact has a working mailto action, visible email address, GitHub and Dev.to links.
The footer includes the full identity/location, compact copyright identity (2026, the
current implementation year), public social links, and native back-to-top navigation.
Review the copyright year during annual releases. No runtime clock is needed for hydration.

The current Resume has not been supplied, and LinkedIn confirmation remains outstanding.
Both were requested from the user. No obsolete CV or guessed replacement is shipped;
Resume anchors still reach the explicit availability notice. Contact copy therefore
mentions email only; LinkedIn is not presented as an available action yet.

Verification: 9 static tests, lint, typecheck, and production build pass. The full browser
run passed 38/39 tests; the new contact test initially expected focus-visible after
pointer navigation. Corrected the test to Tab onto the email link, without changing
production focus styles. Both contact tests then passed (7.7s), so all 39 test cases have
passing results across the full run and targeted rerun. Keyboard path covers Work →
Resume notice → email → GitHub → back to top; no email is sent by the test.

No-JavaScript captures cover 390/768/1440px. Inspected [desktop About](captures/sprint4-about-1440.png)
and [mobile Contact](captures/sprint4-contact-390.png). All earlier reload, hydration,
navigation, reduced-motion, and cleanup checks remain passing.

Build: JS 241.00 kB (82.22 kB gzip), CSS 14.15 kB (3.60 kB gzip). No dependencies added.
Latest synthetic 4× CPU load trace: max layout 131.627ms, paint 8.215ms, function call
26.096ms. Initial-layout attribution remains S5 work, not field-performance certification.

S4.3 and C4 are deliberately not marked complete: current Resume integration and a
confirmed LinkedIn destination remain required by their acceptance criteria. Page
structure is implemented and reviewable. No deployment, push, or domain changes.

### LinkedIn confirmation

The user confirmed `https://www.linkedin.com/in/abrahamnaiborhu`. Added it to the
shared profile, Contact secondary action, and Footer. Contact copy now mentions both
email and LinkedIn. Confirmation is user-supplied, not a claim that LinkedIn's automated
access restriction was bypassed. Updated the keyboard-order regression for the new link.
The Resume file is still missing; S4.3/C4 remain open only for that required integration.

### CV Markdown located and Resume integrated

The user identified `rules/Abraham Naiborhu.md` as their current CV. It supplies the
career/education content and five real Credly destinations; it was read in full.
All five supplied badge URLs returned HTTP 200 with matching credential titles.
ACE redirects to another badge ID; retained the supplied working redirect URL.
This checks destinations/titles, not independent identity or expiry certification.

Resume links now open `/resume.html`, a standalone, script-free reading view with a
download action for `/Abraham-Naiborhu-Resume.pdf`. Contact also offers direct download.
Shared credential data powers the five public badge links. The source Markdown is
unchanged and is not served from the rules directory. The typeset Resume condenses
career bullets and uses the previously audited project summaries: no new claim of
deployed high availability or drift detection in the specific CI/CD workflow. Internal
project names remain omitted. Full education details and languages are retained.

PDF visual review initially found a third page containing only Languages. Tightened
print spacing without reducing the 10pt body text. PDFKit confirms two pages with
extractable text (2524 and 1558 characters); both pages were visually inspected.
The output includes a structure tree, but this is not a PDF/UA compliance claim.
A regression checks the generated Chromium PDF's page dictionaries and HTML alternative.

The 46-test browser audit includes successful Resume view → PDF download → contact
navigation. After pagination correction, static/build checks and the focused contact
suite are rerun. S4.3 implementation is complete; C4 is ready for user review. No Resume
or LinkedIn input is still missing. S5 cross-browser/performance review remains open.
