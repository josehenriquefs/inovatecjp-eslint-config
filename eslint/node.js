// node.js — Preset para Node (não type-aware)
import n from 'eslint-plugin-n'
import globals from 'globals'
import base from './base.js'

export default [
  ...base,
  {
    files: ['**/*.{ts,js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    plugins: { n },
    rules: {
      // ======== Regras pedidas para Node ========
      'no-process-exit': 'error',
      'no-sync': 'warn',
      'callback-return': 'error',
      'handle-callback-err': 'warn',
      'no-path-concat': 'error',
      'no-new-require': 'error',

      // Plugin n — checks úteis
      'n/no-missing-import': 'error',
      'n/no-extraneous-import': 'warn',
      // Para projetos transpilados, evitar falsos positivos:
      'n/no-unsupported-features/es-syntax': 'off',
    },
  },
]
