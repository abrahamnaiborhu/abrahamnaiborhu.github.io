# Sprint 5 QA report

Completed locally on 2026-09-16. No deployment or production mutation was performed.

## Quality gates

| Gate | Result |
| --- | --- |
| Production build | Pass |
| ESLint | Pass |
| TypeScript | Pass |
| Static/render contracts | 13/13 pass |
| Full Chrome regression suite | 52/52 pass |
| Chrome/Firefox/WebKit matrix | 33/33 pass |
| Lighthouse | Performance 94; Accessibility 100; Best Practices 100; SEO 100; Agentic Browsing 100 |
| Lighthouse loading metrics | FCP 1.5s; LCP 1.5s; Speed Index 1.5s; TBT 270ms; CLS 0.025; TTI 2.1s |

Lighthouse used a local production build, 412×823 mobile viewport, simulated 4× CPU
slowdown, 150ms RTT, and about 1.64 Mbps throughput. Results are synthetic lab data,
not field Core Web Vitals.

## Motion and performance recording

The saved local Chrome stress recording used 4× CPU throttling and a scripted 8161px
full-page scroll over 5.016s. It sampled 301 frames: median 16.7ms, p95 16.8ms, maximum
16.8ms, with 100% at or below 20ms. The maximum Paint was 6.486ms. Four long tasks were
observed, with a 148ms maximum; the largest Layout event was 100.306ms during initial
full-document layout. This evidence supports smooth sampled scrolling but is not a
physical-device 60fps certification.

## Browser and accessibility coverage

The three-engine matrix covers widths 320, 375, 390, 430, 768, 1024, 1280, 1440, and a
1920px desktop; 14px minimum mobile text; 44px targets; heading structure; accessible
graphics; a 200% reflow proxy; reduced motion; no-JavaScript navigation; keyboard drawer
focus; résumé download/contact flow; and continuous link underlines.

The audit found and fixed:

- Per-character link splitting fragmented native underlines. `.text-link` is now a flex
  control animated as one element, with a consistent 1px continuous underline and an
  undecorated atomic arrow.
- Credential and writing links had accessible names that did not include all visible text.
- WebKit could resolve the résumé's cross-document `#contact` fragment before font layout
  settled; the initial deep link is now realigned after fonts are ready.
- Nonessential per-character hover splitting now waits for the visitor's first interaction,
  and the page-wide text enhancer mounts during browser idle time. This preserves the
  motion language while reducing Lighthouse TBT and layout shift.

Visual inspection of the final project actions confirms continuous rules under “View
repository” and “Read case study”, with no dash fragments under individual letters.

## Explicit limitations

- WebKit automation is not the shipping Safari application or an iPhone device test.
- Actual 200% browser zoom, VoiceOver/NVDA sampling, and a real mid-range Android trace
  remain release checks if the project later resumes.
- The ambient topology redraw is a documented design exception to the original no-loop
  criterion. It is bounded, offscreen/hidden-tab paused, and disabled for reduced motion.
- Search Console index coverage, field Core Web Vitals, and AI-platform citations require
  production data and are not inferred from these local results.

## Artifacts

- [Lighthouse HTML](captures/sprint5-lighthouse.report.html)
- [Lighthouse JSON](captures/sprint5-lighthouse.report.json)
- [Performance profile](captures/sprint5-performance-profile.json)
- [SEO audit](seo-audit.md)
- [GEO analysis](../../GEO-ANALYSIS.md)
