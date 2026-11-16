import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import unusedImports from "eslint-plugin-unused-imports";
import { defineConfig } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([
  {
    extends: [
      ...nextCoreWebVitals,
      ...compat.extends("eslint:recommended"),
      ...compat.extends("prettier")
    ],

    plugins: {
      "unused-imports": unusedImports
    },

    rules: {
      "no-duplicate-case": "off",
      "no-unused-vars": "warn",
      "no-func-assign": "error",
      "unused-imports/no-unused-imports": "error",
      "react-hooks/immutability": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/use-memo": "warn"
    }
  }
]);
