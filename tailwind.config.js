/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        vazir: ['Vazirmatn', 'sans-serif'],
      },
      // 👇 رنگ‌ها و انیمیشن‌های شما اینجا منتقل شدند
      colors: {
        'deep-navy': '#0f172a',
        'stage-purple': '#a855f7',
        'stage-gold': '#fbbf24',
        'neon-blue': '#22d3ee',
        'glass-dark': 'rgba(15, 23, 42, 0.6)',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-glow': 'pulse-glow 4s infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite', // اضافه شده برای هماهنگی با کد مپ
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1, filter: 'brightness(100%)' },
          '50%': { opacity: 0.8, filter: 'brightness(130%)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}