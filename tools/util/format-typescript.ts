import eslint from "eslint";

export const formatTypescript = async (content: string) => {
  const linter = new eslint.ESLint({ fix: true });
  const results = await linter.lintText(content);
  linter.lintFiles;

  return results[0].output;
};
