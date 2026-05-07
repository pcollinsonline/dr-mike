---
'dr-mike': minor
---

Absorb peer-dependency management so `pnpm add -D dr-mike` is the only install consumers need.

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
   export default drMike({ vitest: true })
   ```

   Or use the new batteries-included preset:

   ```js
   export { default } from 'dr-mike/eslint/full'
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
