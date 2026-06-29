/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#f7f7f8',
          100: '#eeeef0',
          200: '#d9d9de',
          300: '#b8b8c0',
          400: '#8f8f9a',
          500: '#6b6b78',
          600: '#52525e',
          700: '#3f3f49',
          800: '#27272f',
          900: '#15151a',
          950: '#0a0a0d',
        },
        gold: {
          50: '#fdf8ee',
          100: '#f9ecd2',
          200: '#f1d6a3',
          300: '#e8bd6e',
          400: '#dfa847',
          500: '#cf9230',
          600: '#ad7426',
          700: '#8a5b22',
          800: '#714a22',
          900: '#5f3e20',
        },
      },
      boxShadow: {
        soft: '0 2px 20px -4px rgba(15,15,20,0.08)',
        card: '0 8px 30px -8px rgba(15,15,20,0.12)',
        glow: '0 0 0 1px rgba(223,168,71,0.15), 0 8px 30px -8px rgba(223,168,71,0.25)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.25s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(16px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        slideInRight: { '0%': { opacity: 0, transform: 'translateX(40px)' }, '100%': { opacity: 1, transform: 'translateX(0)' } },
        scaleIn: { '0%': { opacity: 0, transform: 'scale(0.95)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
};
