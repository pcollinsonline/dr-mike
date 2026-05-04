import js from '@eslint/js'
import { config } from 'typescript-eslint'

import importConfig from './plugins/import-js.js'
import preferArrowConfig from './plugins/prefer-arrow.js'
import promiseConfig from './plugins/promise.js'
import unicornConfig from './plugins/unicorn.js'

export default config(
  js.configs.recommended,
  importConfig,
  preferArrowConfig,
  promiseConfig,
  unicornConfig,
  {
    name: 'dr-mike:javascript',

    rules: {
      'no-empty-function': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'func-style': ['error', 'expression'],
      'prefer-arrow-callback': 'error',
      'no-duplicate-imports': 'error',
      'prefer-const': ['error', { destructuring: 'all' }],
    },
  },
)
