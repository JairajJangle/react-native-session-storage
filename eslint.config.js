const { ESLint } = require("eslint");

module.exports = new ESLint({
  baseConfig: {
    env: {
      browser: true,
      es2021: true,
    },
    extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:react-native/all",
    ],
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: ["react", "react-native", "import"],
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react-native/no-unused-styles": "warn",
      "react-native/split-platform-components": "warn",
      "react-native/no-inline-styles": "warn",
      "react-native/no-color-literals": "warn",
      "react-native/no-single-element-style-arrays": "warn",
    },
  },
});
