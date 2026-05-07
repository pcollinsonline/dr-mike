import { includeIgnoreFile } from '@eslint/compat'
import globals from 'globals'
import { config } from 'typescript-eslint'

import { resolveGitignore } from './_lib/resolve-gitignore.js'
import baseConfig from './shared/base.js'
import effectConfig from './shared/plugins/effect.js'
import { perfectionistConfig } from './shared/plugins/perfectionist.js'
import globalIgnoresConfig from './shared/global-ignores.js'
import javascriptConfig from './shared/javascript.js'
import prettierConfig from './shared/prettier.js'
import svelteConfig from './shared/svelte.js'
import turborepoConfig from './shared/turborepo.js'
import { typescriptConfig } from './shared/typescript.js'
import vitestConfig from './shared/vitest.js'

const { browser, nodeBuiltin } = globals

const svelte = ({
  gitignore = true,
  internalPattern = [],
  turborepo = false,
  vitest = false,
  effect = false,
} = {}) => {
  const optional = []

  if (turborepo) optional.push(...turborepoConfig())
  if (vitest) optional.push(...vitestConfig())
  if (effect) optional.push(...effectConfig())

  const gitignorePath = resolveGitignore(gitignore)

  return config(
    ...(gitignorePath ? [includeIgnoreFile(gitignorePath)] : []),
    javascriptConfig,
    typescriptConfig({ extraFileExtensions: ['.svelte'] }),
    perfectionistConfig({ internalPattern }),
    ...svelteConfig(),
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
