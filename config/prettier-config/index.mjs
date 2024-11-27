/** @typedef {import('prettier').Config} PrettierConfig */

/** @type { PrettierConfig } */
const config = {
  plugins: ['prettier-plugin-tailwindcss'],
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: false, // semicolons é o ponto e vírgula
  singleQuote: true,
  quoteProps: 'as-needed', // aspas nas propriedades de um objeto
  jsxSingleQuote: false, // aspas simples nos atributos html de um jsx
  trailingComma: 'es5', // adicionar uma vírgula no último elemento de um array ou objeto
  bracketSpacing: true, // espaçamento entre as chaves/colchetes
  arrowParens: 'always', // parênteses ao redor do parâmetro de uma arrow function
  endOfLine: 'auto',
  bracketSameLine: false
}

export default config