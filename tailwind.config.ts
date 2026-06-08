import type { Config } from "tailwindcss";
import formsPlugin from "@tailwindcss/forms";
import containerQueriesPlugin from "@tailwindcss/container-queries";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            "colors": {
                "tertiary-fixed-dim": "#ccc6b5",
                "tertiary-container": "#434134",
                "on-tertiary-fixed": "#1e1c11",
                "error-container": "#ffdad6",
                "on-secondary-fixed-variant": "#653e00",
                "secondary-fixed": "#ffddb7",
                "surface-bright": "#fff8f6",
                "outline-variant": "#dfbfbd",
                "on-tertiary-container": "#b1ad9c",
                "surface-variant": "#f2deda",
                "secondary-fixed-dim": "#ffb95e",
                "surface-container-low": "#fff0ee",
                "surface-container-highest": "#f2deda",
                "on-secondary-container": "#6d4400",
                "primary-fixed-dim": "#ffb3af",
                "on-primary-fixed": "#410006",
                "inverse-surface": "#3a2e2b",
                "on-error-container": "#93000a",
                "error": "#ba1a1a",
                "on-primary": "#ffffff",
                "on-primary-fixed-variant": "#891b22",
                "surface": "#fff8f6",
                "secondary": "#855400",
                "inverse-on-surface": "#ffedea",
                "background": "#fff8f6",
                "primary": "#5d000c",
                "surface-container-high": "#f8e4e0",
                "on-error": "#ffffff",
                "surface-dim": "#ead6d2",
                "primary-container": "#80141c",
                "surface-container": "#fee9e6",
                "on-tertiary-fixed-variant": "#4a4739",
                "on-secondary": "#ffffff",
                "tertiary-fixed": "#e8e2d0",
                "on-surface-variant": "#584140",
                "tertiary": "#2d2b1f",
                "outline": "#8b716f",
                "on-primary-container": "#ff8b87",
                "on-surface": "#241917",
                "secondary-container": "#fdae41",
                "inverse-primary": "#ffb3af",
                "on-secondary-fixed": "#2a1700",
                "on-background": "#241917",
                "on-tertiary": "#ffffff",
                "primary-fixed": "#ffdad8",
                "surface-tint": "#aa3436",
                "surface-container-lowest": "#ffffff"
            },
            "borderRadius": {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
            },
            "spacing": {
                "stack-md": "16px",
                "base": "8px",
                "stack-lg": "32px",
                "margin-desktop": "40px",
                "container-max": "1280px",
                "margin-mobile": "16px",
                "gutter": "24px",
                "stack-sm": "4px"
            },
            "fontFamily": {
                "headline-md": ["var(--font-anton)", "sans-serif"],
                "label-sm": ["var(--font-inter)", "sans-serif"],
                "body-lg": ["var(--font-inter)", "sans-serif"],
                "label-lg": ["var(--font-inter)", "sans-serif"],
                "body-md": ["var(--font-inter)", "sans-serif"],
                "headline-lg-mobile": ["var(--font-anton)", "sans-serif"],
                "display": ["var(--font-anton)", "sans-serif"],
                "headline-lg": ["var(--font-anton)", "sans-serif"]
            },
            "fontSize": {
                "headline-md": ["24px", { "lineHeight": "28px", "fontWeight": "400" }],
                "label-sm": ["12px", { "lineHeight": "16px", "fontWeight": "600" }],
                "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "500" }],
                "label-lg": ["14px", { "lineHeight": "20px", "letterSpacing": "0.05em", "fontWeight": "700" }],
                "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
                "headline-lg-mobile": ["32px", { "lineHeight": "36px", "fontWeight": "400" }],
                "display": ["64px", { "lineHeight": "72px", "letterSpacing": "0.02em", "fontWeight": "400" }],
                "headline-lg": ["48px", { "lineHeight": "52px", "fontWeight": "400" }]
            }
        }
    },
    plugins: [
        formsPlugin,
        containerQueriesPlugin
    ],
};
export default config;
