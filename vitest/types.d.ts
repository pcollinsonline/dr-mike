import type { ViteUserConfig } from 'vitest/config'

declare const config: ViteUserConfig
export default config
export { defineConfig, mergeConfig } from 'vitest/config'
