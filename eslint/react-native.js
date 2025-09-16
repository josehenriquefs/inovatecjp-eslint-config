// react-native.js — Preset para React Native
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import rn from 'eslint-plugin-react-native'
import rnA11y from 'eslint-plugin-react-native-a11y'
import globals from 'globals'
import base from './base.js'

export default [
  ...base,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser, // RN usa ambiente JS mobile, mas globals de browser ajudam com fetch/console/etc.
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
      // ======== Regras pedidas para RN ========
      'react-native/no-unused-styles': 'error',
      'react-native/split-platform-components': 'error',
      'react-native/no-inline-styles': 'error',
      'react-native/no-color-literals': 'warn',
      'react-native/no-single-element-style-arrays': 'error',

      // ======== Expansões e A11y mobile ========
      'react-native/no-raw-text': 'off',
      'react-native-a11y/has-accessibility-hint': 'warn',
      'react-native-a11y/has-valid-accessibility-actions': 'warn',

      // Hooks continuam importantes em RN
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]
