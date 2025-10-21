import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#75B657',
        'primary-light': '#bbf7d0',
        'primary-dark': '#4B7A3C',
        accent: '#F8D860',
        neutral: {
          light: '#F5F5DC',
          gray: '#B0B0B0',
          dark: '#2B2B2B',
        },
      },
    },
  },
  plugins: [],
};

export default config;
