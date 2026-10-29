# dr-mike

## 0.4.0

### Minor Changes

- 430ea5d: Mirror the latest upstream toolchain updates: Vitest 5, eslint-plugin-unicorn 79, the `@eslint-community` eslint-comments plugin, a `defineTestConfig` Vitest factory, and `.ts` import specifiers in the Node tsconfig preset. Also fixes ESLint crashing when a consumer installs TypeScript 7.

  **Breaking: Node floor raised**

  - `engines.node` is now `^22.13.0 || ^24.0.0 || >=26.0.0` (was `>=20`). Vitest 5, ESLint 10.13 and eslint-plugin-unicorn 79 all dropped Node 20.

  **Breaking: eslint-comments rules renamed**

  - `eslint-plugin-eslint-comments` (unmaintained, needed an `@eslint/compat` shim for ESLint 10) is replaced by `@eslint-community/eslint-plugin-eslint-comments`. Same recommended rule set, but the rule prefix changes from `eslint-comments/` to `@eslint-community/eslint-comments/`. Update any overrides or disable comments that name the old prefix.

  **ESLint: eslint-plugin-unicorn 64 → 79 (new errors, all autofixable in our testing)**

  - New recommended rules turn on. The noisiest is `unicorn/no-asterisk-prefix-in-documentation-comments`, which wants `/** … */` blocks written without leading `*` on each line. Also new: `prefer-ternary` and `prefer-combined-guards`. Run `eslint --fix`, or turn them off in your own config.
  - Turned off, as upstream does: `unicorn/max-nested-calls` (builder-style APIs like Effect/Zod nest deeply) and `unicorn/name-replacements` (the new name of `prevent-abbreviations`, which was already off).
  - Svelte profile: turns off `unicorn/no-top-level-assignment-in-function` (it flags the standard `let x = $state()` reassigned from an event handler) and `unicorn/consistent-boolean-name` (crashes on the Svelte AST) for `*.svelte` files.

  **ESLint: import sorting**

  - `perfectionist/sort-imports` gets two new groups after internal imports: `$lib/…` (SvelteKit alias) and then `#lib/…` (Node subpath imports). Imports using these prefixes may be re-sorted. This is autofixable.

  **Vitest 5**

  - `vitest` and `@vitest/coverage-v8` are now 5.0.5. Vitest 5 made `vite` a required peer, so `vite@8.3.5` is now bundled too. Consumers still don't install anything themselves.
  - New `defineTestConfig(packageJson, overrides?)` export: it sets `test.name` from your `package.json` and merges `overrides` last:

    ```js
    import { defineTestConfig } from 'dr-mike/vitest'
    import packageJson from './package.json' with { type: 'json' }

    export default defineTestConfig(packageJson)
    ```

    The default export (`mergeConfig(sharedConfig, …)`) still works unchanged.

  **TypeScript**

  - `dr-mike/tsconfig/node` (and therefore `node-effect`) now sets `allowImportingTsExtensions` and `rewriteRelativeImportExtensions`, so `./foo.ts` specifiers work for Node's native type stripping. Existing `./foo.js` specifiers are unaffected. Verified with both the bundled TypeScript 6.0.3 and `typescript@7.0.2`.

  **Fix: ESLint crashed when a consumer installed TypeScript 7**

  - `@typescript-eslint/eslint-plugin` (a peer of `@vitest/eslint-plugin`) and `@typescript-eslint/parser` (an optional peer of `eslint-plugin-import`) were auto-installed peers, so pnpm resolved them against the consumer's `typescript@7`. ESLint then died with "typescript-eslint does not support TS 7.0", even with `vitest: false`. Both are now direct dependencies, so type-aware linting stays on the bundled TypeScript 6 as the README describes.

  **Dependency updates**

  eslint 10.13.0, typescript-eslint ^8.72.1, eslint-plugin-perfectionist ^5.13.0, eslint-plugin-svelte 3.23.1, eslint-plugin-turbo 2.11.10, @vitest/eslint-plugin 1.6.28, @effect/language-service 0.87.5, @eslint/compat ^2.1.1, globals ^17.13.0. TypeScript stays at 6.0.3, because typescript-eslint 8.72 still declares `typescript: <6.1.0`.

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
