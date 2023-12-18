/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#313d51",
        primaryLight: "#38465d",
        primaryLightest: "#838b97",
        primaryDark: "#191F29",
        secondary: "#ffc131",
        secondaryLight: "#ffc43b",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      fontSize: {
        "10xl": "12rem",
      },
    },
  },
  plugins: [],
};
