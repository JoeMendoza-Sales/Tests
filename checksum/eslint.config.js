// @ts-check
// ESLint 9+ flat config for Checksum Playwright tests
// Minimal and modern per typescript-eslint Quickstart + Playwright recommended
// Dev dependencies to add:
//   npm i -D eslint @eslint/js typescript typescript-eslint @typescript-eslint/eslint-plugin eslint-plugin-playwright

import tseslint from "typescript-eslint";

export default tseslint.config(
  // Project-specific options for typed linting
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
    },
  },
  // Ignores
  {
    ignores: [
      "node_modules/",
      "test-results/",
      "playwright-report/",
      "blob-report/",
      "playwright/.cache/",
      "**/*.js",
      "**/.eval.checksum.spec.ts",
    ],
  }
);
