/**
 * Note: OptionKeys becomes default order.
 */

/**
 * @see https://github.com/eslint/eslint/blob/master/conf/config-schema.js
 * @see https://github.com/eslint/eslint/blob/master/lib/shared/types.js - ConfigData
 */
const eslint = [
  "root",
  "ignorePatterns",
  "env",
  "globals",
  "parser",
  "parserOptions",
  "noInlineConfig",
  "processor",
  "plugins",
  "extends",
  "settings",
  "rules",
  "overrides",
  "reportUnusedDisableDirectives",
] as const;

/**
 * @see https://stylelint.io/user-guide/configure
 */
const stylelint = [
  "ignoreFiles",
  "processors",
  "plugins",
  "extends",
  "defaultSeverity",
  "rules",
] as const;

/**
 * @see https://prettier.io/docs/en/options.html
 */
const prettier = [
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
  eslint,
  stylelint,
  prettier,
} as const;
