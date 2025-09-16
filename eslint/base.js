// base.js — Flat config (ESM) universal, sem regras que exigem type info
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import unicorn from 'eslint-plugin-unicorn'
import globals from 'globals'

// Observação sobre ordenação de imports:
// - Usamos `import/order` (plugin-import) para grupos/linhas em branco.
// - Usamos o core `sort-imports` APENAS para ordenar os membros dentro do mesmo import.
//   Por isso ativamos: { ignoreDeclarationSort: true } para NÃO conflitar com `import/order`.

export default [
  // Ignora artefatos comuns
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

      // evita rodar em configs do próprio projeto (opcional)
      'eslint.config.*',
      'prettier.config.*',
    ],
  },

  // Base universal para JS/TS
  {
    files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      globals: {
        ...globals.es2024,
      },
      parserOptions: {
        // ❗️Não configuramos "project" aqui (sem type-aware neste preset)
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      import: importPlugin,
      unicorn,
    },
    settings: {
      // Ajuda o plugin-import a resolver TS/Node
      'import/resolver': {
        node: true,
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      // ========= REGRAS GERAIS (como solicitado) =========
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-var': ['error'],
      'prefer-const': ['error'],
      'no-unused-vars': 'warn',
      'consistent-return': 'error',
      'no-shadow': 'warn',
      'no-else-return': 'warn',
      'no-useless-return': 'warn',
      'no-unused-private-class-members': 'warn',

      // console (universal)
      'no-console': 'warn',

      // TypeScript (apenas regras que NÃO exigem type info)
      '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
      '@typescript-eslint/explicit-function-return-type': 'off',
      // ❌ Regra que exige type info — deixamos OFF no base:
      '@typescript-eslint/no-misused-promises': 'off',

      // Import (plugin-import)
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/no-cycle': 'warn',
      'import/no-mutable-exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'warn',
      'no-duplicate-imports': 'error',

      // Core `sort-imports` apenas para membros, sem conflitar com import/order
      'sort-imports': [
        'warn',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true, // NÃO ordena declarações; quem faz é import/order
          ignoreMemberSort: false, // ordena membros: import { a, b }
          allowSeparatedGroups: true,
        },
      ],

      // Unicorn (subset leve e útil)
      'unicorn/prefer-node-protocol': 'warn',
      'unicorn/no-array-push-push': 'warn',
    },
  },

  // Prettier por último para desarmar conflitos de formatação
  prettier,
]
