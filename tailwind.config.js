/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        base: 'var(--base)',
        transparent: 'var(--transparent)',
        background: 'var(--background)',
        'background-gradient': 'var(--background-gradient)',
        foreground: 'var(--foreground)',
        link: 'var(--link)',

        // ShadCN colors
        primary: 'var(--base)',
        'primary-foreground': 'var(--foreground)',
        destructive: 'var(--error-600)',
        'primary-foreground': 'var(--foreground)',
        accent: 'var(--primary-600)',
        'accent-foreground': 'var(--foreground)',
        input: 'var(--primary-400)',
        'input-foreground': 'var(--foreground)',
        secondary: 'var(--primary-600)',
        'secondary-foreground': 'var(--foreground)',
        card: 'var(--primary-950)',
        'card-foreground': 'var(--foreground)',

        // Primary colors
        gray: {
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
          950: 'var(--primary-950)',
        },
        error: {
          50: 'var(--error-50)',
          100: 'var(--error-100)',
          200: 'var(--error-200)',
          300: 'var(--error-300)',
          400: 'var(--error-400)',
          500: 'var(--error-500)',
          600: 'var(--error-600)',
          700: 'var(--error-700)',
          800: 'var(--error-800)',
          900: 'var(--error-900)',
          950: 'var(--error-950)',
        },
        warning: {
          50: 'var(--warning-50)',
          100: 'var(--warning-100)',
          200: 'var(--warning-200)',
          300: 'var(--warning-300)',
          400: 'var(--warning-400)',
          500: 'var(--warning-500)',
          600: 'var(--warning-600)',
          700: 'var(--warning-700)',
          800: 'var(--warning-800)',
          900: 'var(--warning-900)',
          950: 'var(--warning-950)',
        },
        success: {
          50: 'var(--success-50)',
          100: 'var(--success-100)',
          200: 'var(--success-200)',
          300: 'var(--success-300)',
          400: 'var(--success-400)',
          500: 'var(--success-500)',
          600: 'var(--success-600)',
          700: 'var(--success-700)',
          800: 'var(--success-800)',
          900: 'var(--success-900)',
          950: 'var(--success-950)',
        },
        borderRadius: {
          lg: 'var(--radius)',
          md: 'calc(var(--radius) - 2px)',
          sm: 'calc(var(--radius) - 4px)',
        },
      },
      borderWidth: {
        DEFAULT: '0.5px',
        0: '0',
        2: '1px',
        3: '2px',
        4: '4px',
        6: '6px',
        8: '8px',
      },
    },
    plugins: [require('tailwindcss-animate')],
  },
}