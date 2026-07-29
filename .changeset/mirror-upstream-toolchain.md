---
'dr-mike': minor
---

Mirror upstream toolchain updates, modernize the Vitest preset, and verify TypeScript 7 compatibility.

**ESLint — new rule (may surface new errors)**

- Enable `@typescript-eslint/no-unsafe-type-assertion`. This is type-checked and will flag existing `as` casts that widen unsafely. Disable it in your own config if you need to defer the cleanup.

**Vitest preset — corrected for Vitest 4 (behavior change)**

- Replace `coverage.all: true`, which was **removed in Vitest 4 and silently ignored**, with `coverage.include: ['src/**/*.{ts,tsx,svelte}']`. If your sources live outside `src/`, override `coverage.include`.
- Add the `json-summary` reporter alongside the existing `text` / `json` / `html`.
- Add `coverage.reportOnFailure: true` so coverage is still emitted when tests fail.
- Add `coverage.skipFull: true` so fully-covered files are omitted from the report.

**Vitest preset — types fix**

- The default export is now actually typed as `ViteUserConfig`. Previously `vitest/index.d.ts` used an ambient `declare module` that omitted the default export, and the `./vitest` subpath had no `"types"` export condition, so it was effectively untyped under `node16`/`bundler` resolution. The declaration file is now `vitest/types.d.ts`, wired through a `"types"` condition.

**TypeScript 7**

- The `tsconfig/*` presets are verified compatible with `typescript@7.0.2` — no preset changes were needed. `dr-mike` continues to bundle TypeScript 6, because `typescript-eslint` declares `typescript: ">=4.8.4 <6.1.0"` and cannot run against TS 7. To compile with TS 7, install `typescript@7` as your own direct dependency; dr-mike's bundled copy stays nested and keeps type-aware linting working.

**Internal**

- Add `pnpm typecheck` (`allowJs`/`checkJs` over the Vitest preset), now run in CI, so future removed Vitest options fail the build instead of being silently ignored.
