module.exports = {
  root: true,
  parser: `@typescript-eslint/parser`,
  parserOptions: {
    ecmaVersion: 9,
  },
  extends: [
    `eslint:recommended`,
    `plugin:@typescript-eslint/recommended`,
    `prettier`,
  ],
  plugins: [`@typescript-eslint`, `prettier`],
  env: { node: true, es6: true, jest: true },
  rules: {
    "@typescript-eslint/no-var-requires": `off`,
    "@typescript-eslint/quotes": [`error`, `backtick`],
  },
}
