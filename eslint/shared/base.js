import { config } from 'typescript-eslint'

import eslintCommentsConfig from './plugins/eslint-comments.js'

export default config(
  {
    name: 'dr-mike:base',

    languageOptions: {
      ecmaVersion: 2025,
      parserOptions: {
        ecmaVersion: 2025,
        sourceType: 'module',
      },
      sourceType: 'module',
    },
    linterOptions: {
      noInlineConfig: false,
      reportUnusedDisableDirectives: 'error',
      reportUnusedInlineConfigs: 'error',
    },
  },
  eslintCommentsConfig,
)
