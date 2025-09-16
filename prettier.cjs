// prettier.cjs
/** @type {import("prettier").Config} */
module.exports = {
  printWidth: 100,
  tabWidth: 4,
  useTabs: false,
  semi: true,
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  quoteProps: 'as-needed',
  proseWrap: 'preserve',
  htmlWhitespaceSensitivity: 'css',
  singleAttributePerLine: false,
  embeddedLanguageFormatting: 'auto',
  endOfLine: 'lf',
  requirePragma: false,
  insertPragma: false,
  experimentalTernaries: false
}
