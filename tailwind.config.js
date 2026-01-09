/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        'toast-progress': {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      animation: {
        fadeIn: 'fadeIn .18s ease-in-out',
        'toast-progress': 'toast-progress 5s linear forwards',
      },
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-muted': 'var(--surface-muted)',
        input: 'var(--input)',
        sidebar: 'var(--sidebar)',

        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          placeholder: 'var(--text-placeholder)',
          inverse: 'var(--text-inverse)',
        },

        border: {
          DEFAULT: 'var(--border-default)',
          muted: 'var(--border-muted)',
          sidebar: 'var(--border-sidebar)',
        },

        brand: 'var(--brand)',
        danger: 'var(--danger)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        info: 'var(--info)',
      },
    },
  },

  plugins: [],
};
