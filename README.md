# dr-mike

Opinionated, composable ESLint, TypeScript, and Vitest configuration presets. One package, three subpath exports — opt in to the pieces you want.

## Install

```sh
pnpm add -D dr-mike
```

That's it. `dr-mike` bundles every plugin and tool it needs — `eslint`, `typescript`, `vitest`, the rule plugins, the language services — at the exact versions it was tested with. You don't need to install anything else.

If you want to use a different version of `eslint`, `typescript`, or `vitest`, install your own copy and pnpm will hoist it; `dr-mike`'s pinned copies just become the fallback.

## ESLint

```js
// eslint.config.js
import drMike from 'dr-mike/eslint'

export default drMike()
```

The default export is a **synchronous factory**. No `await` required.

### Options

```js
export default drMike({
  gitignore: true,        // bool | string. true = auto-detect ./.gitignore. string = absolute path. false = disable.
  internalPattern: [],    // string[] — perfectionist sort-imports "internal" group regex(es). Default: []
  turborepo: false,       // adds eslint-plugin-turbo
  vitest: false,          // adds @vitest/eslint-plugin rules to **/*.test.ts
  effect: false,          // adds @codeforbreakfast/eslint-effect rules
})
```

All optional features default to `false`. Flip them on as needed — every plugin is already installed.

### Batteries-included preset

If you want everything turned on, skip the factory call:

```js
// eslint.config.js
export { default } from 'dr-mike/eslint/full'
```

This is equivalent to `drMike({ turborepo: true, vitest: true, effect: true })`.

### Svelte profile

```js
// eslint.config.js
import drMike from 'dr-mike/eslint/svelte'
import svelteConfig from './svelte.config.js'

export default [
  ...drMike(),
  {
    files: ['**/*.svelte', '**/*.svelte.ts'],
    languageOptions: {
      parserOptions: { svelteConfig, tsconfigRootDir: import.meta.dirname },
    },
  },
]
```

The `svelte` profile relies on `svelte` being present in your project — which it always is for a Svelte codebase, so no extra install is needed.

### Monorepos

dr-mike's preset allows root-level `*.config.{ts,mts,cts}` files (e.g. `vitest.config.ts`) to be linted without expanding your tsconfig `include`. The match is relative to typescript-eslint's `tsconfigRootDir`, which defaults to `process.cwd()`.

For monorepos, this means:

- **Per-package ESLint configs (recommended):** each package has its own `eslint.config.js` extending dr-mike, and lint runs per-package (e.g. via turbo). Config files in each package are picked up automatically. No extra setup.
- **Single root ESLint config linting the whole repo:** the glob only matches root-level files; nested `packages/*/vitest.config.ts` won't be matched. Either run lint per-package, or add the nested config files to a tsconfig `include`.

### Extending

```js
export default [
  ...drMike({ turborepo: true }),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]
```

## TypeScript

Strictest-possible base preset, with environment-specific extensions. Uses the TS 5.5+ `${configDir}` token so `outDir` and `include` resolve relative to the consumer's tsconfig.

```json
{
  "extends": "dr-mike/tsconfig/node"
}
```

Available presets:

| Subpath | Use for |
|---|---|
| `dr-mike/tsconfig/base` | The strictest base. Extend if you need a custom target/module. |
| `dr-mike/tsconfig/node` | Node 22+, `NodeNext` modules, `ES2023` lib. |
| `dr-mike/tsconfig/node-effect` | Same as `node` plus `@effect/language-service` plugin. |
| `dr-mike/tsconfig/svelte` | Svelte/SvelteKit, `Bundler` resolution, DOM lib. |

`typescript` ships with `dr-mike` at the version it's tested against (currently 6.x), and is what `typescript-eslint` uses for type-aware linting.

### TypeScript 7

The presets are TypeScript 7 compatible — verified against `typescript@7.0.2`, including `${configDir}` resolution and the `experimentalDecorators` / `emitDecoratorMetadata` pair.

`dr-mike` does **not** bundle the TS 7 native compiler. Install it yourself if you want it:

```sh
pnpm add -D typescript@7
```

You get a real `tsc` binary on your PATH, and `dr-mike`'s bundled TypeScript 6 stays nested and keeps `typescript-eslint` working. That separation is required, not incidental: `typescript-eslint` declares `typescript: ">=4.8.4 <6.1.0"` and cannot run against TS 7, whose package exports only a version stub rather than the compiler JS API.

If you use `dr-mike/tsconfig/node-effect`: the `plugins` entry is read by tsserver only (it is inert to `tsc`), so `@effect/language-service` remains correct while your editor runs a TypeScript 6 tsserver. Effect's own guidance is that TypeScript 7 users should move to [`@effect/tsgo`](https://github.com/Effect-TS/tsgo) instead.

## Vitest

```js
// vitest.config.js
import sharedConfig, { defineConfig, mergeConfig } from 'dr-mike/vitest'

export default mergeConfig(
  sharedConfig,
  defineConfig({
    test: { name: 'my-package' },
  }),
)
```

Defaults: `src/**/*.test.ts`, globals on, V8 coverage on over `src/**/*.{ts,tsx,svelte}`, `text`/`json`/`json-summary`/`html` reporters, coverage emitted even when tests fail (`reportOnFailure`), and fully-covered files hidden from the report (`skipFull`).

The default export is typed as `ViteUserConfig`, so `mergeConfig` composition is checked.

## Versioning & releases

Uses [Changesets](https://github.com/changesets/changesets). Contributors run `pnpm changeset` to describe their change; merging the auto-generated "Version Packages" PR cuts a release and publishes to npm.

## License

MIT
