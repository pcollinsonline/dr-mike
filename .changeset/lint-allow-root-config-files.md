---
"dr-mike": patch
---

Allow root-level `*.config.ts` files (vitest, drizzle, playwright, etc.)
to be linted out of the box. Adds `allowDefaultProject` to the
typescript-eslint `projectService` config so consumers don't have to
expand their tsconfig `include` to cover lint-only files.
