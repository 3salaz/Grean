/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        myshadow1: '4.2px -2px 0 0 white',
        myshadow2: '-4.2px -2px 0 0 white'
      },
      colors: {
        'grean': '#75B657',
        'pink': '#ff49db',
        'orange': '#ff7849',
        'green': '#13ce66',
        'gray-dark': '#273444',
        'gray': '#8492a6',
        'light-gray': '#d3dce6',
        'light': '#f3F2F0',
        'light-grean': '#bbf7d0',
        'beige': '#F5F5DC',
        'medium-gray': '#B0B0B0',
        'light-blue': '#A3C4DC',
        'dark-green': '#4B7A3C',
        'bright-yellow': '#F8D860',
      },
    },
  },
  plugins: [
  ],
}
