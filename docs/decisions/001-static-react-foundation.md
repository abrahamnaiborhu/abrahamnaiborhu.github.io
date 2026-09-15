# ADR 001 — Static HTML with React enhancement

Date: 2026-09-14. Status: implemented for the Sprint 1 checkpoint; not deployed.

## Context

The rebrand requires readable content without JavaScript and deployment to static hosting.
The old Vite entry only provided an empty React root. Direction A remains the working visual direction after Abraham asked to continue following its recommendation.

## Decision

Keep React 18.2 and the existing repository. Use TypeScript for the new application and
tokenized CSS, retaining the old JS components/assets as unimported references.
The explicit `App.tsx` imports prevent accidentally resolving the old `App.jsx`.

`npm run build` runs Vite and then a small Node/TSX renderer. The renderer injects
`renderToString(<StrictMode><App /></StrictMode>)` into exactly one template marker.
The same App and public profile data feed browser hydration. A missing or duplicate marker
fails the build rather than silently producing an empty page. Development uses Vite's
`ssrLoadModule` to inject the same renderer before serving HTML.

Only public, synchronous data is allowed in this renderer. No asynchronous Suspense data,
browser-only render branches, dates generated at render time or private unpublished data.
There is no runtime Node server to deploy. `dist/` is the complete hosting output; build scripts
and test harnesses stay outside it. Use `npm run build`, not bare `vite build`.

### Alternatives

- Hand-maintained duplicate HTML: rejected because content could diverge from React.
- New SSR framework/server: unnecessary for this one-page synchronous portfolio.
- React 19 streaming prerender: not needed to solve this bounded React 18 migration; reconsider
  if data becomes asynchronous or a framework migration is independently justified.

## Motion and design

One GSAP registration boundary and a `useGSAP`-scoped 500ms signature reveal demonstrate
cleanup. `useSyncExternalStore` subscribes to the OS preference with a conservative server
snapshot. Changing preferences reverts the previous GSAP context. The sample remains visible
even in its enhanced starting state; headline, copy and navigation never depend on animation.
No scroll plugins, smooth-scroll library or looping motion are active in the rebuilt shell.

## Selected versions and constraints

- Tested Node 24.8.0, npm 11.6.0; `.nvmrc` records the tested Node. Minimum Node 22.12.
- React/React DOM 18.2.0; GSAP 3.12.5 and @gsap/react 2.1.1 retained from the lockfile.
- Vite 7.3.6 and React plugin 5.2.0; explicit Chrome/Edge 107, Firefox 104, Safari 16 build targets.
- TypeScript 5.9.3, typescript-eslint 8.70.0; strict checking on new source, build scripts and tests.
- ESLint 9.39.5 with React plugin 7.37.5 and hooks 5.2.0 for peer compatibility with the retained
  legacy lint path. Registry flags ESLint 9 as unsupported. This is a transitional tooling
  limitation, not a security-clean claim; migrate the legacy lint path and ESLint together
  before release. Do not use forced peer overrides to move only ESLint to 10.
- Playwright 1.63.0 uses installed Chrome. Browser suites require local server permissions.
- TSX 4.21.0 is build/test tooling, not client code. Node's `--import tsx` avoids its CLI IPC
  requirement in restricted environments. Server JSX imports React explicitly.

`npm run lint` checks the new TS application, tests, build scripts and active configs.
`npm run lint:legacy` keeps the historical source debt visible separately; a clean new-shell
lint result does not mean the old JS was fixed. Legacy packages are still installed but are
not automatically imported into the new browser bundle. Their audit/removal is separate work.

## Sources checked

- [React 18 renderToString](https://18.react.dev/reference/react-dom/server/renderToString): synchronous HTML generation.
- [React 18 hydrateRoot](https://18.react.dev/reference/react-dom/client/hydrateRoot): server/client output must match.
- [React 18 useSyncExternalStore](https://18.react.dev/reference/react/useSyncExternalStore): browser subscriptions with a server snapshot.
- [Vite 7 SSR integration](https://v7.vite.dev/guide/ssr): template injection and development module loading.
- [Vite 7 migration](https://v7.vite.dev/guide/migration.html): Node requirements and explicit browser target changes.
- [TypeScript ESLint setup](https://typescript-eslint.io/getting-started/): recommended flat-config rules.
- [GSAP React integration](https://gsap.com/resources/React/): scoped hooks and context reversion, checked against installed 2.1.1 implementation.

## Consequences and limits

This is a foundation, not the complete rebrand. The signature topology, drawer, credential
strip and full case studies belong to later sprints. System fonts are currently used; no
external font request blocks content. The stylesheet is linked directly in the HTML head,
so development and production receive render-blocking CSS independently of JavaScript.
This corrects the initial development reload flash caused by importing CSS from `main.tsx`.
Vite processes the linked stylesheet into a hashed production asset; no duplicate JS CSS import is kept.

Domain/CNAME, remote deployment and the outdated Resume are intentionally unchanged.
No canonical-domain cutover is asserted before ownership and hosting are verified.
