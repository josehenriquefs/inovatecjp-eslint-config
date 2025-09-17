#!/usr/bin/env node
// CLI da InovatecJP — ESLint (API) + Prettier, com stacks e --typeaware
import { ESLint } from 'eslint'
import { spawn } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const require = createRequire(import.meta.url)

function parseArgs(argv) {
  const args = { cmd: 'lint', stack: 'base', typeaware: false, passthrough: [] }
  const it = argv.slice(2)[Symbol.iterator]()
  for (const token of it) {
    if (['lint', 'lint:fix', 'format', 'format:check'].includes(token)) {
      args.cmd = token
    } else if (token.startsWith('--stack=')) {
      args.stack = token.split('=')[1]
    } else if (token === '--typeaware') {
      args.typeaware = true
    } else {
      args.passthrough.push(token)
    }
  }
  return args
}

const args = parseArgs(process.argv)

const stackToConfig = (stack, typeaware) => {
  const baseName = typeaware ? 'base-typeaware.js' : 'base.js'
  switch (stack) {
    case 'node-strict':
      return 'node-strict.js'               // <— novo
    case 'node':
      return typeaware ? 'node-typeaware.js' : 'node.js'
    case 'react':
      return typeaware ? 'react-typeaware.js' : 'react.js'
    case 'react-native':
    case 'reactNative':
      return typeaware ? 'react-native-typeaware.js' : 'react-native.js'
    case 'base':
    default:
      return baseName
  }
}

const resolveEslintConfig = () =>
  resolve(__dirname, '../eslint', stackToConfig(args.stack, args.typeaware))

async function runESLint() {
  const overrideConfigFile = resolveEslintConfig()
  const fix = args.cmd === 'lint:fix'

  // ESLint 9: flat config por arquivo; não use 'useEslintrc'
  const eslint = new ESLint({
    overrideConfigFile,
    errorOnUnmatchedPattern: false,
    fix,
  })

  const results = await eslint.lintFiles(['.'])
  if (fix) await ESLint.outputFixes(results)

  const formatter = await eslint.loadFormatter('stylish')
  const output = formatter.format(results)
  if (output) process.stdout.write(output)

  const errorCount = results.reduce((acc, r) => acc + r.errorCount, 0)
  const warningCount = results.reduce((acc, r) => acc + r.warningCount, 0)

  // Em CI, warnings também falham
  if (process.env.CI && warningCount > 0) {
    process.exitCode = 1
  } else if (errorCount > 0) {
    process.exitCode = 1
  } else {
    process.exitCode = 0
  }
}

function hasLocalPrettierConfig(cwd = process.cwd()) {
  // 1) Arquivos de config suportados
  const fileCandidates = [
    'prettier.config.cjs',
    'prettier.config.js',
    'prettier.config.mjs',
    '.prettierrc',
    '.prettierrc.cjs',
    '.prettierrc.js',
    '.prettierrc.mjs',
    '.prettierrc.json',
    '.prettierrc.yml',
    '.prettierrc.yaml',
  ].map((p) => resolve(cwd, p))
  if (fileCandidates.some((p) => existsSync(p))) return true

  // 2) package.json só conta se tiver o campo "prettier"
  const pkgPath = resolve(cwd, 'package.json')
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
      if (pkg && pkg.prettier) return true
    } catch {
      // ignore JSON parse errors
    }
  }
  return false
}

function runPrettier(write) {
  const prettierBin = require.resolve('prettier/bin/prettier.cjs')
  const patterns =
    args.passthrough.length > 0
      ? args.passthrough
      : ['**/*.{js,jsx,ts,tsx,json,md,mdx,css,scss,html,yml,yaml}']

  const cliArgs = [
    write ? '--write' : '--check',
    '--log-level',
    'warn',
    ...patterns,
  ]

  // Se não houver config local, injeta o preset do pacote
  if (!hasLocalPrettierConfig()) {
    try {
      const defaultCfg = require.resolve('@inovatecjp/eslint-config/prettier')
      cliArgs.unshift('--config', defaultCfg)
    } catch {
      // se não resolver, segue sem --config
    }
  }

  const child = spawn(process.execPath, [prettierBin, ...cliArgs], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })

  child.on('exit', (code) => process.exit(code ?? 1))
}

;(async () => {
  try {
    if (args.cmd === 'format') return runPrettier(true)
    if (args.cmd === 'format:check') return runPrettier(false)
    return await runESLint()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
