# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this package is

`dr-mike` is a single npm package that ships **opinionated config presets** for ESLint, TypeScript, and Vitest via subpath exports in three families (`dr-mike/eslint*`, `dr-mike/tsconfig/*`, `dr-mike/vitest`). There is **no `src/`, no build step, and no test suite** — files in `eslint/`, `tsconfig/`, and `vitest/` are published as-is (see `package.json` `files` and `exports`).

A core design choice: every plugin/tool the presets need (`eslint`, `typescript`, `vitest`, every rule plugin, language services) is a real `dependencies` entry, not a peer dep. Consumers install only `dr-mike`. If a consumer installs their own copy of `eslint`/`typescript`/`vitest`, pnpm hoists theirs and dr-mike's pinned copy becomes the fallback.

## Commands

```sh
pnpm install                # install (pnpm@10.33.0; Node >=20)
pnpm pack --dry-run         # mirrors the CI smoke check — verifies what gets published
pnpm changeset              # author a changeset before opening a PR
pnpm version-packages       # consumes changesets, bumps version (run by release bot)
pnpm release                # changesets publish (run by release bot)
```

There are no `build`, `lint`, or `test` scripts — don't add them unless you're adding actual source/tests. To smoke-test a config change locally, point a sibling project's `eslint.config.js` / `tsconfig.json` / `vitest.config.js` at the working tree (e.g. `pnpm link` or a `file:` dependency).

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

### Vitest (`vitest/`)

`vitest/index.js` exports a default shared config and re-exports `defineConfig` / `mergeConfig` from `vitest/config`. Consumers compose via `mergeConfig(sharedConfig, defineConfig({...}))`. `vitest/index.d.ts` provides the types.

## Releases

Changesets-driven. The `Release` workflow (`.github/workflows/release.yml`) runs on push to `main`: if changesets exist it opens/updates a "Version Packages" PR; merging that PR triggers `pnpm release` which publishes to npm with provenance via OIDC (hence `id-token: write` and Node 24 in that workflow — Node 22 in CI smoke is fine because it doesn't publish).

Any user-facing change needs a `pnpm changeset` entry committed in the same PR.
