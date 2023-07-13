/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
    },
    container: {
      padding: "2rem",
      center: true,
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: true,
  },
};