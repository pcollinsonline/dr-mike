import plugin from 'eslint-plugin-prefer-arrow'
import { config } from 'typescript-eslint'

export default config({
  name: 'dr-mike:prefer-arrow',

  plugins: { 'prefer-arrow': plugin },
  rules: {
    'prefer-arrow/prefer-arrow-functions': [
      'error',
      {
        allowStandaloneDeclarations: false,
        classPropertiesAllowed: false,
        disallowPrototype: true,
        singleReturnOnly: false,
      },
    ],
  },
})
