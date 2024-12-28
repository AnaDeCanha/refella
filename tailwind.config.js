/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lila: "#C589E8",
        lightLila: "#e3daff",
        calm: "#ecfff8",
        dark: "#292929",
        light: "#FAFAFA",
      },
      fontFamily: {
        title: ["Poppins", "sans-serif"], // Titles use Poppins
        body: ["Roboto", "sans-serif"], // Body text uses Roboto
      },
      fontSize: {
        title: ["40px", { lineHeight: "48px" }],
        titleMobile: ["32px", { lineHeight: "40px" }],
        subheading: ["32px", { lineHeight: "40px" }],
        subheadingMobile: ["26px", { lineHeight: "34px" }],
        body: ["16px", { lineHeight: "24px" }],
      },
    },
  },
  plugins: [],
};
