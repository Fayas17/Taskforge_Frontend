import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import prettier from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { 
    files: ["**/*.{ts,tsx}"], 
    plugins: { react, prettier }, 
    extends: ["js/recommended"], 
    languageOptions: { 
      globals: globals.browser 
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "prettier/prettier": "error"
    },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
]);
