# dr-mike

## 0.3.0

### Minor Changes

- db6dd26: Mirror upstream toolchain updates, modernize the Vitest preset, and verify TypeScript 7 compatibility.

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

## 0.2.2

### Patch Changes

- db46959: Update bundled dependencies to latest versions (eslint 10.8.0, typescript-eslint ^8.65.0, vitest 4.1.10, @vitest/coverage-v8 4.1.10, @vitest/eslint-plugin 1.6.24, eslint-plugin-svelte 3.22.0, eslint-plugin-turbo 2.10.7, eslint-plugin-perfectionist ^5.10.0, eslint-import-resolver-typescript ^4.4.5, globals ^17.8.0, @effect/language-service 0.87.1). TypeScript stays on 6.0.3, the last 6.x release — typescript-eslint 8.x declares `typescript: >=4.8.4 <6.1.0`, so moving to TypeScript 7 requires a typescript-eslint major bump.

## 0.2.1

### Patch Changes

- d99f920: Update bundled dependencies to latest versions (eslint 10.4.1, typescript-eslint ^8.60.0, vitest 4.1.7, @vitest/coverage-v8 4.1.7, @vitest/eslint-plugin 1.6.18, eslint-plugin-svelte 3.19.0, eslint-plugin-turbo 2.9.16, @effect/language-service 0.86.2, @eslint/compat ^2.1.0).

## 0.2.0

### Minor Changes

- d294eea: Absorb peer-dependency management so `pnpm add -D dr-mike` is the only install consumers need.

  **Breaking changes**

  1. **`dr-mike/eslint` factory is now synchronous.** Drop the `await`:

     ```js
     // before
     export default await drMike({ vitest: true })

     // after
     export default drMike({ vitest: true })
     ```

     Forgetting to remove `await` will produce `TypeError: config is not iterable` at lint time. The svelte profile (`dr-mike/eslint/svelte`) is also now sync.

  2. **Default factory options flipped to opt-in.** `vitest`, `turborepo`, and `effect` now default to `false`. Consumers who relied on `vitest: true` being the default must pass it explicitly:

     ```js
     export default drMike({ vitest: true });
     ```

     Or use the new batteries-included preset:

     ```js
     export { default } from "dr-mike/eslint/full";
     ```

  3. **All plugin and tooling peers are now bundled as regular `dependencies` at pinned versions.** The following moved from `peerDependencies` to `dependencies`:

     - `@codeforbreakfast/eslint-effect`
     - `@effect/language-service`
     - `@vitest/coverage-v8`
     - `@vitest/eslint-plugin`
     - `eslint`
     - `eslint-plugin-svelte`
     - `eslint-plugin-turbo`
     - `typescript`
     - `vitest`

     **Action for consumers:** if you were installing any of these solely to satisfy `dr-mike`'s peer requirements, you can remove them from your `devDependencies`. To override a pinned version (e.g. use a newer `eslint`), install your own copy — pnpm's `dedupe-peer-dependents` will hoist it.

  **New**

  - `dr-mike/eslint/full` — a zero-config preset with `turborepo`, `vitest`, and `effect` all enabled.

## 0.1.2

### Patch Changes

- c58d570: Allow root-level `*.config.ts` files (vitest, drizzle, playwright, etc.)
  to be linted out of the box. Adds `allowDefaultProject` to the
  typescript-eslint `projectService` config so consumers don't have to
  expand their tsconfig `include` to cover lint-only files.

## 0.1.1

### Patch Changes

- 480570e: Bump minimum `eslint` peer dependency to `>=10.0.0` to match the
  internal `@eslint/js@^10` dep. Consumers on eslint 9 were getting
  unmet-peer warnings from pnpm.

## 0.1.0

### Minor Changes

- 6ad1751: Initial release.
