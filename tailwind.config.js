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
        navy: {
          950: '#020617', // Deepest Navy for Dark Mode Bg
          900: '#0f172a', // Deep Navy
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
        },
        brand: {
          orange: '#f97316', // Vibrant Orange
          hover: '#ea580c',
          soft: '#fff7ed', // Soft orange for backgrounds
        },
        paper: {
          DEFAULT: '#ffffff',
          dark: '#1e293b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
        'grid-pattern-dark': "linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)",
      }
    }
  },
  plugins: [],
}
