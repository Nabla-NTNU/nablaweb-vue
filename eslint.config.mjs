import { defineConfig } from "eslint/config"
import typescriptEslint from "@typescript-eslint/eslint-plugin"
import parser from "vue-eslint-parser"
import path from "node:path"
import { fileURLToPath } from "node:url"
import js from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
})

export default defineConfig([
    {
        extends: compat.extends(
            "eslint:recommended",
            "plugin:@typescript-eslint/recommended",
            "plugin:vue/recommended",
            "prettier",
        ),

        rules: {
            "@typescript-eslint/no-unused-vars": "warn",
        },

        plugins: {
            "@typescript-eslint": typescriptEslint,
        },

        languageOptions: {
            parser: parser,
            ecmaVersion: 2022,
            sourceType: "module",

            parserOptions: {
                parser: "@typescript-eslint/parser",
            },
        },
    },
])
