/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 18px 40px rgba(15, 23, 42, 0.08)',
      },
      colors: {
        brand: {
          DEFAULT: '#0f172a',
          soft: '#e2e8f0',
        },
      },
    },
  },
  plugins: [],
}
