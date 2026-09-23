/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#07090e',
          900: '#0c1017',
          850: '#111622',
          800: '#161c2c',
          700: '#232c42',
        },
        cortex: {
          cyan: '#38bdf8',
          blue: '#3b82f6',
          indigo: '#6366f1',
          accent: '#0ea5e9',
        }
      }
    },
  },
  plugins: [],
}
