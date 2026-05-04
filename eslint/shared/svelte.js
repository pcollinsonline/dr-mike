import { config, parser } from 'typescript-eslint'

import { requirePeer } from '../_lib/require-peer.js'
import { typescriptConfig } from './typescript.js'

export default async () => {
  const { default: plugin } = await requirePeer('eslint-plugin-svelte', 'svelte')
  return config(
    ...plugin.configs.recommended,
    {
      extends: [typescriptConfig({ extraFileExtensions: ['.svelte'] })],
      files: ['**/*.svelte'],
      rules: {
        'svelte/block-lang': ['error', { script: 'ts', style: ['postcss', 'css'] }],
        'svelte/sort-attributes': 'error',
      },
    },
    {
      files: ['**/*.svelte', '**/*.svelte.ts'],
      languageOptions: {
        parserOptions: {
          extraFileExtensions: ['.svelte'],
          parser: parser,
          projectService: true,
        },
      },
    },
    ...plugin.configs.prettier,
  )
}
