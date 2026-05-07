import { fixupPluginRules } from '@eslint/compat'
import plugin from '@codeforbreakfast/eslint-effect'
import { defineConfig } from 'eslint/config'

export default () => [
  defineConfig({
    files: ['**/*.ts', '**/*.cts', '**/*.mts', '**/*.tsx'],
    plugins: { effect: fixupPluginRules(plugin) },
    rules: {
      ...plugin.configs.recommended.rules,

      'effect/no-classes': 'off',
      'effect/no-curried-calls': 'off',
      'effect/no-eta-expansion': 'error',
      'effect/no-method-pipe': 'off',
      'effect/no-runPromise': 'off',
      'effect/no-unnecessary-function-alias': 'off',
      'effect/prefer-effect-platform': 'off',
      'effect/prefer-match-over-ternary': 'off',
    },
  }),
]
