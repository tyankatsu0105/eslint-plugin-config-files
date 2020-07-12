import path from "path";
import { TSESLint } from "@typescript-eslint/experimental-utils";

type Filename = ReturnType<
  TSESLint.RuleContext<string, unknown[]>["getFilename"]
>;

/**
 * Get only file name excepted path.
 */
export const getFilename = (filenameFromEslint: Filename) => {
  const filename = path.basename(filenameFromEslint);

  return { filename };
};
