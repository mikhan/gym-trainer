import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'
// import { buttonPlugin } from './tools/tailwind/plugins/button'
// import { cssVariablesPlugin } from './tools/tailwind/plugins/css-variables'
// import { elevationPlugin } from './tools/tailwind/plugins/elevation'
// import { focusablePlugin } from './tools/tailwind/plugins/focusable'
// import { formPlugin } from './tools/tailwind/plugins/form'
// import { hocusPlugin } from './tools/tailwind/plugins/hocus'
// import { layoutPlugin } from './tools/tailwind/plugins/layout'
// import { linkPlugin } from './tools/tailwind/plugins/link'
import { scrollbarPlugin } from './tools/tailwind/plugins/scrollbar'

// import { surfacePlugin } from './tools/tailwind/plugins/surface'
// import { textShadowPlugin } from './tools/tailwind/plugins/text-shadow'
// import { textWrapPlugin } from './tools/tailwind/plugins/text-wrap'

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
      full: '9999px',
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
    transitionDuration: {
      fast: '125ms',
      normal: '250ms',
      slow: '500ms',
    },
    screens: {
      'sm': '480px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },

    zIndex: {
      1: '1',
      2: '2',
    },
    extend: {
      spacing: {
        'layout-gap': 'var(--layout-gap)',
        'layout-header-height': 'var(--layout-header-height)',
        'layout-footer-height': 'var(--layout-footer-height)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    // textShadowPlugin(),
    // squarePlugin(),
    // formPlugin(),
    // linkPlugin(),
    // textWrapPlugin(),
    // cssVariablesPlugin(),
    // elevationPlugin(),
    // hocusPlugin(),
    // focusablePlugin(),
    // layoutPlugin(),
    scrollbarPlugin(),
    // buttonPlugin(),
    // surfacePlugin({
    //   canvas: 'canvas',
    //   1: 'surface-1',
    //   2: 'surface-2',
    //   primary: 'surface-primary',
    // }),
  ],
} satisfies Config
