module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
    "prettier", // Disables ESLint rules that might conflict with Prettier
    "plugin:prettier/recommended", // Enables eslint-plugin-prettier and displays Prettier errors as ESLint errors.
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
  ],
  plugins: ["@typescript-eslint", "import", "prettier"],
  rules: {
    quotes: ["error", "double"],
    "import/no-unresolved": 0,
    "prettier/prettier": "error", // Report Prettier formatting issues as ESLint errors.
    // Optionally, update max-len if you want a different limit:
    // "max-len": ["error", { code: 100 }],
  },
};
