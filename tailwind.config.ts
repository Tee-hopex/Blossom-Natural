import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: '#A8CABA',
          light: '#C5DDD1',
          dark: '#7BA898',
        },
        cream: {
          DEFAULT: '#F8F1E9',
          dark: '#EDE3D6',
        },
        terracotta: {
          DEFAULT: '#C47C5D',
          light: '#D4967A',
          dark: '#A86040',
        },
        gold: {
          DEFAULT: '#E8C39E',
          dark: '#D4A878',
        },
        brown: {
          DEFAULT: '#3F2A1E',
          light: '#5C3E2E',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(135deg, rgba(168,202,186,0.9) 0%, rgba(248,241,233,0.8) 50%, rgba(196,124,93,0.15) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
