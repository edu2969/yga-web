import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'michroma': ['var(--font-michroma)', 'monospace'],
      },
      keyframes: {
        entrance: {
          '0%': { filter: 'opacity(0)', transform: 'scale(0.1)' },
          '100%': { filter: 'opacity(1)', transform: 'scale(2)' },
        },
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0.3' },
        },
        'circuit-glow': {
          '0%': { opacity: '0.5' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'entrance': 'entrance 2s forwards',
        'blink': 'blink 1.5s infinite',
        'circuit-glow': 'circuit-glow 3s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
}

export default config
