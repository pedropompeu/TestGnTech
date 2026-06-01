/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── BioTeal (brand accent) ──────────────────────────────
        bioteal: {
          50:      '#F0FDFA',
          100:     '#CCFBF1',
          200:     '#99F6E4',
          300:     '#5EEAD4',
          400:     '#2DD4BF',
          500:     '#14B8A6',
          DEFAULT: '#0D9488',   // primary
          dark:    '#0F766E',   // hover
          800:     '#115E59',
          900:     '#134E4A',
        },
        // ── Lab neutrals (cold slate) ───────────────────────────
        lab: {
          bg:      '#F1F5F9',
          surface: '#F8FAFC',
          border:  '#E2E8F0',
          subtle:  '#F1F5F9',
        },
      },

      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      fontSize: {
        'xxs': ['0.625rem', { lineHeight: '1rem' }],
      },

      letterSpacing: {
        'ultra': '0.3em',
      },

      borderRadius: {
        '4xl': '2.25rem',
        '5xl': '3rem',
      },

      boxShadow: {
        'teal':    '0 0 20px rgb(13 148 136 / 0.25)',
        'teal-lg': '0 25px 50px -12px rgb(13 148 136 / 0.20)',
        'teal-glow': '0 0 20px rgb(13 148 136 / 0.40)',
        'panel':   '0 20px 60px -15px rgb(0 0 0 / 0.08)',
      },

      transitionDuration: {
        '2000': '2000ms',
      },
    },
  },
  plugins: [],
}
