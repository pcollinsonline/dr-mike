---
'dr-mike': minor
---

Mirror the latest upstream toolchain updates: Vitest 5, eslint-plugin-unicorn 79, the `@eslint-community` eslint-comments plugin, a `defineTestConfig` Vitest factory, and `.ts` import specifiers in the Node tsconfig preset. Also fixes ESLint crashing when a consumer installs TypeScript 7.

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
