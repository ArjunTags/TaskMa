/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      colors: {
        board: {
          bg: "#0f1117",
          surface: "#1a1d27",
          card: "#22263a",
          border: "#2e3354",
          accent: "#6c63ff",
          "accent-light": "#8b85ff",
          muted: "#4a5080",
          text: "#e2e4f0",
          subtext: "#7b82a8",
        },
      },
    },
  },
  plugins: [],
};
