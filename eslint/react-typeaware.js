// react-typeaware.js — React + base type-aware
import jsxA11y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import baseTypeAware from './base-typeaware.js'

export default [
  ...baseTypeAware,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // ======== Regras pedidas para React ========
      'react/jsx-uses-react': 'warn',
      'react/jsx-uses-vars': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'error',
      'react/no-deprecated': 'warn',
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/self-closing-comp': 'error',
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Extras
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-autofocus': 'warn',

      'react/no-array-index-key': 'warn',
      'react/jsx-no-useless-fragment': 'warn',
      'react/no-unstable-nested-components': 'warn',
      'react/jsx-no-target-blank': ['warn', { allowReferrer: true }],
    },
  },
]
