import { fixupPluginRules } from '@eslint/compat'
import plugin from 'eslint-plugin-eslint-comments'
import { config } from 'typescript-eslint'

export default config({
  name: 'dr-mike:eslint-comments',

  plugins: {
    'eslint-comments': fixupPluginRules(plugin),
  },
  rules: {
    ...plugin.configs.recommended.rules,
    'eslint-comments/require-description': 'error',
  },
})
