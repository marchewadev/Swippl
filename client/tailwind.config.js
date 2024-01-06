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
      screens: {
        "3xl": "1700px",
        "4xl": "1900px",
        "5xl": "2200px",
      },
      minWidth: {
        "1/2": "50%",
        "4/5": "80%",
      },
      gridTemplateRows: {
        // Chat container layout
        "chat-layout-xl": "70vh auto;",
        "chat-layout-lg": "60vh auto",
      },
      inset: {
        99: "99%",
      },
    },
  },
  plugins: [],
};
