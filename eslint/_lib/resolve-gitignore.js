import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

export const resolveGitignore = (option) => {
  if (option === false) return null
  if (typeof option === 'string') return option
  const path = resolve(process.cwd(), '.gitignore')
  return existsSync(path) ? path : null
}
