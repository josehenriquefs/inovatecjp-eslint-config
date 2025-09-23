// base.js — Flat config (ESM) universal
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unicorn from 'eslint-plugin-unicorn'
import globals from 'globals'

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/.expo/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/.cache/**',

      // configs do próprio projeto
      'eslint.config.*',
      'prettier.config.*',

      // Prisma / código gerado
      '**/generated/**',
      '**/src/generated/**',
    ],
  },

  {
    files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      globals: { ...globals.es2024 },
      parserOptions: {
        // sem project aqui (type-aware fica no base-typeaware)
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      import: importPlugin,
      unicorn,
      'simple-import-sort': simpleImportSort,
    },
    settings: {
      'import/resolver': {
        node: true,
        typescript: { alwaysTryTypes: true },
      },
    },
    rules: {
      // ===== Regras gerais =====
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-var': ['error'],
      'prefer-const': ['error'],
      'no-unused-vars': 'off', 
      'consistent-return': 'error',
      'no-shadow': 'warn',
      'no-else-return': 'warn',
      'no-useless-return': 'warn',
      'no-unused-private-class-members': 'warn',
      'no-console': 'warn',

      // TS (apenas regras sem type info no base)
      '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-misused-promises': 'off',

      // ===== Import validations (mantidas) =====
      'import/no-cycle': 'warn',
      'import/no-mutable-exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'warn',
      'no-duplicate-imports': 'error',

      // ===== Organização automática dos imports =====
      // Troca de import/order + sort-imports -> simple-import-sort
      // Grupos equivalentes: node:, pacotes, internos, parent, siblings/index, side-effects, estilos
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Node.js builtins: node:fs, node:path
            ['^node:'],
            // Pacotes (ex: react, lodash, @org/*)
            ['^@?\\w'],
            // Imports internos por alias (ajuste para seus aliases se usar @/ ou ~/)
            ['^(@|~)/'],
            // Parent imports
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Siblings & index
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Side effect imports
            ['^\\u0000'],
            // Arquivos de estilo
            ['^.+\\.s?css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      // Unicorn (subset leve)
      'unicorn/prefer-node-protocol': 'warn',
      'unicorn/no-array-push-push': 'warn',

      // ===== Desligar regras que conflitam com o sorter =====
      'import/order': 'off',
      'sort-imports': 'off',
    },
  },

  // Prettier por último
  prettier,
]
