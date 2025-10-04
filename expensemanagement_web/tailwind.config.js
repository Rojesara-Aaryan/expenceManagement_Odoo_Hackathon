/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // blue-500
        'primary-dark': '#1D4ED8', // blue-800
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['"Clash Display"', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'draw-path': 'drawPath 5s ease-in-out infinite alternate',
        'marquee': 'marquee 40s linear infinite',
        'typing-bubble': 'typing-bubble 1.2s infinite ease-in-out'
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        drawPath: {
            '0%': { 'stroke-dashoffset': '1000' },
            '100%': { 'stroke-dashoffset': '0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'typing-bubble': {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%': { transform: 'scale(1.0)' },
        }
      },
    },
  },
  plugins: [],
};