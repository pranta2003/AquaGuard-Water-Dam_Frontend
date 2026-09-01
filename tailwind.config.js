/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        aqua: {
          950: "#031423",
          900: "#062338",
          800: "#0a3a56",
        },
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.55 },
        },
      },
      animation: {
        pulseGlow: "pulseGlow 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
