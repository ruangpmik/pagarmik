import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pagar: {
          50: "rgb(var(--color-pagar-50) / <alpha-value>)",
          100: "rgb(var(--color-pagar-100) / <alpha-value>)",
          200: "rgb(var(--color-pagar-200) / <alpha-value>)",
          300: "rgb(var(--color-pagar-300) / <alpha-value>)",
          400: "rgb(var(--color-pagar-400) / <alpha-value>)",
          500: "rgb(var(--color-pagar-500) / <alpha-value>)",
          600: "rgb(var(--color-pagar-600) / <alpha-value>)",
          700: "rgb(var(--color-pagar-700) / <alpha-value>)",
          800: "rgb(var(--color-pagar-800) / <alpha-value>)",
          900: "rgb(var(--color-pagar-900) / <alpha-value>)",
          950: "rgb(var(--color-pagar-950) / <alpha-value>)",
        },
        ink: {
          50: "rgb(var(--color-ink-50) / <alpha-value>)",
          100: "rgb(var(--color-ink-100) / <alpha-value>)",
          900: "rgb(var(--color-ink-900) / <alpha-value>)",
          950: "rgb(var(--color-ink-950) / <alpha-value>)",
        },
        gold: {
          400: "rgb(var(--color-gold-400) / <alpha-value>)",
          500: "rgb(var(--color-gold-500) / <alpha-value>)",
        },
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
