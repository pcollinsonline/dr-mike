# dr-mike

Opinionated, composable ESLint, TypeScript, and Vitest configuration presets. One package, three subpath exports — opt in to the pieces you want.

## Install

```sh
pnpm add -D dr-mike
```

You always need `eslint` installed in the consumer project. Other peers (svelte, turbo, vitest, effect) are only required if you opt into their features — see the per-feature sections below.

## ESLint

```js
// eslint.config.js
import drMike from 'dr-mike/eslint'

export default await drMike()
```

The default export is an **async factory**. Use `await` at the top level (ESLint 9+ flat config supports it).

### Options

```js
export default await drMike({
  gitignore: true,        // bool | string. true = auto-detect ./.gitignore. string = absolute path. false = disable.
  internalPattern: [],    // string[] — perfectionist sort-imports "internal" group regex(es). Default: []
  turborepo: false,       // adds eslint-plugin-turbo. Requires `pnpm add -D eslint-plugin-turbo`
  vitest: true,           // adds @vitest/eslint-plugin rules to **/*.test.ts. Requires `pnpm add -D @vitest/eslint-plugin`
  effect: false,          // adds @codeforbreakfast/eslint-effect rules. Requires `pnpm add -D @codeforbreakfast/eslint-effect`
})
```

If you opt into a feature without installing its peer dependency, dr-mike throws a clear error telling you what to install.

### Svelte profile

```js
// eslint.config.js
import drMike from 'dr-mike/eslint/svelte'
import svelteConfig from './svelte.config.js'

export default [
  ...(await drMike()),
  {
    files: ['**/*.svelte', '**/*.svelte.ts'],
    languageOptions: {
      parserOptions: { svelteConfig, tsconfigRootDir: import.meta.dirname },
    },
  },
]
```

Requires `pnpm add -D eslint-plugin-svelte`.

### Monorepos

dr-mike's preset allows root-level `*.config.{ts,mts,cts}` files (e.g. `vitest.config.ts`) to be linted without expanding your tsconfig `include`. The match is relative to typescript-eslint's `tsconfigRootDir`, which defaults to `process.cwd()`.

For monorepos, this means:

- **Per-package ESLint configs (recommended):** each package has its own `eslint.config.js` extending dr-mike, and lint runs per-package (e.g. via turbo). Config files in each package are picked up automatically. No extra setup.
- **Single root ESLint config linting the whole repo:** the glob only matches root-level files; nested `packages/*/vitest.config.ts` won't be matched. Either run lint per-package, or add the nested config files to a tsconfig `include`.

### Extending

```js
export default [
  ...(await drMike({ turborepo: true })),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]
```

## TypeScript

Strictest-possible base preset, with environment-specific extensions. Uses TS 6 `${configDir}` so `outDir` and `include` resolve relative to the consumer's tsconfig.

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
| `dr-mike/tsconfig/node-effect` | Same as `node` plus `@effect/language-service` plugin. Requires `pnpm add -D @effect/language-service`. |
| `dr-mike/tsconfig/svelte` | Svelte/SvelteKit, `Bundler` resolution, DOM lib. |

Peer requirement: `pnpm add -D typescript`.

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

Defaults: `src/**/*.test.ts`, globals on, V8 coverage on, HTML/JSON/text reporters.

Peers: `pnpm add -D vitest @vitest/coverage-v8`.

## Versioning & releases

Uses [Changesets](https://github.com/changesets/changesets). Contributors run `pnpm changeset` to describe their change; merging the auto-generated "Version Packages" PR cuts a release and publishes to npm.

## License

MIT
