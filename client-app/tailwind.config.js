/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#75B657",      // Brand green (Grean)
        "primary-light": "#bbf7d0",
        "primary-dark": "#4B7A3C",
        accent: "#F8D860",       // Bright yellow accent
        neutral: {
          light: "#F5F5DC",
          gray: "#B0B0B0",
          dark: "#2B2B2B",
        },
      },
      fontFamily: {
        sans: ["Lexend Deca", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
};