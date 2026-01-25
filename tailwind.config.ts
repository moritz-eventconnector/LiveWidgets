import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        "obs-black": "#0b0f16",
        "obs-card": "#111827",
        "obs-accent": "#8b5cf6"
      }
    }
  },
  plugins: []
};

export default config;
