// @ts-check
// check eslint configs with run npx @eslint/config-inspector@latest at root level
// or use devtools eslint section

// import withNuxt from "./.nuxt/eslint.config.mjs";
import antfu from "@antfu/eslint-config";

export default antfu(
    {
        stylistic: {
            semi: true,
            quotes: "double",
            indent: 4,
        },

        vue: true,
    },
    {
        rules: {
            "style/semi": ["warn"],
            "style/quotes": ["warn"],
            "style/indent": ["warn"],
        },
    },
    {
        files: ["**/*.vue"],
        rules: {
            "vue/operator-linebreak": ["warn", "before"],
        },
    },
    {
        files: ["*.vue"],
        rules: {
            "vue/prop-name-casing": ["error", "camelCase"],
        },
    },
);
