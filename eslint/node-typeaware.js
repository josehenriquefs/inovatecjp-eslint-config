// node-typeaware.js — Node + base type-aware
import n from 'eslint-plugin-n'
import globals from 'globals'
import baseTypeAware from './base-typeaware.js'

export default [
  ...baseTypeAware,
  {
    files: ['**/*.{ts,js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    plugins: { n },
    rules: {
      // ======== Regras pedidas para Node (iguais ao preset não type-aware) ========
      'no-process-exit': 'error',
      'no-sync': 'warn',
      'callback-return': 'error',
      'handle-callback-err': 'warn',
      'no-path-concat': 'error',
      'no-new-require': 'error',

      // Plugin n
      'n/no-missing-import': 'error',
      'n/no-extraneous-import': 'warn',
      'n/no-unsupported-features/es-syntax': 'off',
    },
  },
]
