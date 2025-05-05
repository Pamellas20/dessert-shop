/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        red: '#D87D4A',
        green: '#2F8F5D',
        'rose-50': '#FAF3F0',
        'rose-100': '#F4E4DF',
        'rose-300': '#D4B6A9',
        'rose-400': '#C9A18E',
        'rose-500': '#B08878',
        'rose-900': '#3C2F2F',
      },
      fontFamily: {
        'red-hat': ['"Red Hat Text"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}