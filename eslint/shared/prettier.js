import prettierPlugin from 'eslint-config-prettier'
import { config } from 'typescript-eslint'

/**
 * Turns off all rules that are unnecessary or might conflict with Prettier.
 * MUST be the last entry in any profile.
 */
export default config(prettierPlugin)
