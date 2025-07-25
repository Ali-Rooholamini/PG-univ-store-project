import {useRuntimeConfig} from "nuxt/app";
import * as Sentry from '@sentry/nuxt';

Sentry.init({
    // If set up, you can use your runtime config here
    dsn: useRuntimeConfig().public.sentry.dsn,
    sendDefaultPii: true,
});