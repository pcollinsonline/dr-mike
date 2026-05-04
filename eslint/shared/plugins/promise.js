import plugin from 'eslint-plugin-promise'
import { config } from 'typescript-eslint'

export default config(plugin.configs['flat/recommended'])
