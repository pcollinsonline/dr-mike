import { includeIgnoreFile } from '@eslint/compat'
import globals from 'globals'
import { config } from 'typescript-eslint'

import { resolveGitignore } from './_lib/resolve-gitignore.js'
import baseConfig from './shared/base.js'
import globalIgnoresConfig from './shared/global-ignores.js'
import javascriptConfig from './shared/javascript.js'
import { perfectionistConfig } from './shared/plugins/perfectionist.js'
import prettierConfig from './shared/prettier.js'
import svelteFactory from './shared/svelte.js'
import { typescriptConfig } from './shared/typescript.js'

const { browser, nodeBuiltin } = globals

const svelte = async ({
  gitignore = true,
  internalPattern = [],
  turborepo = false,
  vitest = true,
  effect = false,
} = {}) => {
  const optional = []

  if (turborepo) {
    const { default: turborepoFactory } = await import('./shared/turborepo.js')
    optional.push(...(await turborepoFactory()))
  }

  if (vitest) {
    const { default: vitestFactory } = await import('./shared/vitest.js')
    optional.push(...(await vitestFactory()))
  }

  if (effect) {
    const { default: effectFactory } = await import('./shared/plugins/effect.js')
    optional.push(...(await effectFactory()))
  }

  const svelteConfig = await svelteFactory()
  const gitignorePath = resolveGitignore(gitignore)

  return config(
    ...(gitignorePath ? [includeIgnoreFile(gitignorePath)] : []),
    javascriptConfig,
    typescriptConfig({ extraFileExtensions: ['.svelte'] }),
    perfectionistConfig({ internalPattern }),
    ...svelteConfig,
    ...optional,
    baseConfig,
    prettierConfig,
    globalIgnoresConfig,
    {
      name: 'dr-mike:profile:svelte',

      languageOptions: {
        globals: { ...browser, ...nodeBuiltin },
      },
    },
  )
}

export default svelte
