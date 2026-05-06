# dr-mike

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
