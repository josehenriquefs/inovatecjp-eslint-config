// eslint/node.js — Node sem plugin 'n' (bom para Nest)
import globals from 'globals'
import base from './base.js'

export default [
  ...base,
  {
    files: ['**/*.{ts,js,mjs,cjs}'],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      // Node (suas regras desejadas, independem do plugin 'n')
      'no-process-exit': 'error',
      'no-sync': 'warn',
      'callback-return': 'error',
      'handle-callback-err': 'warn',
      'no-path-concat': 'error',
      'no-new-require': 'error',
    },
  },
]
