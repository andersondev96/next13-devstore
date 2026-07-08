import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
      },
      gridTemplateRows: {
        app: 'min-content max-content',
      },
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          foreground: '#e2e8f0',
          900: '#020617',
          950: '#020617',
        },
      },
      boxShadow: {
        glow: '0 20px 60px rgba(14, 165, 233, 0.22)',
        card: '0 24px 70px rgba(2, 6, 23, 0.35)',
      },
    },
  },
  plugins: [],
}
export default config
