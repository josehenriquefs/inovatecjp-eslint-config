// base-typeaware.js — Igual ao base, mas com parserOptions.project configurado
import tsParser from '@typescript-eslint/parser'
import base from './base.js'

const withTypeAware = structuredClone(base)

// Encontra o bloco principal (aquele com files/rules) e injeta project/tsconfigRootDir
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
  }
}

export default withTypeAware
