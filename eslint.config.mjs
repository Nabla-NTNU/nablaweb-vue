import js from "@eslint/js"
import tseslint from "typescript-eslint"
import vue from "eslint-plugin-vue"
import prettier from "eslint-config-prettier"
import parser from "vue-eslint-parser"
import globals from "globals"

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...vue.configs["flat/recommended"],
    {
        languageOptions: {
            parser,
            parserOptions: {
                parser: "@typescript-eslint/parser",
            },
            ecmaVersion: 2022,
            sourceType: "module",
            globals: globals.browser,
        },
    },
    prettier,
]