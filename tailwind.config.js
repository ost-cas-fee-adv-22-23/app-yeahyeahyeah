/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./**/*.{js,jsx,ts,tsx}'],
  darkMode: 'media', // or 'class'
  theme: {
    extend: {
      textColor: {
        skin: {
          base: 'var(--color-base)',
          light: 'var(--color-light)',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        16: '1rem',
        full: '9999px',
      },
      borderWidth: {
        DEFAULT: '3px',
        1: '1px',
        4: '4px',
        6: '6px',
        none: 'transparent',
      },
      borderColor: {
        white: 'var(--color-border-light)',
      },
      outlineWidth: {
        3: '3px',
      },
      backgroundImage: {
        gradient70: 'linear-gradient(90deg, var(--color-gradient-pink) 0%, var(--color-gradient-violet) 70%)',
        gradient80: 'linear-gradient(90deg, var(--color-gradient-pink) 0%, var(--color-gradient-violet) 40%)',
        mumbleGradient: `linear-gradient(153.75deg, ${colors.pink[500]} -75.32%, ${colors.violet[700]} 100%)`,
      },
      keyframes: {
        slide: {
          '0%': { marginTop: '-300px' },
          '5%': { marginTop: '-200px' },
          '33%': { marginTop: '-200px' },
          '38%': { marginTop: '-100px' },
          '66%': { marginTop: '-100px' },
          '71%': { marginTop: '0px' },
          '100%': { marginTop: '0px' },
        },
      },
      animation: {
        keyword: 'slide 15s cubic-bezier(0.7, -0.85, 0.5, 1.4) infinite',
      },
    },
    fontWeight: {
      normal: '300',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    fontSize: {
      xxs: ['0.75rem', { lineHeight: '0.75rem' }], // 12px / 14px Label S
      xs: ['0.875rem', { lineHeight: '0.875rem' }], // 14px / 14px Label S
      sm: ['1rem', { lineHeight: '1rem' }], // 16px / 16px
      base: ['1.125rem', { lineHeight: '1.575rem' }], // 18px / 25px
      md: ['1.25rem', { lineHeight: '1.575rem' }], // 20px / 20px / 25px
      lg: ['1.5rem', { lineHeight: '2.1875rem' }], // 24px / 30px Paragraph L
      xl: ['24px', { lineHeight: '1.875rem' }], // h4 -> 24px / 30px
      '2xl': ['2rem', { lineHeight: '2.5rem' }], // h3 -> 32px / 40px
      '3xl': ['2.5rem', { lineHeight: '3.125rem' }], // h2 -> 40px
      '4xl': ['3rem', { lineHeight: '3.75rem' }], // h1 -> 48px / 60px
    },
    spacing: {
      DEFAULT: '0',
      0: '0',
      1: '0.0625rem',
      2: '0.125rem',
      3: '0.1875rem',
      4: '0.25rem',
      6: '0.375rem',
      8: '0.5rem',
      12: '0.75rem',
      16: '1rem',
      24: '1.5rem',
      32: '2rem',
      40: '2.5rem',
      44: '2.75rem',
      48: '3rem',
      64: '4rem',
      70: '4.375rem',
      76: '4.75rem',
      82: '5.125rem',
      96: '6rem',
      108: '6.75rem',
      160: '10rem',
      172: '10.75rem',
      615: '38.4375rem',
    },
    lineHeight: {
      DEFAULT: '100%',
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '100%',
      relaxed: '125%',
      loose: '140%',
      3: '.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      7: '1.75rem',
      8: '2rem',
      9: '2.25rem',
      10: '2.5rem',
    },
    colors: {
      slate: {
        white: '#ffffff',
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
      },
      violet: colors.blue,
      pink: {
        50: '#fdf2f8',
        100: '#fce7f3',
        200: '#fbcfe8',
        300: '#f9a8d4',
        400: '#f472b6',
        500: '#ec4899',
        600: '#db2777',
        700: '#be185d',
        800: '#9d174d',
        900: '#831843',
      },
      red: {
        DEFAULT: '#FF0000',
      },
    },
    container: {
      center: true,
      screens: {
        mobile: '100%',
        desktop: '680px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class', // only generate global styles
    }),
  ],
};
