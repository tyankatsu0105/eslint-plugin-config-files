/**
 * Note: OptionKeys becomes default order.
 */

/**
 * @see
 */
const eslintOptionKeys = ["rules", "plugins", "extends"] as const;

/**
 * @see https://stylelint.io/user-guide/configure
 */
const stylelintOptionKeys = [
  "rules",
  "defaultSeverity",
  "extends",
  "plugins",
  "processors",
  "ignoreFiles",
] as const;

/**
 * @see https://prettier.io/docs/en/options.html
 */
const prettierOptionKeys = [
  "printWidth",
  "tabWidth",
  "useTabs",
  "semi",
  "singleQuote",
  "quoteProps",
  "jsxSingleQuote",
  "trailingComma",
  "bracketSpacing",
  "jsxBracketSameLine",
  "arrowParens",
  "rangeStart",
  "rangeEnd",
  "parser",
  "filepath",
  "requirePragma",
  "insertPragma",
  "proseWrap",
  "htmlWhitespaceSensitivity",
  "vueIndentScriptAndStyle",
  "endOfLine",
] as const;

export const configOptionKeys = {
  eslint: eslintOptionKeys,
  stylelint: stylelintOptionKeys,
  prettier: prettierOptionKeys,
};
