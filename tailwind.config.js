/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#080a0b',
        surface: '#15181b',
        surface2: '#1d2226',
        line: '#2a3036',
        muted: '#828a91',
        soft: '#c3c9ce',
        accent: '#c5f82a',
        accentdk: '#9ccb1f',
        gym: '#c5f82a',
        cardio: '#39d4ff',
        warn: '#ff5c5c',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        app: '430px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pop: {
          '0%': { transform: 'scale(0.85)' },
          '60%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease both',
        pop: 'pop 0.25s ease',
      },
    },
  },
  plugins: [],
};
