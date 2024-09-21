import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'
import { developmentPlugin } from './src/tools/tailwind/plugins/development'
import { focusablePlugin } from './src/tools/tailwind/plugins/focusable'
import { gridPlugin } from './src/tools/tailwind/plugins/grid'
import { hocusPlugin } from './src/tools/tailwind/plugins/hocus'
import { pointerPlugin } from './src/tools/tailwind/plugins/pointer'
import { scrollbarPlugin } from './src/tools/tailwind/plugins/scrollbar'
import { surfacePlugin } from './src/tools/tailwind/plugins/surface'
import { typescalePlugin } from './src/tools/tailwind/plugins/typescale'
import { zoomPlugin } from './src/tools/tailwind/plugins/zoom'

const varColor = (varName: string) => `oklch(from var(${varName}) l c h / <alpha-value>)`

const safelist = [
  'color-canvas',
  'color-neutral-darkest',
  'color-neutral-darker',
  'color-neutral',
  'color-neutral-lighter',
  'color-neutral-lightest',
  'color-primary-darker',
  'color-primary',
  'color-primary-lighter',
  'color-secondary-darker',
  'color-secondary',
  'color-secondary-lighter',
  'color-accent-darker',
  'color-accent',
  'color-accent-lighter',
  'color-popover',
]

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'selector',
  safelist: process.env.NODE_ENV === 'development' ? safelist : undefined,
  theme: {
    fontFamily: {
      sans: ["var(--font-family-sans, '')", ...fontFamily.sans],
      mono: ["var(--font-family-mono, '')", ...fontFamily.mono],
    },
    borderRadius: {
      none: '0px',
      card: 'var(--card-roundness)',
      button: 'var(--button-roundness)',
      full: '9999px',
    },
    boxShadow: {
      DEFAULT: 'var(--shadow)',
      over: 'var(--shadow-over)',
      none: '0 0 #0000',
    },
    colors: {
      inherit: 'inherit',
      current: 'currentColor',
      transparent: 'transparent',
      white: 'white',
      black: 'black',
      ring: {
        DEFAULT: varColor('--color-ring'),
      },
      selection: {
        DEFAULT: varColor('--color-selection'),
        fg: varColor('--color-selection-fg'),
      },
      default: {
        DEFAULT: varColor('--color-default'),
        fg: varColor('--color-default-fg'),
        line: varColor('--color-default-line'),
        contrast: varColor('--color-default-contrast'),
        under: varColor('--color-default-under'),
        hover: varColor('--color-default-hover'),
        active: varColor('--color-default-active'),
      },
      canvas: {
        DEFAULT: varColor('--color-canvas'),
        fg: varColor('--color-canvas-fg'),
        line: varColor('--color-canvas-line'),
        contrast: varColor('--color-canvas-contrast'),
        under: varColor('--color-canvas-under'),
        hover: varColor('--color-canvas-hover'),
        active: varColor('--color-canvas-active'),
      },
      neutral: {
        DEFAULT: varColor('--color-neutral'),
        fg: varColor('--color-neutral-fg'),
        line: varColor('--color-neutral-line'),
        contrast: varColor('--color-neutral-contrast'),
        under: varColor('--color-neutral-under'),
        hover: varColor('--color-neutral-hover'),
        active: varColor('--color-neutral-active'),
        lighter: {
          DEFAULT: varColor('--color-neutral-lighter'),
          fg: varColor('--color-neutral-lighter-fg'),
          line: varColor('--color-neutral-lighter-line'),
          contrast: varColor('--color-neutral-lighter-contrast'),
          under: varColor('--color-neutral-lighter-under'),
          hover: varColor('--color-neutral-lighter-hover'),
          active: varColor('--color-neutral-lighter-active'),
        },
        lightest: {
          DEFAULT: varColor('--color-neutral-lightest'),
          fg: varColor('--color-neutral-lightest-fg'),
          line: varColor('--color-neutral-lightest-line'),
          contrast: varColor('--color-neutral-lightest-contrast'),
          under: varColor('--color-neutral-lightest-under'),
          hover: varColor('--color-neutral-lightest-hover'),
          active: varColor('--color-neutral-lightest-active'),
        },
        darker: {
          DEFAULT: varColor('--color-neutral-darker'),
          fg: varColor('--color-neutral-darker-fg'),
          line: varColor('--color-neutral-darker-line'),
          contrast: varColor('--color-neutral-darker-contrast'),
          under: varColor('--color-neutral-darker-under'),
          hover: varColor('--color-neutral-darker-hover'),
          active: varColor('--color-neutral-darker-active'),
        },
        darkest: {
          DEFAULT: varColor('--color-neutral-darkest'),
          fg: varColor('--color-neutral-darkest-fg'),
          line: varColor('--color-neutral-darkest-line'),
          contrast: varColor('--color-neutral-darkest-contrast'),
          under: varColor('--color-neutral-darkest-under'),
          hover: varColor('--color-neutral-darkest-hover'),
          active: varColor('--color-neutral-darkest-active'),
        },
      },
      popover: {
        DEFAULT: varColor('--color-popover'),
        fg: varColor('--color-popover-fg'),
        line: varColor('--color-popover-line'),
        contrast: varColor('--color-popover-contrast'),
        under: varColor('--color-popover-under'),
        hover: varColor('--color-popover-hover'),
        active: varColor('--color-popover-active'),
      },
      primary: {
        DEFAULT: varColor('--color-primary'),
        fg: varColor('--color-primary-fg'),
        line: varColor('--color-primary-line'),
        contrast: varColor('--color-primary-contrast'),
        under: varColor('--color-primary-under'),
        hover: varColor('--color-primary-hover'),
        active: varColor('--color-primary-active'),
        lighter: {
          DEFAULT: varColor('--color-primary-lighter'),
          fg: varColor('--color-primary-lighter-fg'),
          line: varColor('--color-primary-lighter-line'),
          contrast: varColor('--color-primary-lighter-contrast'),
          under: varColor('--color-primary-lighter-under'),
          hover: varColor('--color-primary-lighter-hover'),
          active: varColor('--color-primary-lighter-active'),
        },
        darker: {
          DEFAULT: varColor('--color-primary-darker'),
          fg: varColor('--color-primary-darker-fg'),
          line: varColor('--color-primary-darker-line'),
          contrast: varColor('--color-primary-darker-contrast'),
          under: varColor('--color-primary-darker-under'),
          hover: varColor('--color-primary-darker-hover'),
          active: varColor('--color-primary-darker-active'),
        },
      },
      secondary: {
        DEFAULT: varColor('--color-secondary'),
        fg: varColor('--color-secondary-fg'),
        line: varColor('--color-secondary-line'),
        contrast: varColor('--color-secondary-contrast'),
        under: varColor('--color-secondary-under'),
        hover: varColor('--color-secondary-hover'),
        active: varColor('--color-secondary-active'),
        lighter: {
          DEFAULT: varColor('--color-secondary-lighter'),
          fg: varColor('--color-secondary-lighter-fg'),
          line: varColor('--color-secondary-lighter-line'),
          contrast: varColor('--color-secondary-lighter-contrast'),
          under: varColor('--color-secondary-lighter-under'),
          hover: varColor('--color-secondary-lighter-hover'),
          active: varColor('--color-secondary-lighter-active'),
        },
        darker: {
          DEFAULT: varColor('--color-secondary-darker'),
          fg: varColor('--color-secondary-darker-fg'),
          line: varColor('--color-secondary-darker-line'),
          contrast: varColor('--color-secondary-darker-contrast'),
          under: varColor('--color-secondary-darker-under'),
          hover: varColor('--color-secondary-darker-hover'),
          active: varColor('--color-secondary-darker-active'),
        },
      },
      accent: {
        DEFAULT: varColor('--color-accent'),
        fg: varColor('--color-accent-fg'),
        line: varColor('--color-accent-line'),
        contrast: varColor('--color-accent-contrast'),
        under: varColor('--color-accent-under'),
        hover: varColor('--color-accent-hover'),
        active: varColor('--color-accent-active'),
        lighter: {
          DEFAULT: varColor('--color-accent-lighter'),
          fg: varColor('--color-accent-lighter-fg'),
          line: varColor('--color-accent-lighter-line'),
          contrast: varColor('--color-accent-lighter-contrast'),
          under: varColor('--color-accent-lighter-under'),
          hover: varColor('--color-accent-lighter-hover'),
          active: varColor('--color-accent-lighter-active'),
        },
        darker: {
          DEFAULT: varColor('--color-accent-darker'),
          fg: varColor('--color-accent-darker-fg'),
          line: varColor('--color-accent-darker-line'),
          contrast: varColor('--color-accent-darker-contrast'),
          under: varColor('--color-accent-darker-under'),
          hover: varColor('--color-accent-darker-hover'),
          active: varColor('--color-accent-darker-active'),
        },
      },
    },
    transitionDuration: {
      DEFAULT: '200ms',
      short: '200ms',
      medium: '500ms',
      long: '1000ms',
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
      3: '3',
    },
    extend: {
      spacing: {
        'layout-padding': 'var(--layout-padding)',
        'layout-gap': 'var(--layout-gap)',

        'layout-width': 'var(--layout-width)',
        'layout-height': 'var(--layout-height)',

        'layout-header-width': 'var(--layout-header-width)',
        'layout-header-height': 'var(--layout-header-height)',
        'layout-header-top': 'var(--layout-header-top)',

        'layout-aside-width': 'var(--layout-aside-width)',
        'layout-aside-height': 'var(--layout-aside-height)',

        'layout-footer-width': 'var(--layout-footer-width)',
        'layout-footer-height': 'var(--layout-footer-height)',

        'layout-viewport-width': 'var(--layout-viewport-width)',
        'layout-viewport-height': 'var(--layout-viewport-height)',
        'layout-viewport-top': 'var(--layout-viewport-top)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
    scrollbarPlugin(),
    gridPlugin(),
    typescalePlugin(),
    pointerPlugin(),
    surfacePlugin(),
    focusablePlugin(),
    developmentPlugin(),
    hocusPlugin(),
    zoomPlugin(),
  ],
} satisfies Config
