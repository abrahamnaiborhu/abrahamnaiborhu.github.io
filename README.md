# Abraham Naiborhu — portfolio rebrand

Direction A: a calm, typography-led cloud/platform engineering portfolio. Sprints 1–3
deliver the static-readable React/TypeScript foundation, responsive navigation, finite hero
animation, credentials, capability inventory, and three evidence-led engineering case studies.
Sprint 4 adds career, credentials, writing, About, contact, and the current résumé.
Sprint 5 motion and accessibility auditing is in progress. This is not a production release.

## Development

Use Node from `.nvmrc` (tested with 24.8.0), then:

```sh
npm ci
npm run dev
```

| Command | Purpose |
|---|---|
| `npm run lint` | New TypeScript application and active tooling |
| `npm run lint:legacy` | Historical JS audit; existing failures are expected |
| `npm run typecheck` | Strict TypeScript verification |
| `npm test` | Static content and rendering contract tests |
| `npm run build` | Vite assets plus mandatory HTML prerender |
| `npm run preview` | Inspect production output, including with JS disabled |
| `npm run test:browser` | Chrome checks; run build first; ports 4174/5174 must be free |

Browser tests use installed Google Chrome; alternatively install its Playwright channel with
`npx playwright install chrome`. They start and stop their own local test servers.

For the focused Chrome/Firefox/WebKit compatibility matrix (build first):

```sh
npx playwright install firefox webkit
CROSS_BROWSER=1 npm run test:browser
```

Use the same `PLAYWRIGHT_BROWSERS_PATH` for installation and execution if using a
custom browser cache. This matrix covers accessibility checks and core navigation;
the default Chrome suite retains the broader coverage and Chrome-only tracing.
WebKit automation does not replace testing the shipping Safari app or an iPhone.

## Architecture and review

`src/App.tsx` and `src/rebrand/` are the active application. `scripts/render.tsx` uses the same
App/public data to generate HTML. The older `src/App.jsx`, components and assets are retained
as reference, not imported into the rebuilt shell. No files from `rules/` are published.

- [Static-rendering decision and dependency constraints](docs/decisions/001-static-react-foundation.md)
- [Sprint 0 design packet](docs/rebuild/README.md)
- [Sprint 1 checkpoint](docs/rebuild/sprint1.md)
- [Sprint 2 signature review](docs/rebuild/sprint2.md)
- [Sprint 3 engineering evidence — three case studies](docs/rebuild/sprint3.md)
- [Sprint 4 career and content review](docs/rebuild/sprint4.md)
- [Sprint 5 motion/accessibility audit](docs/rebuild/sprint5-audit.md)

The résumé source is typeset by `npm run resume:generate` using installed Chrome.
Review and commit both `public/resume.html` and `public/Abraham-Naiborhu-Resume.pdf`
after updating `scripts/resume.tsx` or the shared content it imports. Normal builds
copy these reviewed artifacts and do not require Chrome.

Do not run the legacy deploy command as a release step yet: its domain remains `.me`, while
the proposed `.com` cutover still requires verification. No deployment has been performed.
