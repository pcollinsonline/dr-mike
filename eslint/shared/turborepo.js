import turbo from 'eslint-plugin-turbo'

export default () => [
  {
    name: 'dr-mike:turborepo',
    plugins: { turbo },
    rules: {
      'turbo/no-undeclared-env-vars': 'error',
    },
  },
]
