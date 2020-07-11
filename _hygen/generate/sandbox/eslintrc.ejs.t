---
to: sandbox/.eslintrc.js
---
/** @type import('eslint').Linter.BaseConfig */
module.exports = {
  env: {
    node: true
  },
  rules: {
    "prefer-function-component-type": ["error", { prefer: "React.FC" }],
  },
};
