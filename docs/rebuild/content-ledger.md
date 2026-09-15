# Rebrand content and evidence ledger

Checked 2026-09-14. Source of approved personal claims: `rules/ABRAHAM_NAIBORHU_WEBSITE_REBRAND_SPEC.md`.
“Ready” means supplied in the brief, not independently certified. Public endpoint availability is separate from verification of engineering claims.

| Item / destination section | Status | Implementation decision |
|---|---|---|
| Abraham Pardomuan Naiborhu; compact Abraham Naiborhu / identity | Ready | Replace old handles in public copy. |
| Application Engineer, PointStar PTE LTD; Sep 2025–present; Jakarta / Hero and Experience | Ready | Keep actual title; Cloud / Platform / DevOps is target positioning, not an invented employment title. |
| Hero headline and credential-led subtitle / Hero | Ready | Used verbatim in studies. |
| Infrastructure, delivery, Kubernetes/Linux, software engineering / Capabilities | Ready | Four concise capability groups, no proficiency percentages. |
| Hand Global Solutions, Oracle NetSuite Technical Consultant; Apr 2024–Sep 2025 | Ready | Replace obsolete “NOW” dates. |
| Indomaret, VB.NET Developer; Nov 2023–Apr 2024 | Ready | Use supplied role and scope. |
| Mattel, Software Engineer Intern; Nov 2022–Nov 2023 | Ready | Use supplied impact only; no invented metrics or employer-private diagrams. |
| Google PCA, CKA, Terraform Associate (004), Google ACE / Credentials and Certifications | Ready claims; missing verification links | Render names; omit verification CTA until genuine URLs supplied. Never invent IDs/expiration dates. |
| AWS Academy Cloud Foundations / Certifications | Ready secondary credential | Distinguish course/academy credential from the four primary certifications. |
| Education, GPA 3.95, Magna Cum Laude, Bangkit top 15/433, scholarship and thesis / About | Ready as supplied | Old PDF corroborates several historical details, but does not replace current brief. Keep exact institution/date wording from brief. |
| Employment descriptions / Experience | Ready at brief's public-summary level | No permission inferred for internal code, client names, screenshots, credentials or architecture. Obtain permission for new confidential detail. |
| Current résumé / navigation, Hero, Contact | Missing | Existing PDF calls Abraham a student and Mattel an ongoing internship; omits later roles/new certifications. Request replacement; do not relabel it as current. |
| On-prem Kubernetes project | Excluded from release | Future work is not completed evidence. Never ship confidential unpublished data behind a CSS flag. |
| Old website projects, WM Developer ongoing role, student-style headline | Excluded from primary release | Preserve historical files only; do not silently merge superseded facts. |

## Public destination checks

Direct HTTP checks and public APIs were used after the search tool returned inconsistent/unavailable results.

- [GitHub profile](https://github.com/abrahamnaiborhu): direct HTTP 200; public repository API returned this account's projects. Earlier search-tool 404 is superseded.
- [Dev.to profile](https://dev.to/abrahamnaiborhu): direct response successful; [public article API](https://dev.to/api/articles?username=abrahamnaiborhu&per_page=100) returned all four exact titles below.
- [LinkedIn](https://www.linkedin.com/in/abrahamnaiborhu/): automated request returned HTTP 999. **Unverified**, not classified as nonexistent; manually confirm before release.
- Intended `https://abrahamnaiborhu.com`: curl could not resolve host in this environment. Verify DNS/ownership/hosting at cutover.
- `abrahamnaiborhu@gmail.com`: supplied contact address; ready for `mailto:`. No message sent or deliverability claim.

## Engineering projects

| Project | Supplied scope | Evidence status |
|---|---|---|
| GCP Terraform Foundation | Reusable VPC modules, automated firewall provisioning, versioned GCS remote state | [Public repository candidate](https://github.com/abrahamnaiborhu/GCP-Terraform-Foundation-Lite) exists in account API; foundation article below matches. Review README/source before attaching detailed claims in S3. |
| Keyless CI/CD on Google Cloud | GitHub Actions, WIF, approval, drift detection | Matching CI/CD and drift articles below found. No uniquely matching standalone repository established; do not guess one. |
| Production-Lite GCP Web Platform | MIG, Cloud NAT, private backends, health checks, HTTP load balancer | [Public repository candidate](https://github.com/abrahamnaiborhu/terraform-gcp-production-lite-web-platform) exists in account API; matching article below. README/source audit remains S3. |

These are project narratives, not claims of enterprise-scale production operations. Conceptual preview diagrams are not deployment evidence.

## Four curated articles — exact URLs found

1. [Terraform Drift Detection and Recovery on Google Cloud: Plan, Import, State, and GitHub Actions](https://dev.to/abrahamnaiborhu/terraform-drift-detection-and-recovery-on-google-cloud-plan-import-state-and-github-actions-3a83)
2. [Terraform CI/CD with Google Cloud: Plan on Pull Request and Apply with Approval](https://dev.to/abrahamnaiborhu/terraform-cicd-with-google-cloud-plan-on-pull-request-and-apply-with-approval-3h3m)
3. [Terraforming a Production-Lite GCP Web Platform: MIG, Cloud NAT, Load Balancer, and Private Backends](https://dev.to/abrahamnaiborhu/terraforming-a-production-lite-gcp-web-platform-mig-cloud-nat-load-balancer-and-private-backends-1bfg)
4. [Building a GCP Terraform Foundation: VPC, IAM, and Remote State](https://dev.to/abrahamnaiborhu/building-a-gcp-terraform-foundation-vpc-iam-and-remote-state-54jp)

Status: URLs and exact titles verified through Dev.to's public article listing, not a full technical article audit. Ready for the Writing data model; do not invent publication dates or reading times.

## Remaining dependencies

Abraham: choose direction; supply current résumé, optional genuine credential links, and confirm LinkedIn. Hosting owner: confirm domain settings before launch. Implementer: review project evidence in S3 and recheck all links before release. Missing optional verification links do not block the readable shell.
