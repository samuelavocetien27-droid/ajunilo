import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { ink: '#101010', gold: '#D4AF37', mist: '#F5F5F3' },
    fontFamily: { sans: ['var(--font-sans)', 'system-ui', 'sans-serif'], display: ['var(--font-display)', 'Georgia', 'serif'] },
    boxShadow: { soft: '0 4px 24px rgba(16,16,16,.07)' },
  } },
  plugins: [],
};
export default config;
