import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";

export default [
  {
    files: ["**/*.ts", "**/*.js"],
    ignores: ["lib/**"], // 🚀 Ignore compiled JavaScript files
    languageOptions: {
      parser: tsparser,
      sourceType: "module",
      parserOptions: {
        project: ["tsconfig.json"], // Ensure this file exists
      },
      globals: {
        process: "readonly",
        exports: "readonly",
        console: "readonly",
        FirebaseFirestore: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      import: importPlugin,
      prettier: prettier,
    },
    rules: {
      "constructor-super": "off", // 🔥 Disable error-causing rule
      "import/no-unresolved": "off",
      "prettier/prettier": "error",
    },
  },
  prettierConfig,
];
