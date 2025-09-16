// tests.js — Vitest
import vitest from 'eslint-plugin-vitest'

export default [
  {
    files: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    plugins: { vitest },
    rules: {
      'vitest/no-focused-tests': 'error',
      'vitest/consistent-test-it': ['warn', { fn: 'it' }],
      'vitest/expect-expect': 'warn',
    },
  },
]
