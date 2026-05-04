import plugin from 'eslint-plugin-unicorn'
import { config } from 'typescript-eslint'

export default config(plugin.configs.recommended, {
  name: 'dr-mike:unicorn',

  rules: {
    'unicorn/consistent-destructuring': ['error'],
    'unicorn/custom-error-definition': ['error'],

    // Recommended rules turned off
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-null': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/require-module-specifiers': 'off',
  },
})
