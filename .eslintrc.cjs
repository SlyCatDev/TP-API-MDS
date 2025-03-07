module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    ignorePatterns: ["node_modules"],
    extends: ["eslint:recommended", "airbnb", "plugin:prettier/recommended"],
    plugins: ["@stylistic"],
    rules: {
        // Classic rules
        "no-console": ["warn", { allow: ["error"] }],

        // Prettier rules
        "prettier/prettier": [
        "error",
        {
            printWidth: 80,
            tabWidth: 2,
            useTabs: false,
            semi: true,
            singleQuote: false,
            quoteProps: "consistent",
            trailingComma: "all",
            bracketSpacing: true,
            bracketSameLine: false,
            arrowParens: "always",
            endOfLine: "auto",
            singleAttributePerLine: true,
        },
        ],
    },
};