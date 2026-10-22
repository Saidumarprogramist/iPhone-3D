/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          0: '#050507',
          1: '#0a0a0f',
          2: '#131318',
        },
        mist: '#8b8b93',
        snow: '#f5f5f7',
        gold: {
          DEFAULT: '#d8b25a',
          soft: 'rgba(216,178,90,0.14)',
        },
      },
    },
  },
  plugins: [],
};
