// base-typeaware.js — Igual ao base, mas com parserOptions.project configurado
import tsParser from '@typescript-eslint/parser'
import base from './base.js'

// clona o array de configs do base
const withTypeAware = structuredClone(base)

// injeta o parserOptions.project/tsconfigRootDir onde há languageOptions
for (const item of withTypeAware) {
  if (item.files && item.languageOptions) {
    item.languageOptions = {
      ...item.languageOptions,
      parser: tsParser,
      parserOptions: {
        ...(item.languageOptions.parserOptions ?? {}),
        project: [
          './tsconfig.json',
          './packages/*/tsconfig.json',
          './apps/*/tsconfig.json',
        ],
        tsconfigRootDir: process.cwd(),
      },
    }

    // ⚠️ Ative aqui apenas regras que exigem type info
    item.rules = {
      ...(item.rules ?? {}),
      '@typescript-eslint/no-misused-promises': 'warn',
      // (Se no futuro você quiser, aqui é o lugar para:
      // '@typescript-eslint/no-floating-promises': 'warn',
      // '@typescript-eslint/no-unsafe-assignment': 'warn',
      // '@typescript-eslint/no-unsafe-member-access': 'warn',
      // '@typescript-eslint/no-unsafe-argument': 'warn',
      // '@typescript-eslint/restrict-template-expressions': 'warn',
      // ...sempre mantendo OFF no base)
    }
  }
}

export default withTypeAware
