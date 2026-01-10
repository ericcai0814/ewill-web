import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          300: '#4FB8B8',
          400: '#3AA8A8',
          500: '#2D9B9B',
          600: '#1E7B7B',
          700: '#1A6B6B',
        },
        accent: {
          400: '#9580FF',
          500: '#7B61FF',
        },
      },
      fontFamily: {
        sans: ['Noto Sans TC', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config

