/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        light: {
          background: "#ffffff",
          text: "#1f2937", 
          border: "#e5e7eb", 
        },
        dark: {
          background: "#18181b", 
          text: "#f4f4f5", 
          border: "#3f3f46", 
        },
      },
    },
  },
  plugins: [],
};
