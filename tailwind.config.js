/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#202923",
        paper: "#e9e4d9",
        moss: "#596b56",
        rust: "#a84f3d",
        brass: "#bd9b62"
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        sans: ['"DM Sans"', "sans-serif"],
        mono: ['"DM Mono"', "monospace"]
      }
    }
  },
  plugins: []
};