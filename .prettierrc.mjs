// .prettierrc.mjs
/** @type {import("prettier").Config} */
export default {
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro'
      }
    }
  ],
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'none',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  htmlWhitespaceSensitivity: 'ignore',
  quoteProps: 'as-needed',
  embeddedLanguageFormatting: 'auto',
  singleAttributePerLine: true
};
