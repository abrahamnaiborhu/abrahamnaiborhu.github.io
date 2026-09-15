# Abraham Naiborhu — portfolio rebrand

Direction A: a calm, typography-led cloud/platform engineering portfolio. Sprint 2 adds the
responsive navigation, finite hero animation and credential strip to the static-readable
React/TypeScript foundation. Full project/content sprints are not complete.

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

## Architecture and review

`src/App.tsx` and `src/rebrand/` are the active application. `scripts/render.tsx` uses the same
App/public data to generate HTML. The older `src/App.jsx`, components and assets are retained
as reference, not imported into the rebuilt shell. No files from `rules/` are published.

- [Static-rendering decision and dependency constraints](docs/decisions/001-static-react-foundation.md)
- [Sprint 0 design packet](docs/rebuild/README.md)
- [Sprint 1 checkpoint](docs/rebuild/sprint1.md)
- [Sprint 2 signature review](docs/rebuild/sprint2.md)
- [Sprint 3 engineering evidence — first case study](docs/rebuild/sprint3.md)

Do not run the legacy deploy command as a release step yet: its domain remains `.me`, while
the proposed `.com` cutover still requires verification. No deployment has been performed.
