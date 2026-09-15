# Sprint 3 — Engineering evidence

## S3.1 complete · 15 September 2026

The first vertical slice replaces the Work placeholder with GCP Terraform Foundation.
Direction A continues from the user's approval to proceed: graphite canvas, large type,
fine rules, blue architecture accents, and an unboxed two-column composition on desktop.
Mobile stacks the same content without hiding the architecture.

- Typed public project data, reusable presentation, supported highlights, and technology list.
- Repository and article links; absent optional repositories do not generate empty destinations.
- Semantic HTML diagram explains bootstrap, remote state, and foundation modules. All information
  remains readable without JavaScript. Entry animation belongs to S3.2, not this slice.
- Explicit limitation: a learning foundation, not a complete landing zone. Subnet labels express
  intended roles, not native GCP public/private subnet types. No uptime or production claims.
- Native head stylesheet and existing hero/navigation behavior preserved. No dependencies added.

## Evidence and verification

The [public repository README](https://github.com/abrahamnaiborhu/GCP-Terraform-Foundation-Lite)
was retrieved through GitHub's API (HTTP 200). It documents separate bootstrap and foundation
stages, versioned GCS state, network/IAM modules, firewall rules and service accounts.
The [article](https://dev.to/abrahamnaiborhu/building-a-gcp-terraform-foundation-vpc-iam-and-remote-state-54jp)
was previously matched through the author's public Dev.to listing. This is documentation
verification, not an infrastructure deployment audit.

Checks: 4 static tests, typecheck, lint, production build, and 30 browser tests passed.
The existing CPU trace test was excluded: animation code is unchanged and this slice makes no
new performance claim. Browser coverage includes 320–1440px, keyboard navigation, reduced motion,
slow/blocked JavaScript, hydration, drawer behavior, and initial-load/reload stylesheet delivery.
New case-study checks cover 390/768/1440px without JavaScript and the exact repository destination.
A screenshot-only follow-up checks renamed Sprint 3 captures while retaining Sprint 2 baselines.

Build: JavaScript 228.21 kB (78.65 kB gzip); CSS 9.57 kB (2.70 kB gzip).

Screenshots: [mobile](captures/sprint3-foundation-390.png),
[tablet](captures/sprint3-foundation-768.png), [desktop](captures/sprint3-foundation-1440.png).
The sticky header is hidden only during clipped project screenshots so it cannot cover content;
full-page captures retain the real navigation.

## Remaining

- S3.3: Four concise capability groups with technology lists and scroll-distance review.
- C3 remains open until all three projects and capabilities are complete.

No deployment, push, résumé replacement, domain change, or later-sprint work performed.

## S3.2 complete · 15 September 2026

Added Keyless CI/CD and Production-Lite GCP using the existing editorial project layout.
Delivery uses two ordered workflow lanes; the platform separates public ingress, private
compute, health probes, and outbound NAT. Semantic text carries all diagram information.
The shared platform repository is intentional: CI/CD is its delivery layer, not a claim
of a separate deployed system.

Sources rechecked via public APIs (HTTP 200):

- [CI/CD article](https://dev.to/abrahamnaiborhu/terraform-cicd-with-google-cloud-plan-on-pull-request-and-apply-with-approval-3h3m)
- [Platform README](https://github.com/abrahamnaiborhu/terraform-gcp-production-lite-web-platform)
- [PR workflow](https://github.com/abrahamnaiborhu/terraform-gcp-production-lite-web-platform/blob/main/.github/workflows/terraform-plan.yml)
- [Apply workflow](https://github.com/abrahamnaiborhu/terraform-gcp-production-lite-web-platform/blob/main/.github/workflows/terraform-apply.yml)
- [Platform article](https://dev.to/abrahamnaiborhu/terraforming-a-production-lite-gcp-web-platform-mig-cloud-nat-load-balancer-and-private-backends-1bfg)

The workflow source establishes WIF before init, a fresh plan in the manual workflow,
then an environment-gated apply job with separate authentication. The PR artifact is
not reused for execution. Environment approval is described by the author's article;
live repository protection settings were not audited. Drift/recovery is listed as a
future version in this repository, so it is not attributed to this workflow. The README
example uses one instance in one zone: no highly-available deployment claim is made.

All three diagrams now receive a single 6px/opacity reveal upon intersection, lasting
0.58–0.90 seconds depending on step count. Content starts visible; no pinning, scrubbing,
loops, per-chip effects, or new dependency. Reduced motion restores static styles and
does not replay an already-started diagram when switched back. Observers disconnect
after entry and on cleanup. Delayed GSAP work uses contextSafe for scoped cleanup,
following [GSAP React guidance](https://gsap.com/resources/React/); visibility detection
uses the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

Verification: 5 static tests, lint, typecheck, build, and all 34 Chrome browser tests passed
(44.6 seconds). Added first-entry/resting-state, live reduced-motion cancellation, and
three Strict Mode unmount/remount cycles with zero leftover tweens after unmount.
Inspected 390/1440px screenshots; captured 768px as well. Screenshot-only follow-up
removes fixed navigation/skip-link overlays from clipped project captures.

Build: JS 232.96 kB (79.98 kB gzip), CSS 10.63 kB (2.91 kB gzip).
The refreshed [4× CPU initial-load trace summary](captures/sprint3-motion-profile.json)
records max layout 113.864ms, paint 8.499ms, function call 23.031ms. The known initial
layout long task still needs attribution in the performance sprint. This is synthetic
hero/load evidence, not project-scroll frame-rate or field CWV certification.

Screenshots: [delivery desktop](captures/sprint3-delivery-1440.png),
[delivery mobile](captures/sprint3-delivery-390.png),
[platform desktop](captures/sprint3-platform-1440.png),
[platform mobile](captures/sprint3-platform-390.png).

S3.3 and the final C3 checkpoint remain open. No deployment or push.
