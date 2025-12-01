/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
      },
      animation: {
        fadeIn: 'fadeIn .18s ease-in-out',
      },
      colors: {
        sidebar: {
          bg: '#1f2227',
          border: '#2a2d33',
          hover: '#292d33',
          hover2: '#32363d',
          text: '#d1d1d1',
        },
        light: {
          bg: '#f6f7f9',
          bg2: '#edeff2',
          border: '#d4d7db',
          text: '#1f1f22',
          text2: '#3a3d42',
          muted: '#6b6e74',
          placeholder: '#9da1a8',
        },
        soft: {
          blue: '#e7effe',
          green: '#d1fae5',
          red: '#fee2e2',
          yellow: '#fef9c3',
        },
      },
    },
  },
  plugins: [],
};
