import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1f2933',
        blush: '#f8e7f1',
        sky: '#c7e1ff',
        mint: '#ccf1e6',
        rose: '#f5d0e6',
      },
      fontFamily: {
        display: [
          '"Avenir Next"',
          'Avenir',
          '"Plus Jakarta Sans"',
          'system-ui',
          'sans-serif',
        ],
        sans: [
          '"Avenir Next"',
          'Avenir',
          '"Plus Jakarta Sans"',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        soft: '0 20px 50px -20px rgba(31, 41, 51, 0.35)',
      },
    },
  },
  plugins: [typography],
}
