export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    future: {
        compatibilityVersion: 4,
    },

    modules: [
        "@nuxt/eslint",
        "@nuxt/fonts",
        "@nuxt/image",
        "@pinia/nuxt",
        "@nuxtjs/tailwindcss",
        "@nuxtjs/color-mode",
        "nuxt-svg-sprite-icon",
        "@vueuse/nuxt",
    ],

    css: ["~/assets/styles/main.css", "~/assets/styles/custom.css"],

    colorMode: {
        dataValue: "theme",
        storageKey: "nuxt-color-mode",
        preference: "light",
        fallback: "light",
        classSuffix: "",
    },

    ssr: false,

    pinia: {
        storesDirs: ["./app/stores/**"],
    },

    image: {
        format: ["webp"],
        dir: "assets/images",
    },

    svgSprite: {
        input: "./app/assets/icons",
    },

    srcDir: "app/",

    devServer: {
        port: 7000,
    },

    app: {
        head: {
            htmlAttrs: { dir: "rtl", lang: "fa" },
        },
    },

    components: [
        "~/components/global",
        "~/components/common",
        "~/components/template",
    ],

    eslint: {
        config: {
            standalone: false,
        },
    },
});

// https://nuxt.com/docs/api/configuration/nuxt-config
