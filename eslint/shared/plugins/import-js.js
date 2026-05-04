import plugin from 'eslint-plugin-import'
import { config } from 'typescript-eslint'

export default config(plugin.flatConfigs.recommended, {
  name: 'dr-mike:import-js',

  rules: {
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-absolute-path': 'error',
    'import/no-cycle': 'error',
    'import/no-extraneous-dependencies': ['error', { includeTypes: true }],
    'import/no-mutable-exports': 'error',
    'import/no-relative-packages': 'error',
    'import/no-self-import': 'error',
    'import/no-useless-path-segments': ['error'],
  },
})
