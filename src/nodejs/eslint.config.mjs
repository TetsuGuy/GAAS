import eslint from "@eslint/js"
import tseslint from "typescript-eslint"
import gitignore from "eslint-config-flat-gitignore"

export default tseslint.config(
  gitignore(),
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": ["warn", { ignoreRestArgs: true }],
      "@typescript-eslint/no-unused-vars": ["warn"],
    },
  }
)
