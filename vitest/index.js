// @ts-check
import { defineConfig, mergeConfig } from 'vitest/config'

const sharedConfig = defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    globals: true,
    passWithNoTests: true,
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['src/**/*.{ts,tsx,svelte}'],
      reportsDirectory: './coverage',
      reporter: ['text', 'json', 'json-summary', 'html'],
      reportOnFailure: true,
      skipFull: true,
    },
  },
})

/**
 * Shared vitest config, named after the workspace it runs in so reporters can tell
 * projects apart.
 *
 * @param {{ name: string }} packageJson the workspace's package.json
 * @param {import('vitest/config').ViteUserConfig} [overrides] merged last, so it wins over the shared settings
 * @returns {import('vitest/config').ViteUserConfig}
 */
export const defineTestConfig = (packageJson, overrides = {}) =>
  mergeConfig(mergeConfig(sharedConfig, { test: { name: packageJson.name } }), overrides)

export default sharedConfig

export { defineConfig, mergeConfig } from 'vitest/config'
