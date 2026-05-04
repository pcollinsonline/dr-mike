import { requirePeer } from '../_lib/require-peer.js'

export default async () => {
  const { default: turbo } = await requirePeer('eslint-plugin-turbo', 'turborepo')
  return [
    {
      name: 'dr-mike:turborepo',
      plugins: { turbo },
      rules: {
        'turbo/no-undeclared-env-vars': 'error',
      },
    },
  ]
}
