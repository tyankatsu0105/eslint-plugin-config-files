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
    {
      /**
       * ignore file if filename is unexpected
       * @see configFilenames.ts
       */
      code: `
    module.exports = {
      a: [],
      b: [],
    };
    `,
      filename: ".foobar.js",
    },
    {
      /**
       * run rule if filename is expected and matched
       */
      code: `
    module.exports = {
      plugins: [],
      extends: [],
    };
    `,
      filename: ".eslintrc.js",
    },
  ],
  invalid: [
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
      filename: "/hogehoge/.eslintrc.js",
      errors: [{ messageId: "orderOptions" }, { messageId: "orderOptions" }],
    },
  ],
});
