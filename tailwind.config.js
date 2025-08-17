/** @type {import("tailwindcss").Config} */

import daisyuiThemes from "daisyui/src/theming/themes";

module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
        ".vitepress/theme/*.{js,ts,vue}",
    ],

    theme: {
        extend: {
            colors: {
                black: "rgba(var(--black), <alpha-value>)",
                "darker-primary": "rgba(var(--darker-primary), <alpha-value>)",
                white: "rgba(var(--white), <alpha-value>)",
                "gray-1": "rgba(var(--gray-1), <alpha-value>)",
                "gary-2": "rgba(var(--gray-2), <alpha-value>)",
                "gray-3": "rgba(var(--gray-3), <alpha-value>)",

                //  others(hovers-borders-etc...)
                "hover-black": "rgba(var(--black), <alpha-value>)",
            },
        },
    },

    daisyui: {
        themes: [
            {
                light: {
                    ...daisyuiThemes.light,
                    primary: "rgba(0,193,164,1)",
                    error: "rgba(254, 70, 87, 1)",
                    warning: "rgba(255, 186, 0, 1)",
                    "--darker-primary": "8, 112, 112",
                    "--black": "18, 44, 52",
                    "--white": "255, 255, 255",
                    "--gray-1": "243, 244, 248",
                    "--gray-2": "213, 219, 224",
                    "--gray-3": "232, 232, 232",

                    //  others(hovers-borders-etc...)
                    "--hover-black": "8, 28, 34",
                },
            },
            {
                dark: {
                    ...daisyuiThemes.dark,
                    primary: "rgba(0,193,164,1)",
                },
            },
        ],
    },
};
