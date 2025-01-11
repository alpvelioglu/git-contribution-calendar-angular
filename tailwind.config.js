/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors:{
        customGray: '#ffffff',
        customWhite: '#ffffff',
      }
    },
  },
  plugins: [],
}

