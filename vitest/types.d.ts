import type { ViteUserConfig } from 'vitest/config'

declare const config: ViteUserConfig
export default config

export declare const defineTestConfig: (
  packageJson: { name: string },
  overrides?: ViteUserConfig,
) => ViteUserConfig

export { defineConfig, mergeConfig } from 'vitest/config'
