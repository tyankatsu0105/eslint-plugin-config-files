import { RuleTester } from "../../util";

import rule from "../../../lib/rules/order-options";

const tester = new RuleTester({
  parser: "espree",
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2017,
  },
});

tester.run("order-options", rule, {
  valid: [
    /**
     * ignore file if filename is unexpected
     * @see configFilenames.ts
     */
    {
      code: `
    module.exports = {
      a: [],
      b: [],
    };
    `,
      filename: ".foobar.js",
    },

    /**
     * filename is expected
     */
    {
      code: `
    module.exports = {
      plugins: [],
      extends: [],
    };
    `,
      filename: ".eslintrc.js",
    },

    /**
     * override order by options. Both order and filenames should be filled.
     */
    {
      code: `
    module.exports = {
      extends: [],
      plugins: [],
    };
    `,
      options: [
        {
          override: [
            { order: ["extends", "plugins"], filenames: [".eslintrc.js"] },
          ],
        },
      ],
      filename: ".eslintrc.js",
    },

    /**
     * eslint
     */
    {
      code: `
    module.exports = {
      plugins: [],
      extends: [],
    };
    `,
      filename: ".eslintrc.js",
    },

    /**
     * stylelint
     */
    {
      code: `
    module.exports = {
      processors: [],
      defaultSeverity: '',
    };
    `,
      filename: ".stylelintrc.js",
    },

    /**
     * prettier 1
     */
    {
      code: `
    module.exports = {
      useTabs: true,
      singleQuote: true,
    };
    `,
      filename: ".prettierrc.js",
    },

    /**
     * prettier 2
     */
    {
      code: `
    module.exports = {
      useTabs: true,
      singleQuote: true,
    };
    `,
      filename: "prettierrc.config.js",
    },
  ],
  invalid: [
    /**
     * eslint
     */
    {
      code: `
      module.exports = {
        extends: [],
        plugins: [],
      };
      `,
      output: `
      module.exports = {
        plugins: [],
        extends: [],
      };
      `,
      filename: ".eslintrc.js",
      errors: [{ messageId: "orderOptions" }, { messageId: "orderOptions" }],
    },

    /**
     * stylelint
     */
    {
      code: `
      module.exports = {
        rules: {},
        extends: [],
      };
      `,
      output: `
      module.exports = {
        extends: [],
        rules: {},
      };
      `,
      filename: ".stylelintrc.js",
      errors: [{ messageId: "orderOptions" }, { messageId: "orderOptions" }],
    },

    /**
     * prettier 1
     */
    {
      code: `
      module.exports = {
        useTabs: true,
        tabWidth: 2,
      };
      `,
      output: `
      module.exports = {
        tabWidth: 2,
        useTabs: true,
      };
      `,
      filename: ".prettierrc.js",
      errors: [{ messageId: "orderOptions" }, { messageId: "orderOptions" }],
    },

    /**
     * prettier 1
     */
    {
      code: `
      module.exports = {
        useTabs: true,
        tabWidth: 2,
      };
      `,
      output: `
      module.exports = {
        tabWidth: 2,
        useTabs: true,
      };
      `,
      filename: "prettier.config.js",
      errors: [{ messageId: "orderOptions" }, { messageId: "orderOptions" }],
    },

    /**
     * override filenames option
     */
    {
      code: `
      module.exports = {
        tabWidth: 2,
        printWidth: 80,
        useTabs: true,
      };
      `,
      output: `
      module.exports = {
        printWidth: 80,
        tabWidth: 2,
        useTabs: true,
      };
      `,
      filename: ".override.prettier.config.js",
      options: [
        {
          override: [
            {
              order: [
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
              ],
              filenames: [".override.prettier.config.js"],
            },
          ],
        },
      ],
      errors: [{ messageId: "orderOptions" }, { messageId: "orderOptions" }],
    },

    /**
     * override order option
     */
    {
      code: `
      module.exports = {
        printWidth: 80,
        tabWidth: 2,
        useTabs: true,
      };
      `,
      output: `
      module.exports = {
        tabWidth: 2,
        useTabs: true,
        printWidth: 80,
      };
      `,
      filename: "prettier.config.js",
      options: [
        {
          override: [
            {
              order: ["tabWidth", "useTabs", "printWidth"],
              filenames: ["prettier.config.js", ".prettierrc.js"],
            },
          ],
        },
      ],
      errors: [
        { messageId: "orderOptions" },
        { messageId: "orderOptions" },
        { messageId: "orderOptions" },
      ],
    },

    /**
     * user can set string for order and filenames
     */
    {
      code: `
      module.exports = {
        tabWidth: 2,
        printWidth: 80,
        useTabs: true,
      };
      `,
      output: `
      module.exports = {
        printWidth: 80,
        tabWidth: 2,
        useTabs: true,
      };
      `,
      filename: ".eslintrc.js",
      options: [
        {
          override: [
            {
              order: "prettier",
              filenames: "eslint",
            },
          ],
        },
      ],
      errors: [{ messageId: "orderOptions" }, { messageId: "orderOptions" }],
    },
  ],
});
