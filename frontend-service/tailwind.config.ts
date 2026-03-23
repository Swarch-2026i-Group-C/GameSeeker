import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#111316',
          dim: '#111316',
          bright: '#37393d',
          tint: '#00e639',
          variant: '#333538',
          container: {
            DEFAULT: '#1e2023',
            low: '#1a1c1f',
            lowest: '#0c0e11',
            high: '#282a2d',
            highest: '#333538',
          },
        },
        primary: {
          DEFAULT: '#ebffe2',
          container: '#00ff41',
          fixed: '#72ff70',
          'fixed-dim': '#00e639',
          on: '#003907',
          'on-container': '#007117',
          'on-fixed': '#002203',
          'on-fixed-variant': '#00530e',
        },
        secondary: {
          DEFAULT: '#a6e6ff',
          container: '#14d1ff',
          fixed: '#b7eaff',
          'fixed-dim': '#4cd6ff',
          on: '#003543',
          'on-container': '#00566b',
        },
        tertiary: {
          DEFAULT: '#fff8f2',
          container: '#ffd792',
          fixed: '#ffdea8',
          'fixed-dim': '#ffba20',
          on: '#412d00',
          'on-container': '#7f5a00',
        },
        on: {
          surface: '#e2e2e6',
          'surface-variant': '#b9ccb2',
          background: '#e2e2e6',
          error: '#690005',
          'error-container': '#ffdad6',
        },
        outline: {
          DEFAULT: '#84967e',
          variant: '#3b4b37',
        },
        error: {
          DEFAULT: '#ffb4ab',
          container: '#93000a',
        },
        background: '#111316',
      },
      fontFamily: {
        headline: ['var(--font-space-grotesk)', 'Space Grotesk', 'sans-serif'],
        body: ['var(--font-inter)', 'Inter', 'sans-serif'],
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '0.75rem', // capped at xl per design system
      },
      boxShadow: {
        'glow-primary': '0 0 15px rgba(0, 255, 65, 0.2)',
        'glow-primary-lg': '0 0 30px rgba(0, 255, 65, 0.3)',
        'glow-secondary': '0 0 15px rgba(20, 209, 255, 0.2)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-tactical':
          'linear-gradient(rgba(0, 230, 57, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 230, 57, 0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-tactical': '40px 40px',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 255, 65, 0.15)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 255, 65, 0.35)' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'scan-line': 'scan-line 8s linear infinite',
        'fade-in-up': 'fade-in-up 0.4s ease-out forwards',
      },
    },
  },
  plugins: [typography],
};

export default config;
