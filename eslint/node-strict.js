// eslint/node-strict.js — Node “estrito” com plugin 'n'
import globals from 'globals'
import base from './base.js'

let nPlugin = null
try {
  const mod = await import('eslint-plugin-n')
  nPlugin = mod.default || mod
} catch {
  // plugin não instalado: seguimos sem registrar (apenas sem regras 'n/*')
}

export default [
  ...base,
  {
    files: ['**/*.{ts,js,mjs,cjs}'],
    languageOptions: {
      globals: { ...globals.node },
    },
    ...(nPlugin ? { plugins: { n: nPlugin } } : {}),
    rules: {
      // suas regras de Node “genéricas”
      'no-process-exit': 'error',
      'no-sync': 'warn',
      'callback-return': 'error',
      'handle-callback-err': 'warn',
      'no-path-concat': 'error',
      'no-new-require': 'error',

      // regras do plugin 'n' — só se o plugin existir
      ...(nPlugin
        ? {
            'n/no-missing-import': 'error',
            'n/no-extraneous-import': 'warn',
            'n/no-unsupported-features/es-syntax': 'off',
          }
        : {}),
    },
  },
]
