/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#102C57",
        cream: "#FFFDE8",
        yellow: "#F4D03F",
        orange: "#E28F30",
        accent: "#C25B3C",
        dark: "#1C1C1C",
      },
    },
  },
  plugins: [],
}