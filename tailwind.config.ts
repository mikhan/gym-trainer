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

const varColor = (varName: string) => `oklch(from var(${varName}) l c h / <alpha-value>)`
const varColorContrast = (varName: string) => `oklch(from var(${varName}-fg) calc(1 - l) c h)`
const varColorUnder = (varName: string) =>
  `oklch(from color-mix(in oklch, var(${varName}), oklch(from var(${varName}-fg) calc(1 - l) c h) 10%) l c h / <alpha-value>)`
const varColorHover = (varName: string) =>
  `oklch(from color-mix(in oklch, var(${varName}), var(${varName}-fg) 10%) l c h / <alpha-value>)`
const varColorActive = (varName: string) =>
  `oklch(from color-mix(in oklch, var(${varName}), var(${varName}-fg) 30%) l c h / <alpha-value>)`

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
        contrast: varColorContrast('--color-canvas'),
        under: varColorUnder('--color-canvas'),
        hover: varColorHover('--color-canvas'),
        active: varColorActive('--color-canvas'),
      },
      neutral: {
        DEFAULT: varColor('--color-neutral'),
        fg: varColor('--color-neutral-fg'),
        line: varColor('--color-neutral-line'),
        contrast: varColorContrast('--color-neutral'),
        under: varColorUnder('--color-neutral'),
        hover: varColorHover('--color-neutral'),
        active: varColorActive('--color-neutral'),
        lighter: {
          DEFAULT: varColor('--color-neutral-lighter'),
          fg: varColor('--color-neutral-lighter-fg'),
          line: varColor('--color-neutral-lighter-line'),
          contrast: varColorContrast('--color-neutral-lighter'),
          under: varColorUnder('--color-neutral-lighter'),
          hover: varColorHover('--color-neutral-lighter'),
          active: varColorActive('--color-neutral-lighter'),
        },
        lightest: {
          DEFAULT: varColor('--color-neutral-lightest'),
          fg: varColor('--color-neutral-lightest-fg'),
          line: varColor('--color-neutral-lightest-line'),
          contrast: varColorContrast('--color-neutral-lightest'),
          under: varColorUnder('--color-neutral-lightest'),
          hover: varColorHover('--color-neutral-lightest'),
          active: varColorActive('--color-neutral-lightest'),
        },
        darker: {
          DEFAULT: varColor('--color-neutral-darker'),
          fg: varColor('--color-neutral-darker-fg'),
          line: varColor('--color-neutral-darker-line'),
          contrast: varColorContrast('--color-neutral-darker'),
          under: varColorUnder('--color-neutral-darker'),
          hover: varColorHover('--color-neutral-darker'),
          active: varColorActive('--color-neutral-darker'),
        },
        darkest: {
          DEFAULT: varColor('--color-neutral-darkest'),
          fg: varColor('--color-neutral-darkest-fg'),
          line: varColor('--color-neutral-darkest-line'),
          contrast: varColorContrast('--color-neutral-darkest'),
          under: varColorUnder('--color-neutral-darkest'),
          hover: varColorHover('--color-neutral-darkest'),
          active: varColorActive('--color-neutral-darkest'),
        },
      },
      popover: {
        DEFAULT: varColor('--color-popover'),
        fg: varColor('--color-popover-fg'),
        line: varColor('--color-popover-line'),
        contrast: varColorContrast('--color-popover'),
        under: varColorUnder('--color-popover'),
        hover: varColorHover('--color-popover'),
        active: varColorActive('--color-popover'),
      },
      primary: {
        DEFAULT: varColor('--color-primary'),
        fg: varColor('--color-primary-fg'),
        line: varColor('--color-primary-line'),
        contrast: varColorContrast('--color-primary'),
        under: varColorUnder('--color-primary'),
        hover: varColorHover('--color-primary'),
        active: varColorActive('--color-primary'),
        lighter: {
          DEFAULT: varColor('--color-primary-lighter'),
          fg: varColor('--color-primary-lighter-fg'),
          line: varColor('--color-primary-lighter-line'),
          contrast: varColorContrast('--color-primary-lighter'),
          under: varColorUnder('--color-primary-lighter'),
          hover: varColorHover('--color-primary-lighter'),
          active: varColorActive('--color-primary-lighter'),
        },
        darker: {
          DEFAULT: varColor('--color-primary-darker'),
          fg: varColor('--color-primary-darker-fg'),
          line: varColor('--color-primary-darker-line'),
          contrast: varColorContrast('--color-primary-darker'),
          under: varColorUnder('--color-primary-darker'),
          hover: varColorHover('--color-primary-darker'),
          active: varColorActive('--color-primary-darker'),
        },
      },
      secondary: {
        DEFAULT: varColor('--color-secondary'),
        fg: varColor('--color-secondary-fg'),
        line: varColor('--color-secondary-line'),
        contrast: varColorContrast('--color-secondary'),
        under: varColorUnder('--color-secondary'),
        hover: varColorHover('--color-secondary'),
        active: varColorActive('--color-secondary'),
        lighter: {
          DEFAULT: varColor('--color-secondary-lighter'),
          fg: varColor('--color-secondary-lighter-fg'),
          line: varColor('--color-secondary-lighter-line'),
          contrast: varColorContrast('--color-secondary-lighter'),
          under: varColorUnder('--color-secondary-lighter'),
          hover: varColorHover('--color-secondary-lighter'),
          active: varColorActive('--color-secondary-lighter'),
        },
        darker: {
          DEFAULT: varColor('--color-secondary-darker'),
          fg: varColor('--color-secondary-darker-fg'),
          line: varColor('--color-secondary-darker-line'),
          contrast: varColorContrast('--color-secondary-darker'),
          under: varColorUnder('--color-secondary-darker'),
          hover: varColorHover('--color-secondary-darker'),
          active: varColorActive('--color-secondary-darker'),
        },
      },
      accent: {
        DEFAULT: varColor('--color-accent'),
        fg: varColor('--color-accent-fg'),
        line: varColor('--color-accent-line'),
        contrast: varColorContrast('--color-accent'),
        under: varColorUnder('--color-accent'),
        hover: varColorHover('--color-accent'),
        active: varColorActive('--color-accent'),
        lighter: {
          DEFAULT: varColor('--color-accent-lighter'),
          fg: varColor('--color-accent-lighter-fg'),
          line: varColor('--color-accent-lighter-line'),
          contrast: varColorContrast('--color-accent-lighter'),
          under: varColorUnder('--color-accent-lighter'),
          hover: varColorHover('--color-accent-lighter'),
          active: varColorActive('--color-accent-lighter'),
        },
        darker: {
          DEFAULT: varColor('--color-accent-darker'),
          fg: varColor('--color-accent-darker-fg'),
          line: varColor('--color-accent-darker-line'),
          contrast: varColorContrast('--color-accent-darker'),
          under: varColorUnder('--color-accent-darker'),
          hover: varColorHover('--color-accent-darker'),
          active: varColorActive('--color-accent-darker'),
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
    require('@tailwindcss/container-queries'),
    scrollbarPlugin(),
    gridPlugin(),
    typescalePlugin(),
    pointerPlugin(),
    surfacePlugin(),
    focusablePlugin(),
    developmentPlugin(),
    hocusPlugin(),
  ],
} satisfies Config
