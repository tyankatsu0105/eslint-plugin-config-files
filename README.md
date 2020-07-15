# ESLint Plugin Config Files

[![npm version](https://badge.fury.io/js/eslint-plugin-config-files.svg?style=flat)](https://badge.fury.io/js/eslint-plugin-config-files)
[![deploy](https://img.shields.io/badge/deploy-🛳%20Ship.js-blue?style=flat)](https://github.com/algolia/shipjs)
[![deploy](https://img.shields.io/badge/License-MIT-green.svg?style=flat)](https://img.shields.io/badge/License-MIT-green.svg)

ESLint plugin for config files (ex .eslintrc.js, .stylelintrc.js)

## Usage

```bash
npm install -D eslint eslint-plugin-config-files
```

```js
module.exports = {
  plugins: ["config-files"],
  rules: {
    "config-files/xxxxx": "warn",
  },
};
```

## [Rules](https://github.com/tyankatsu0105/eslint-plugin-config-files/blob/master/docs/rules/README.md)

## [Configs](https://github.com/tyankatsu0105/eslint-plugin-config-files/blob/master/lib/configs/README.md)

## LICENSE(MIT)

See [LICENSE file](https://github.com/tyankatsu0105/eslint-plugin-config-files/blob/master/LICENSE)
