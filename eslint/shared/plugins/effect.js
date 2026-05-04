import { fixupPluginRules } from '@eslint/compat'
import { defineConfig } from 'eslint/config'

import { requirePeer } from '../../_lib/require-peer.js'

export default async () => {
  const { default: plugin } = await requirePeer('@codeforbreakfast/eslint-effect', 'effect')
  return [
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
}
