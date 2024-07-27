import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'selector',
  theme: {
    fontFamily: {
      sans: ['var(--font-family)', ...fontFamily.sans],
    },
    borderRadius: {
      card: 'var(--card-roundness)',
      button: 'var(--button-roundness)',
    },
    boxShadow: {
      DEFAULT: 'var(--shadow)',
      over: 'var(--shadow-over)',
    },
    colors: {
      inherit: 'inherit',
      transparent: 'transparent',
      white: 'white',
      black: 'black',
      ring: 'oklch(var(--color-ring) / <alpha-value>)',
      selection: {
        DEFAULT: 'oklch(var(--color-selection) / <alpha-value>)',
        fg: 'oklch(var(--color-selection-fg) / <alpha-value>)',
      },
      surface: {
        DEFAULT: 'oklch(var(--color-surface) / <alpha-value>)',
        hover: 'oklch(var(--color-surface-hover) / <alpha-value>)',
        border: 'oklch(var(--color-surface-border) / <alpha-value>)',
        fg: 'oklch(var(--color-surface-fg) / <alpha-value>)',
      },
      canvas: {
        DEFAULT: 'oklch(var(--color-canvas) / <alpha-value>)',
        hover: 'oklch(var(--color-canvas-hover) / <alpha-value>)',
        border: 'oklch(var(--color-canvas-border) / <alpha-value>)',
        fg: 'oklch(var(--color-canvas-fg) / <alpha-value>)',
      },
      neutral: {
        DEFAULT: 'oklch(var(--color-neutral) / <alpha-value>)',
        hover: 'oklch(var(--color-neutral-hover) / <alpha-value>)',
        border: 'oklch(var(--color-neutral-border) / <alpha-value>)',
        fg: 'oklch(var(--color-neutral-fg) / <alpha-value>)',
        lighter: {
          DEFAULT: 'oklch(var(--color-neutral-lighter) / <alpha-value>)',
          hover: 'oklch(var(--color-neutral-lighter-hover) / <alpha-value>)',
          border: 'oklch(var(--color-neutral-lighter-border) / <alpha-value>)',
          fg: 'oklch(var(--color-neutral-lighter-fg) / <alpha-value>)',
        },
        lightest: {
          DEFAULT: 'oklch(var(--color-neutral-lightest) / <alpha-value>)',
          hover: 'oklch(var(--color-neutral-lightest-hover) / <alpha-value>)',
          border: 'oklch(var(--color-neutral-lightest-border) / <alpha-value>)',
          fg: 'oklch(var(--color-neutral-lightest-fg) / <alpha-value>)',
        },
        darker: {
          DEFAULT: 'oklch(var(--color-neutral-darker) / <alpha-value>)',
          hover: 'oklch(var(--color-neutral-darker-hover) / <alpha-value>)',
          border: 'oklch(var(--color-neutral-darker-border) / <alpha-value>)',
          fg: 'oklch(var(--color-neutral-darker-fg) / <alpha-value>)',
        },
        darkest: {
          DEFAULT: 'oklch(var(--color-neutral-darkest) / <alpha-value>)',
          hover: 'oklch(var(--color-neutral-darkest-hover) / <alpha-value>)',
          border: 'oklch(var(--color-neutral-darkest-border) / <alpha-value>)',
          fg: 'oklch(var(--color-neutral-darkest-fg) / <alpha-value>)',
        },
      },
      popover: {
        DEFAULT: 'oklch(var(--color-popover) / <alpha-value>)',
        hover: 'oklch(var(--color-popover-hover) / <alpha-value>)',
        border: 'oklch(var(--color-popover-border) / <alpha-value>)',
        fg: 'oklch(var(--color-popover-fg) / <alpha-value>)',
      },
      primary: {
        DEFAULT: 'oklch(var(--color-primary) / <alpha-value>)',
        hover: 'oklch(var(--color-primary-hover) / <alpha-value>)',
        border: 'oklch(var(--color-primary-border) / <alpha-value>)',
        fg: 'oklch(var(--color-primary-fg) / <alpha-value>)',
        lighter: {
          DEFAULT: 'oklch(var(--color-primary-lighter) / <alpha-value>)',
          hover: 'oklch(var(--color-primary-lighter-hover) / <alpha-value>)',
          border: 'oklch(var(--color-primary-lighter-border) / <alpha-value>)',
          fg: 'oklch(var(--color-primary-lighter-fg) / <alpha-value>)',
        },
        darker: {
          DEFAULT: 'oklch(var(--color-primary-darker) / <alpha-value>)',
          hover: 'oklch(var(--color-primary-darker-hover) / <alpha-value>)',
          border: 'oklch(var(--color-primary-darker-border) / <alpha-value>)',
          fg: 'oklch(var(--color-primary-darker-fg) / <alpha-value>)',
        },
      },
      accent: {
        DEFAULT: 'oklch(var(--color-accent) / <alpha-value>)',
        hover: 'oklch(var(--color-accent-hover) / <alpha-value>)',
        border: 'oklch(var(--color-accent-border) / <alpha-value>)',
        fg: 'oklch(var(--color-accent-fg) / <alpha-value>)',
        lighter: {
          DEFAULT: 'oklch(var(--color-accent-lighter) / <alpha-value>)',
          hover: 'oklch(var(--color-accent-lighter-hover) / <alpha-value>)',
          border: 'oklch(var(--color-accent-lighter-border) / <alpha-value>)',
          fg: 'oklch(var(--color-accent-lighter-fg) / <alpha-value>)',
        },
        darker: {
          DEFAULT: 'oklch(var(--color-accent-darker) / <alpha-value>)',
          hover: 'oklch(var(--color-accent-darker-hover) / <alpha-value>)',
          border: 'oklch(var(--color-accent-darker-border) / <alpha-value>)',
          fg: 'oklch(var(--color-accent-darker-fg) / <alpha-value>)',
        },
      },
    },
    extend: {
      spacing: {
        'layout-gap': 'var(--layout-gap)',
      },
    },
  },
  plugins: [require('@tailwindcss/container-queries')],
} satisfies Config
