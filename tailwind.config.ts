import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { 950: "#001a34", 900: "#002244", 800: "#003366", 700: "#014d94" },
        pmik: { teal: "#0177cc", orange: "#f97316" },
        teal: {
          50: "#eff6fc",
          100: "#d7e9f9",
          200: "#b3d6f3",
          300: "#82bdea",
          400: "#4a9bdd",
          500: "#0177cc",
          600: "#0165ad",
          700: "#01508a",
          800: "#0a3f6b",
          900: "#0a3358",
          950: "#06233d",
        },
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
        status: {
          danger: "var(--danger)",
          "danger-bg": "var(--danger-bg)",
          "danger-border": "var(--danger-border)",
          warning: "var(--warning)",
          "warning-bg": "var(--warning-bg)",
          "warning-border": "var(--warning-border)",
          success: "var(--success)",
          "success-bg": "var(--success-bg)",
          "success-border": "var(--success-border)",
          info: "var(--info)",
          "info-bg": "var(--info-bg)",
          "info-border": "var(--info-border)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"],
        serif: ["Charter", "Bitstream Charter", "Sitka Text", "Cambria", "Georgia", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
