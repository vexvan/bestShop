module.exports = [
  // Global ignores
  {
    ignores: ["node_modules/**", "dist/**", "build/**"],
  },

  // Lint all JS under src/js and src/js/components
  {
    files: ["src/js/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-console": "off",
    },
  },
];