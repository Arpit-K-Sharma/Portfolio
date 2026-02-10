import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                // Custom color palette - premium dark theme
                background: {
                    DEFAULT: "#0a0a0a",
                    secondary: "#111111",
                    tertiary: "#1a1a1a",
                },
                foreground: {
                    DEFAULT: "#fafafa",
                    muted: "#a1a1aa",
                    subtle: "#71717a",
                },
                primary: {
                    DEFAULT: "#6366f1", // Indigo
                    hover: "#818cf8",
                    light: "#a5b4fc",
                },
                accent: {
                    DEFAULT: "#8b5cf6", // Purple accent
                    hover: "#a78bfa",
                },
                border: {
                    DEFAULT: "#27272a",
                    light: "#3f3f46",
                },
                card: {
                    DEFAULT: "#18181b",
                    hover: "#27272a",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-in-out",
                "slide-up": "slideUp 0.5s ease-out",
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
            backdropBlur: {
                xs: "2px",
            },
        },
    },
    plugins: [],
};

export default config;
