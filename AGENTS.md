# litjs-typeahead

A Lit 3 + TypeScript typeahead web component.

## Quick start

- Install: `npm i`
- Build: `npm run build`
- Watch build: `npm run build:watch`
- Dev server: `npm run serve` (open http://localhost:8000/dev/index.html)
- Tests: `npm test` or `npm run test:dev` / `npm run test:prod` / `npm run test:watch`

## Source layout

- `src/typeahead/typeahead.ts` — `LitTypeahead` class (no implementation yet)
- `src/typeahead/index.ts` — defines `<lit-typeahead>` and re-exports the class
- `src/test/typeahead_test.ts` — component tests
- `dev/index.html` — dev demo page
- `index.html` — site demo page (uses the `typeahead.bundled.js` bundle)
- `docs-src/` — documentation site source (not currently built)

## Conventions

- TypeScript with strict settings in `tsconfig.json`.
- `module` is `esnext` and `moduleResolution` is `bundler` to support modern ESM package resolution.
- `tsc` compiles `src/` into the repo root (`typeahead/`, `test/`).
- Generated build artifacts (`typeahead/*.js`, `test/*.js`, `*.bundled.js`, `custom-elements.json`, `docs/`) are ignored; run `npm run build` when needed.
- Keep docs in sync with the component: any change that impacts the component's usage or behavior must also update `README.md`, the demo pages (`dev/index.html` and `index.html`), and `src/test/typeahead_test.ts` (tests) in the same change.
- Lint and docs scripts reference missing starter configs (`.eslintrc.json`, `.prettierrc.json`, `.eleventy.cjs`) and will not work until those are added.

## Verification

1. `npm i`
2. `npm run build`
3. `npm run test:dev`
4. `npm run serve` and open `http://localhost:8000/dev/index.html`
