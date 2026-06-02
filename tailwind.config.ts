import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: '#6B7D2B',
          light: '#8A9D4A',
          dark: '#556420',
        },
        cream: {
          DEFAULT: '#F5EDE0',
          dark: '#E8DDD0',
        },
        terracotta: {
          DEFAULT: '#1B4332',
          light: '#2D6A4F',
          dark: '#143528',
        },
        gold: {
          DEFAULT: '#C4913C',
          dark: '#A67A30',
        },
        brown: {
          DEFAULT: '#2C1810',
          light: '#4A3228',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(135deg, rgba(27,67,50,0.06) 0%, rgba(245,237,224,0.95) 35%, rgba(107,125,43,0.08) 100%)',
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
