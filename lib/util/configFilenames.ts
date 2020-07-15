const eslint = [".eslintrc.js"] as const;

const stylelint = [".stylelintrc.js"] as const;

const prettier = [".prettierrc.js", "prettier.config.js"] as const;

export const configFilenames = {
  eslint,
  stylelint,
  prettier,
} as const;
