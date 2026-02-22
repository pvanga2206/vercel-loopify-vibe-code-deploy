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
        figtree: ['Figtree', 'sans-serif'],
      },
      colors: {
        purple: {
          accent: '#814AC8',
          light: '#663C9D',
          dark: '#502E7B',
          glow: 'rgba(129, 74, 200, 0.38)',
        },
        dark: {
          bg: '#000000',
          card: '#0D0D0D',
          border: 'rgba(255, 255, 255, 0.12)',
        },
      },
    },
  },
  plugins: [],
}

export default config
