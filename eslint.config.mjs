// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
import importPlugin from "eslint-plugin-import";

export default withNuxt(
  // Your custom configs here
  {
    plugins: {
      import: importPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
        node: {
          extensions: [".js", ".ts", ".vue", ".tsx"],
        },
      },
    },
    rules: {
      // 核心验证规则
      "import/no-unresolved": "error",
      "import/named": "error",
      "import/default": "error",
      "import/namespace": "error",
      "import/export": "error",

      // 代码风格规则
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/no-duplicates": "error",
      "import/no-absolute-path": "error",
      "import/no-cycle": "warn",
    },
  }
);
