import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pagar: {
          50: "#eef7f4",
          100: "#d7ece5",
          200: "#aed9cc",
          300: "#7dbfab",
          400: "#4da488",
          500: "#2b8a6e",
          600: "#1f6e58",
          700: "#1b5847",
          800: "#17463b",
          900: "#143b32",
          950: "#0a211d",
        },
        ink: {
          50: "#f6f7f8",
          100: "#eaecee",
          900: "#141a20",
          950: "#0b0f14",
        },
        gold: { 400: "#c9a227", 500: "#b08d1f" },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Source Serif 4", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
