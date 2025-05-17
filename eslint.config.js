module.exports = [
  {
    ignores: [
      "node_modules/**",
      "coverage/**",
      "lib/**",
      "example/.expo/**",
      "**/*.d.ts",
      "babel.config.js",
      "example/babel.config.js",
      "eslint.config.js",
      "scripts/bootstrap.js",
      "package.json"
    ],
  },
  // Config for TypeScript files in src/
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: require("@typescript-eslint/parser"),
      globals: {
        browser: true,
        es2021: true,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.json",
      },
    },
    plugins: {
      react: require("eslint-plugin-react"),
      "react-native": require("eslint-plugin-react-native"),
      import: require("eslint-plugin-import"),
      prettier: require("eslint-plugin-prettier"),
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...require("eslint-config-prettier").rules,
      "react-native/no-unused-styles": "warn",
      "react-native/split-platform-components": "warn",
      "react-native/no-inline-styles": "warn",
      "react-native/no-color-literals": "warn",
      "react-native/no-single-element-style-arrays": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      "@typescript-eslint/no-explicit-any": "warn", // Enforce for src/
    },
  },
  // Config for TypeScript files in example/
  {
    files: ["example/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: require("@typescript-eslint/parser"),
      globals: {
        browser: true,
        es2021: true,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: "./example/tsconfig.json",
      },
    },
    plugins: {
      react: require("eslint-plugin-react"),
      "react-native": require("eslint-plugin-react-native"),
      import: require("eslint-plugin-import"),
      prettier: require("eslint-plugin-prettier"),
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...require("eslint-config-prettier").rules,
      "react-native/no-unused-styles": "warn",
      "react-native/split-platform-components": "warn",
      "react-native/no-inline-styles": "warn",
      "react-native/no-color-literals": "warn",
      "react-native/no-single-element-style-arrays": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      "@typescript-eslint/no-explicit-any": "off", // Disable for example/
    },
  },
  // Config for JavaScript files
  {
    files: ["**/*.js", "!src/**/*.js", "!example/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        node: true,
      },
    },
    plugins: {
      prettier: require("eslint-plugin-prettier"),
      import: require("eslint-plugin-import"),
    },
    rules: {
      ...require("eslint-config-prettier").rules,
    },
  },
];