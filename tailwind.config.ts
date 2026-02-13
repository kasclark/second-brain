import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        dungeon: {
          bg: '#0a0a0f',
          surface: '#12121a',
          card: '#1a1a25',
          border: '#2a2a3a',
          accent: '#7c3aed',
          accentLight: '#a78bfa',
          text: '#e2e8f0',
          muted: '#64748b',
          gold: '#f59e0b',
          emerald: '#10b981',
          ruby: '#ef4444',
        }
      }
    }
  },
  plugins: [],
}
export default config
