/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brutal: {
          green: "#2D7A4F",
          yellow: "#FFE03B",
          bg: "#F5F5F0",
          black: "#111111",
        },
      },
    },
  },
  plugins: [],
};
