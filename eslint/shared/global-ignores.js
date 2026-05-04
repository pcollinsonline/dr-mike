import { config } from 'typescript-eslint'

export default config([
  {
    name: 'dr-mike:global-ignores',
    ignores: ['coverage', '.svelte-kit', '.turbo', '.vercel', 'build', 'dist'],
  },
])
