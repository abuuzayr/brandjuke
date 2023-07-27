/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-sf)", "system-ui", "sans-serif"],
        default: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        // Tooltip
        "slide-up-fade": "slide-up-fade 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down-fade": "slide-down-fade 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        // Tooltip
        "slide-up-fade": {
          "0%": { opacity: 0, transform: "translateY(6px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-down-fade": {
          "0%": { opacity: 0, transform: "translateY(-6px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      colors: {
        "shade-red": {
          DEFAULT: "#FF0000"
        },
        "shade-orange": {
          DEFAULT: "#FFA500"
        },
        "shade-yellow": {
          DEFAULT: "#FFFF00"
        },
        "shade-green": {
          DEFAULT: "#008000"
        },
        "shade-blue": {
          DEFAULT: "#0000FF"
        },
        "shade-violet": {
          DEFAULT: "#EE82EE"
        },
        "shade-brown": {
          DEFAULT: "#A52A2A"
        },
        "shade-black": {
          DEFAULT: "#000000"
        },
        "shade-grey": {
          DEFAULT: "#808080"
        },
        "shade-white": {
          DEFAULT: "#FFFFFF"
        },
      }
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/line-clamp"),
    plugin(({ addVariant }) => {
      addVariant("radix-side-top", '&[data-side="top"]');
      addVariant("radix-side-bottom", '&[data-side="bottom"]');
    }),
  ],
};
