/**
 * Note: OptionKeys becomes default order.
 */

const eslintOptionKeys = ["rules", "plugins", "extends"] as const;
const stylelintOptionKeys = [
  "rules",
  "plugins",
  "extends",
  "processors",
] as const;

export const configOptionKeys = {
  eslint: eslintOptionKeys,
  stylelint: stylelintOptionKeys,
};
