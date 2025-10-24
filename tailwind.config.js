// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "media",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fireRed: "#2a0a0a",
        emberRed: "#b91c1c",
        emberOrange: "#f97316",
        goldAmber: "#fbbf24",
        darkAsh: "#0a0a0a",
        glass: "rgba(255, 255, 255, 0.08)",
      },
      boxShadow: {
        glow: "0 0 12px rgba(249, 115, 22, 0.6)",
        deep: "0 0 25px rgba(0, 0, 0, 0.8)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "drop-glow": "dropGlow 0.9s ease-in-out",
        "denied": "deniedFlash 0.9s ease-in-out",
        "ember-flicker": "emberFlicker 2.2s infinite ease-in-out",
      },
      keyframes: {
        dropGlow: {
          "0%": { boxShadow: "0 0 0 rgba(249,115,22,0)" },
          "50%": { boxShadow: "0 0 25px rgba(249,115,22,0.8)" },
          "100%": { boxShadow: "0 0 0 rgba(249,115,22,0)" },
        },
        deniedFlash: {
          "0%": { boxShadow: "0 0 0 rgba(239,68,68,0)" },
          "50%": { boxShadow: "0 0 25px rgba(239,68,68,0.8)" },
          "100%": { boxShadow: "0 0 0 rgba(239,68,68,0)" },
        },
        emberFlicker: {
          "0%, 100%": { opacity: "0.9", filter: "brightness(1)" },
          "50%": { opacity: "1", filter: "brightness(1.3)" },
          "70%": { opacity: "0.85", filter: "brightness(0.9)" },
        },
      },
    },
  },
  plugins: [],
};
