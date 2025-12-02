/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Defina cores individuais
        "vintage-primary": "#7B3F00",
        "vintage-secondary": "#C49E68",
        "vintage-accent": "#D4A574",
        "vintage-background": "#F5E6D3",
        "vintage-surface": "#EDE0C8",
        "vintage-text": "#2F2F2F",
        "vintage-muted": "#5B4636",

        // Ou defina como escala padrão do Tailwind
        vintage: {
          50: "#F5E6D3",
          100: "#EDE0C8",
          200: "#D4A574",
          300: "#C49E68",
          400: "#7B3F00",
          500: "#5B4636",
          600: "#2F2F2F",
          700: "#2A2A2A",
          800: "#1F1F1F",
          900: "#141414",
        },
      },
    },
  },
  plugins: [],
};
