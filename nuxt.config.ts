// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},
    modules: ["@nuxt/eslint",
        "@nuxt/fonts",
        "@nuxt/image",
        "@pinia/nuxt",
        "@nuxtjs/tailwindcss",
        "@nuxtjs/color-mode",
        "nuxt-svg-sprite-icon",
        "@vueuse/nuxt", "@sentry/nuxt/module"],

    ssr: false,

   css: ["~/assets/styles/main.css", "~/assets/styles/custom.css"],

    colorMode: {
        dataValue: "theme",
        storageKey: "nuxt-color-mode",
        preference: "light",
        fallback: "light",
        classSuffix: "",
    },

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

    runtimeConfig: {
        public: {
            sentry: {
                dsn: process.env.SENTRY_DSN_PUBLIC,
            }
        }
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

    sentry: {
        sourceMapsUploadOptions: {
            org: "alicompany-y3",
            project: "javascript-nuxt",
            authToken: process.env.SENTRY_AUTH_TOKEN,
        }
    },
    sourcemap: {
        client: "hidden",
    }
})