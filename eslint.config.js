import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

import elintPluginReact from "eslint-plugin-react";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {files: ["**/*.js"], languageOptions: {sourceType: "script"}},
  {languageOptions: {globals: globals.browser}},
  {
    plugins: {
      prettier: eslintPluginPrettier,
      react: elintPluginReact
    }
  },
  {
    settings: {
      react: {
        version: "detect", // Auto-detect React version
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  elintPluginReact.configs.flat.recommended,
  eslintConfigPrettier,
  {rules: {"react/react-in-jsx-scope": "off"}}
];