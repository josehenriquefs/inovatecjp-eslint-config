#!/usr/bin/env node
// CLI da InovatecJP — ESLint (API) + Prettier, com stacks e --typeaware
import { ESLint } from 'eslint'
import { spawn } from 'node:child_process'
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

  const eslint = new ESLint({
    useEslintrc: false,
    overrideConfigFile,
    errorOnUnmatchedPattern: false,
    fix
  })

  const results = await eslint.lintFiles(['.'])
  if (fix) await ESLint.outputFixes(results)

  const formatter = await eslint.loadFormatter('stylish')
  const output = formatter.format(results)
  if (output) process.stdout.write(output)

  const errorCount = results.reduce((acc, r) => acc + r.errorCount, 0)
  const warningCount = results.reduce((acc, r) => acc + r.warningCount, 0)

  // Em CI, travamos em warning também (comportamento compatível com README)
  if (process.env.CI && warningCount > 0) {
    process.exitCode = 1
  } else if (errorCount > 0) {
    process.exitCode = 1
  } else {
    process.exitCode = 0
  }
}

function runPrettier(write) {
  // Executa o bin do Prettier via Node (sem depender de PATH)
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
    // Prettier respeita .prettierignore; se quiser, podemos incluir um padrão aqui.
  ]

  const child = spawn(process.execPath, [prettierBin, ...cliArgs], {
    stdio: 'inherit',
    shell: process.platform === 'win32'
  })

  child.on('exit', code => process.exit(code ?? 1))
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
