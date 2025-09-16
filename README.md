# @inovatecjp/eslint-config (all‑in‑one)

**Um pacote só** com ESLint 9 (flat) + Prettier 3 + plugins **e um CLI** `inovatecjp`.

Stacks: **React** (Next.js), **React Native** (Expo) e **Node** — com variante **type‑aware**.

---

## Instalação

```bash
# Bun
bun add -D @inovatecjp/eslint-config

# npm	npm i -D @inovatecjp/eslint-config
# pnpm	pnpm add -D @inovatecjp/eslint-config
# yarn	yarn add -D @inovatecjp/eslint-config
```

> ✔️ **Batteries‑included**: você **não** precisa instalar ESLint/Prettier/plugins no projeto.
> Apenas `typescript` como peer (se usar TS).

---

## Uso — scripts

Adicione ao seu `package.json` do projeto:

```json
{
  "scripts": {
    "lint": "inovatecjp lint --stack=react",
    "lint:fix": "inovatecjp lint:fix --stack=react",
    "format": "inovatecjp format",
    "format:check": "inovatecjp format:check"
  }
}
```

**Stacks suportadas**: `react`, `react-native`, `node` (padrão: `base`).

**Flags úteis**:

* `--typeaware` → ativa regras que usam tipos (requer `tsconfig.json`).
* Em CI, *warnings* também falham o job (comportamento padrão do CLI).

### Exemplos

```bash
# Next.js (rápido, sem type-aware)
bun run lint

# React Native
inovatecjp lint --stack=react-native

# Node.js com verificação de tipos
inovatecjp lint --stack=node --typeaware

# Prettier (write/check). Aceita padrões/globs adicionais.
inovatecjp format
inovatecjp format:check "src/**/*.{ts,tsx}"
```

---

## O que vem no pacote

* **ESLint 9** (flat) + **Prettier 3**;
* TypeScript (`@typescript-eslint`), Import (`eslint-plugin-import` + `eslint-import-resolver-typescript`),
  **Node** (`eslint-plugin-n`), **Unicorn**, **React**, **React Hooks**, **JSX A11y**, **React Native**, **React Native A11y**, **Vitest** (`eslint-plugin-vitest`).

> Presets exportados (para quem quiser importar programaticamente):
>
> * `base`, `base-typeaware`
> * `react`, `react-typeaware`
> * `react-native`, `react-native-typeaware`
> * `node`, `node-typeaware`
> * `tests`

Você **não precisa** criar `eslint.config.js` no projeto — o **CLI** já aponta para os presets corretos. Se preferir, pode importar os presets no seu `eslint.config.js`:

```js
// eslint.config.js (opcional)
import { react, tests } from '@inovatecjp/eslint-config'
export default [
  ...react,
  ...tests,
]
```

---

## Diferença: base × type‑aware

* **base**: checagens baseadas só na sintaxe — mais rápido; não precisa de `tsconfig.json`.
* **type‑aware**: ativa regras que usam **informação de tipos** (via `parserOptions.project`) — mais rigoroso; exige `tsconfig.json`.

Sugerido: usar **base** no dia a dia e **type‑aware** no CI ou em módulos críticos (API/SDK).

---

## Requisitos

* Node.js **>= 18.18**
* (Opcional) `typescript >= 5` para presets TS/type‑aware.

---

## Dúvidas frequentes

**Preciso instalar ESLint/Prettier e plugins no projeto?**
Não. O pacote já inclui tudo (*batteries‑included*). Você só precisa de `typescript` se usar TS.

**E se meu projeto for só Node e eu não usar React?**
Sem problema: use `--stack=node` e o CLI só carrega os plugins do preset Node.

**`react/react-in-jsx-scope` está como `error`. Isso quebra projetos com runtime automático (React 17+)?**
Sim, se você não importa `React` nos arquivos. Mantivemos conforme o preset desejado; se quiser, pode desligar essa regra.

---

## Licença

MIT © InovatecJP
