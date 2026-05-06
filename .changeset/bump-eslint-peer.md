---
"dr-mike": patch
---

Bump minimum `eslint` peer dependency to `>=10.0.0` to match the
internal `@eslint/js@^10` dep. Consumers on eslint 9 were getting
unmet-peer warnings from pnpm.
