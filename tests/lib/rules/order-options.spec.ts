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
      code: `
    module.exports = {
      plugins: ["some-plugin"],
      extends: [
        "plugin:some-plugin/recommended",
      ],
    };
    `,
      filename: ".eslintrc.js",
    },
  ],
  invalid: [
    {
      code: `
      module.exports = {
        extends: [
          "plugin:some-plugin/recommended",
        ],
        rules: {},
        parser: 'aaaaa',
        plugins: ["some-plugin"],
        aaa: 'aaaaa',
        bbb: 'bbbbb',
      };
      `,
      output: `
      module.exports = {
        rules: {},
        plugins: ["some-plugin"],
        extends: [
          "plugin:some-plugin/recommended",
        ],
        parser: 'aaaaa',
        aaa: 'aaaaa',
        bbb: 'bbbbb',
      };
      `,
      filename: "/hogehoge/.eslintrc.js",
      errors: [
        { messageId: "orderOptions" },
        { messageId: "orderOptions" },
        { messageId: "orderOptions" },
        { messageId: "orderOptions" },
      ],
    },
  ],
});
