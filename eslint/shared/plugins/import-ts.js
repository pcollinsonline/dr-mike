import plugin from 'eslint-plugin-import'
import { config } from 'typescript-eslint'

export default config(plugin.flatConfigs.typescript, {
  name: 'dr-mike:import-ts',

  rules: {
    // TypeScript already provides these checks via standard type checking
    // see https://typescript-eslint.io/troubleshooting/typed-linting/performance#eslint-plugin-import
    'import/default': 'off',
    'import/named': 'off',
    'import/namespace': 'off',
    'import/no-named-as-default-member': 'off',
    'import/no-unresolved': 'off',

    'import/no-cycle': 'off',
    'import/no-deprecated': 'off',
    'import/no-named-as-default': 'off',
    'import/no-unused-modules': 'off',

    // TypeScript enforces extensions when moduleResolution is Node16/NodeNext
    'import/extensions': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: true,
    },
  },
})
