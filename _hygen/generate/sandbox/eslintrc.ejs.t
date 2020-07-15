---
to: sandbox/.eslintrc.js
---
/** @type import('eslint').Linter.BaseConfig */
module.exports = {
	rules: {
		"order-options": [
			"warn",
			{
				override: [
					{
						order: "prettier",
						filenames: [".hogehogerc.js"],
					},
				],
			},
		],
	},
	extends: [],
	plugins: [],
	parserOptions: {
		sourceType: "module",
	},
};
