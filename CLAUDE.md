# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this package is

`dr-mike` is a single npm package that ships **opinionated config presets** for ESLint, TypeScript, and Vitest via subpath exports in three families (`dr-mike/eslint*`, `dr-mike/tsconfig/*`, `dr-mike/vitest`). There is **no `src/`, no build step, and no test suite** — files in `eslint/`, `tsconfig/`, and `vitest/` are published as-is (see `package.json` `files` and `exports`).

A core design choice: every plugin/tool the presets need (`eslint`, `typescript`, `vitest`, every rule plugin, language services) is a real `dependencies` entry, not a peer dep. Consumers install only `dr-mike`. If a consumer installs their own copy of `eslint`/`typescript`/`vitest`, pnpm hoists theirs and dr-mike's pinned copy becomes the fallback.

## Commands

```sh
pnpm install                # install (pnpm@10.33.0; Node >=20)
pnpm typecheck              # tsc --noEmit over the vitest preset (CI runs this)
pnpm pack --dry-run         # mirrors the CI smoke check — verifies what gets published
pnpm changeset              # author a changeset before opening a PR
pnpm version-packages       # consumes changesets, bumps version (run by release bot)
pnpm release                # changesets publish (run by release bot)
```

`pnpm typecheck` is the package's only automated check. It runs against `tsconfig.check.json`, which is dev-only (not in `files`, so it isn't published) and turns on `allowJs`/`checkJs` over `vitest/index.js` and `vitest/types.d.ts`. The `.check.` name is deliberate — it keeps this config from being confused with the consumer-facing presets in `tsconfig/`. Three details in it are load-bearing — all three were verified by deliberately breaking them:

- **`vitest/index.js` carries `// @ts-check`, and the declaration file is `types.d.ts`, not `index.d.ts`.** A sibling `index.d.ts` shadows `index.js`, so TypeScript checks the declaration instead of the source and the whole guard silently stops working. Don't rename it back.
- **`skipLibCheck: false`.** `tsconfig/base.json` sets it `true` (correct for consumers), but with it on, a bad type reference *inside* `vitest/types.d.ts` is suppressed and ships. This is not hypothetical — it hid a wrong type name during this file's own development.
- **`lib: ["ES2023", "DOM"]` plus the `@types/node` devDependency.** Only needed to keep vite's and vitest's own `.d.ts` files quiet once lib checking is on. Neither affects the published presets.

The payoff: options removed from Vitest fail the build instead of being silently ignored — which is exactly how `coverage.all` survived unnoticed after Vitest 4 dropped it.

Note that `vitest/config` exports the config type as **`ViteUserConfig`**, not `UserConfig`.

There are no `build`, `lint`, or `test` scripts — don't add them unless you're adding actual source/tests. To smoke-test a config change locally, point a sibling project's `eslint.config.js` / `tsconfig.json` / `vitest.config.js` at the working tree (e.g. `pnpm link` or a `file:` dependency). `/Users/ic9r/Documents/projects/a50/thoth-notebook` is a real consumer that exercises the Svelte profile.

## Architecture

### ESLint (`eslint/`)

Two **profile entry points** are exported: `node.js` (default) and `svelte.js`. Both are **synchronous factory functions** — calling `drMike({...})` returns a flat-config array. Both accept the same options, all optional: `gitignore` (default `true`), `internalPattern` (default `[]`, passed to perfectionist), and the opt-in flags `turborepo` / `vitest` / `effect` (all default `false`). `full.js` is just `node({ turborepo: true, vitest: true, effect: true })` pre-called (a config array, not a factory) — this is why README says `export { default } from 'dr-mike/eslint/full'`.

Profile composition order matters for ESLint flat config. Both profiles assemble in this sequence:

1. Optional `.gitignore` block (via `@eslint/compat`'s `includeIgnoreFile`)
2. `javascript` → `typescript` → `perfectionist`
3. (svelte profile only) `svelte` plugin block
4. Opt-in blocks: `turborepo`, `vitest`, `effect` — pushed in that fixed order
5. `base` → `prettier` → `globalIgnores`
6. Profile-specific tail block setting `languageOptions.globals`

When changing a profile, preserve this ordering — `prettier` must come last among rule blocks so it can disable formatting rules that earlier blocks enable, and `globalIgnores` must be last to apply to all preceding configs.

Directory layout under `eslint/`:
- `node.js`, `svelte.js`, `full.js` — entry points listed in `package.json` `exports`
- `shared/*.js` — per-concern config blocks (`base`, `javascript`, `typescript`, `prettier`, `vitest`, `turborepo`, `svelte`, `global-ignores`)
- `shared/plugins/*.js` — per-plugin rule configurations consumed by the shared blocks (`effect`, `eslint-comments`, `import-js`, `import-ts`, `perfectionist`, `prefer-arrow`, `promise`, `unicorn`)
- `_lib/` — internal helpers (underscore-prefixed; not exported)

The `typescript` block sets `parserOptions.projectService.allowDefaultProject: ['*.config.{ts,mts,cts}', '*.config.*.{ts,mts,cts}']` so root-level config files (e.g. `vitest.config.ts`) lint without being added to a tsconfig `include`. The glob is relative to typescript-eslint's `tsconfigRootDir` (defaults to `process.cwd()`), so it does **not** match nested `packages/*/vitest.config.ts` — the README "Monorepos" section explains the consequence.

### TypeScript (`tsconfig/`)

Plain JSON files, one per preset. `base.json` is the strictest baseline (no `include` of its own). `node.json` and `svelte.json` extend `base.json`; `node-effect.json` extends **`node.json`** (not `base.json`) and only adds the `@effect/language-service` compiler plugin. They use the `${configDir}` token (TS 5.5+) in `outDir`/`include` so paths resolve relative to the **consumer's** tsconfig, not this package — preserve that when editing.

The presets are verified TypeScript 7 compatible, but dr-mike deliberately bundles TypeScript **6**, and that is not drift to "fix". `typescript-eslint` declares `typescript: ">=4.8.4 <6.1.0"` and cannot run against TS 7, whose package exports a version stub instead of the compiler JS API. Upstream solves this in its monorepo with an npm alias pair (`"@typescript/native": "npm:typescript@7.0.2"` + `"typescript": "npm:@typescript/typescript6@6.0.2"`), which works there only because `publicHoistPattern` puts `tsc` on PATH. dr-mike is a published package with no equivalent lever — under pnpm its deps are nested, so a bundled TS 7 `tsc` would be unreachable to consumers while adding ~30 MB per install. Consumers who want TS 7 install it themselves as a direct dep.

### Vitest (`vitest/`)

`vitest/index.js` exports a default shared config and re-exports `defineConfig` / `mergeConfig` from `vitest/config`. Consumers compose via `mergeConfig(sharedConfig, defineConfig({...}))`. `vitest/types.d.ts` provides the types and is wired up through the `"types"` condition on the `./vitest` export — the default export is typed as `ViteUserConfig`, so a bare string export would leave it untyped for consumers on `node16`/`bundler` resolution.

## Releases

Changesets-driven. The `Release` workflow (`.github/workflows/release.yml`) runs on push to `main`: if changesets exist it opens/updates a "Version Packages" PR; merging that PR triggers `pnpm release` which publishes to npm with provenance via OIDC (hence `id-token: write` and Node 24 in that workflow — Node 22 in CI smoke is fine because it doesn't publish).

Any user-facing change needs a `pnpm changeset` entry committed in the same PR.
