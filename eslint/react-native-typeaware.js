// react-native-typeaware.js — RN + base type-aware
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import rn from 'eslint-plugin-react-native'
import rnA11y from 'eslint-plugin-react-native-a11y'
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
      'react-native': rn,
      'react-native-a11y': rnA11y,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // ======== RN ========
      'react-native/no-unused-styles': 'error',
      'react-native/split-platform-components': 'error',
      'react-native/no-inline-styles': 'error',
      'react-native/no-color-literals': 'warn',
      'react-native/no-single-element-style-arrays': 'error',

      // A11y
      'react-native/no-raw-text': 'off',
      'react-native-a11y/has-accessibility-hint': 'warn',
      'react-native-a11y/has-valid-accessibility-actions': 'warn',

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]
