// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},
    modules: ['@nuxt/eslint', '@nuxt/image', "nuxt-icons", "@vueuse/nuxt", "@pinia/nuxt", "@sentry/nuxt/module"],
    ssr: false,
    vite: {
        plugins: [tailwindcss()],
    },
    css: ["~/assets/stylesheets/main.css"],
    runtimeConfig: {
        public: {
            sentry: {
                dsn: process.env.SENTRY_DSN_PUBLIC,
            }
        }
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