import plugin from '@eslint-community/eslint-plugin-eslint-comments/configs'
import { config } from 'typescript-eslint'

export default config(plugin.recommended, {
  name: 'dr-mike:eslint-comments',

  rules: {
    '@eslint-community/eslint-comments/require-description': 'error',
  },
})
