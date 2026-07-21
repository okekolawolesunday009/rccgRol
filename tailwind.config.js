/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./data/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "background": "#ffffff",
        "surface": "#f8fafc",
        "surface-variant": "#f1f5f9",
        "on-surface": "#ffffff",
        "on-surface-variant": "#64748b",
        "primary": "#a1bff0",
        "primary-container": "#dbeafe",
        "on-primary": "#ffffff",
        "secondary": "#64748b",
        "secondary-container": "#f1f5f9",
        "tertiary":  "#a1bff0",
        "tertiary-container": "#a1bff0",
        "error": "#ef4444",
        "error-container": "#fef2f2",
        "outline": "#e2e8f0",
        "outline-variant": "#cbd5e1",
        "inverse-surface": "#1e293b",
        "inverse-on-surface": "#f8fafc",
        "surface-tint":  "#a1bff0",
      },
      fontFamily: {
        "headline": ["Newsreader", "serif"],
        "body": ["Manrope", "sans-serif"],
        "label": ["Manrope", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem",
      },
    },
  },
  plugins: [],
}
