# GEO / chatbot-engine optimization analysis

Audited 2026-09-16. This is an implementation-readiness assessment for answer engines
and AI-assisted search, not evidence that a platform currently cites or ranks the site.

## Executive summary

**Estimated GEO readiness: 90/100**

| Dimension | Score | Evidence |
| --- | ---: | --- |
| Passage citability | 21/25 | Clear role, project problem/architecture/outcome boundaries, credentials, and first-person experience facts. |
| Structure | 20/20 | Prerendered semantic HTML, one H1, ordered sections, descriptive headings, HTML résumé, and stable anchors. |
| Multi-modal context | 12/15 | The topology and architecture diagrams include accessible text equivalents; there is intentionally little image/video content. |
| Entity and authority signals | 17/20 | Stable Person identity, employer, university, credentials, GitHub, LinkedIn, DEV articles, and consistent `.com` canonical URLs. |
| Technical access | 20/20 | Wildcard crawler access, sitemap, `llms.txt`, JSON-LD, static HTML, and no-JavaScript readability. |

Estimated platform readiness: **Google AI Overviews 92/100**, **ChatGPT search 90/100**,
and **Perplexity 86/100**. These are heuristic readiness scores, not observed citations.

## Crawler access and discovery

- `robots.txt` allows all crawlers and references the canonical sitemap. GPTBot,
  OAI-SearchBot, ChatGPT-User, PerplexityBot, Googlebot, and Bingbot therefore inherit
  access from the wildcard rule.
- `llms.txt` now gives answer engines a concise identity summary, primary pages,
  selected engineering work, professional profiles, credentials, and contact path.
- The production build contains the full content before JavaScript runs. Hydration and
  animation are enhancements rather than requirements for reading or navigation.
- Current policy also permits training-oriented crawlers. No RSL or explicit opt-out was
  added because that is a publishing/licensing decision, not a technical default.

## Entity and schema assessment

The homepage emits a `ProfilePage` whose `mainEntity` is a stable `Person`:

- Name: Abraham Naiborhu; alternate name: Abraham Pardomuan Naiborhu.
- Role: Application Engineer at PointStar PTE LTD.
- Education: President University.
- Expertise: Google Cloud, Kubernetes, Terraform, CI/CD, and DevOps.
- Identity reconciliation: canonical portfolio, GitHub, DEV, and confirmed LinkedIn.

This is appropriate schema for a personal professional portfolio. FAQ schema is neither
necessary nor recommended here. Future schema should only describe content visible on the
page and should not turn credentials or projects into claims the page cannot substantiate.

## Most citable content

1. The three selected-work sections: each states the engineering problem, architecture,
   trade-offs, implementation evidence, and limits, with source/article destinations.
2. Technical-writing rows and linked DEV articles: these provide the long-form context
   answer engines need without compromising the homepage's visual restraint.
3. Experience, credentials, education, and résumé: these establish a consistent person,
   role history, and subject-matter footprint.

The homepage should stay concise. For stronger citations, add concrete measurements,
diagrams, dates, and lessons learned to the linked case studies—not generic “expert” copy.

## Brand-mention assessment

Verified/declared first-party links include GitHub, DEV, LinkedIn, the canonical domain,
and credential issuers. A public spot search also surfaced other Abraham profiles and
writing, but there is no verified Wikipedia, Reddit, YouTube, or major publication signal.
That is not a defect for a personal engineering portfolio; earned technical references and
high-quality articles are more useful than manufacturing low-value mentions.

## Prioritized next actions

1. After authorized publication, verify `/llms.txt`, `/sitemap.xml`, homepage, and résumé
   return 200 on the canonical domain, then request indexing through Search Console.
2. Keep role, employer, profile URLs, and credential wording synchronized across the site,
   résumé, LinkedIn, GitHub bio, and DEV author bio.
3. Add evidence-rich updates to the three case studies: exact constraints, measurable
   results, annotated architecture, and last-reviewed dates.
4. Monitor real citations/mentions in Google AI Overviews, ChatGPT, and Perplexity before
   treating any readiness estimate as business performance.

## Evidence

- [SEO audit](docs/rebuild/seo-audit.md)
- [Sprint 5 QA report](docs/rebuild/qa.md)
- `public/llms.txt`, `public/robots.txt`, `public/sitemap.xml`, and homepage JSON-LD.
