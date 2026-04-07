/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        display: ['Cormorant Garamond', 'serif'],
      },
      colors: {
        sand: '#f6f0e8',
        ink: '#1c1917',
        pine: '#0f766e',
        clay: '#9a3412',
      },
      boxShadow: {
        soft: '0 25px 80px -40px rgba(15, 23, 42, 0.35)',
      },
    },
  },
  plugins: [],
};
