/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0A0E17',
        surface: '#111827',
        border: '#1F2937',
        accent: '#3B82F6',
        bullish: '#10B981',
        bearish: '#EF4444',
        muted: '#6B7280',
        body: '#D1D5DB',
        heading: '#F9FAFB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundColor: {
        DEFAULT: '#0A0E17',
      },
    },
  },
  plugins: [],
}
