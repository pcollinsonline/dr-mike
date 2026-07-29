---
"dr-mike": patch
---

Update bundled dependencies to latest versions (eslint 10.8.0, typescript-eslint ^8.65.0, vitest 4.1.10, @vitest/coverage-v8 4.1.10, @vitest/eslint-plugin 1.6.24, eslint-plugin-svelte 3.22.0, eslint-plugin-turbo 2.10.7, eslint-plugin-perfectionist ^5.10.0, eslint-import-resolver-typescript ^4.4.5, globals ^17.8.0, @effect/language-service 0.87.1). TypeScript stays on 6.0.3, the last 6.x release — typescript-eslint 8.x declares `typescript: >=4.8.4 <6.1.0`, so moving to TypeScript 7 requires a typescript-eslint major bump.
