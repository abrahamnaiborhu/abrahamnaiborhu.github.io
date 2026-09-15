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

- S3.2: Keyless CI/CD and Production-Lite GCP, distinct diagrams, finite entry motion.
  Show authentication before remote-state access and NAT as outbound-only connectivity.
- S3.3: Four concise capability groups with technology lists and scroll-distance review.
- C3 remains open until all three projects and capabilities are complete.

No deployment, push, résumé replacement, domain change, or later-sprint work performed.
