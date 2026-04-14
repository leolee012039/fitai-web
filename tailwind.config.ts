import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1B2B5E',
        accent: '#F05454',
        gold: '#F9A825',
        success: '#16A34A',
        danger: '#DC2626',
        background: '#F7F7F7',
        card: '#FFFFFF',
        'text-primary': '#1B2B5E',
        'text-secondary': '#64748B',
        'text-muted': '#94A3B8',
        'border-soft': '#E2E8F0',
      },
      boxShadow: {
        card: '0 4px 14px rgba(15, 23, 42, 0.06)',
        soft: '0 2px 6px rgba(15, 23, 42, 0.04)',
        header: '0 1px 0 rgba(15, 23, 42, 0.06)',
      },
      borderRadius: {
        xl: '14px',
        '2xl': '18px',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Noto Sans TC"',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
