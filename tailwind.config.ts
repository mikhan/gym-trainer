import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'
import { gridPlugin } from './src/tools/tailwind/plugins/grid'
import { pointerPlugin } from './src/tools/tailwind/plugins/pointer'
import { scrollbarPlugin } from './src/tools/tailwind/plugins/scrollbar'
import { typescalePlugin } from './src/tools/tailwind/plugins/typescale'

const varColor = (varName: string) => `oklch(from var(${varName}) l c h / <alpha-value>)`
const colorHover = (varName: string) =>
  `oklch(from color-mix(in oklch, var(${varName}), var(${varName}-fg) 10%) l c h / <alpha-value>)`
const colorActive = (varName: string) =>
  `oklch(from color-mix(in oklch, var(${varName}), var(${varName}-fg) 15%) l c h / <alpha-value>)`

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'selector',
  theme: {
    fontFamily: {
      sans: ["var(--font-family-sans, '')", ...fontFamily.sans],
      mono: ["var(--font-family-mono, '')", ...fontFamily.mono],
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
      ring: {
        DEFAULT: varColor('--color-ring'),
      },
      selection: {
        DEFAULT: varColor('--color-selection'),
        fg: varColor('--color-selection-fg'),
      },
      surface: {
        DEFAULT: varColor('--color-surface'),
        fg: varColor('--color-surface-fg'),
        line: varColor('--color-surface-line'),
        hover: colorHover('--color-surface'),
        active: colorActive('--color-surface'),
      },
      canvas: {
        DEFAULT: varColor('--color-canvas'),
        fg: varColor('--color-canvas-fg'),
        line: varColor('--color-canvas-line'),
        hover: colorHover('--color-canvas'),
        active: colorActive('--color-canvas'),
      },
      neutral: {
        DEFAULT: varColor('--color-neutral'),
        fg: varColor('--color-neutral-fg'),
        line: varColor('--color-neutral-line'),
        hover: colorHover('--color-neutral'),
        active: colorActive('--color-neutral'),
        lighter: {
          DEFAULT: varColor('--color-neutral-lighter'),
          fg: varColor('--color-neutral-lighter-fg'),
          line: varColor('--color-neutral-lighter-line'),
          hover: colorHover('--color-neutral-lighter'),
          active: colorActive('--color-neutral-lighter'),
        },
        lightest: {
          DEFAULT: varColor('--color-neutral-lightest'),
          fg: varColor('--color-neutral-lightest-fg'),
          line: varColor('--color-neutral-lightest-line'),
          hover: colorHover('--color-neutral-lightest'),
          active: colorActive('--color-neutral-lightest'),
        },
        darker: {
          DEFAULT: varColor('--color-neutral-darker'),
          fg: varColor('--color-neutral-darker-fg'),
          line: varColor('--color-neutral-darker-line'),
          hover: colorHover('--color-neutral-darker'),
          active: colorActive('--color-neutral-darker'),
        },
        darkest: {
          DEFAULT: varColor('--color-neutral-darkest'),
          fg: varColor('--color-neutral-darkest-fg'),
          line: varColor('--color-neutral-darkest-line'),
          hover: colorHover('--color-neutral-darkest'),
          active: colorActive('--color-neutral-darkest'),
        },
      },
      popover: {
        DEFAULT: varColor('--color-popover'),
        fg: varColor('--color-popover-fg'),
        line: varColor('--color-popover-line'),
        hover: colorHover('--color-popover'),
        active: colorActive('--color-popover'),
      },
      primary: {
        DEFAULT: varColor('--color-primary'),
        fg: varColor('--color-primary-fg'),
        line: varColor('--color-primary-line'),
        hover: colorHover('--color-primary'),
        active: colorActive('--color-primary'),
        lighter: {
          DEFAULT: varColor('--color-primary-lighter'),
          fg: varColor('--color-primary-lighter-fg'),
          line: varColor('--color-primary-lighter-line'),
          hover: colorHover('--color-primary-lighter'),
          active: colorActive('--color-primary-lighter'),
        },
        darker: {
          DEFAULT: varColor('--color-primary-darker'),
          fg: varColor('--color-primary-darker-fg'),
          line: varColor('--color-primary-darker-line'),
          hover: colorHover('--color-primary-darker'),
          active: colorActive('--color-primary-darker'),
        },
      },
      secondary: {
        DEFAULT: varColor('--color-secondary'),
        fg: varColor('--color-secondary-fg'),
        line: varColor('--color-secondary-line'),
        hover: colorHover('--color-secondary'),
        active: colorActive('--color-secondary'),
        lighter: {
          DEFAULT: varColor('--color-secondary-lighter'),
          fg: varColor('--color-secondary-lighter-fg'),
          line: varColor('--color-secondary-lighter-line'),
          hover: colorHover('--color-secondary-lighter'),
          active: colorActive('--color-secondary-lighter'),
        },
        darker: {
          DEFAULT: varColor('--color-secondary-darker'),
          fg: varColor('--color-secondary-darker-fg'),
          line: varColor('--color-secondary-darker-line'),
          hover: colorHover('--color-secondary-darker'),
          active: colorActive('--color-secondary-darker'),
        },
      },
      accent: {
        DEFAULT: varColor('--color-accent'),
        fg: varColor('--color-accent-fg'),
        line: varColor('--color-accent-line'),
        hover: colorHover('--color-accent'),
        active: colorActive('--color-accent'),
        lighter: {
          DEFAULT: varColor('--color-accent-lighter'),
          fg: varColor('--color-accent-lighter-fg'),
          line: varColor('--color-accent-lighter-line'),
          hover: colorHover('--color-accent-lighter'),
          active: colorActive('--color-accent-lighter'),
        },
        darker: {
          DEFAULT: varColor('--color-accent-darker'),
          fg: varColor('--color-accent-darker-fg'),
          line: varColor('--color-accent-darker-line'),
          hover: colorHover('--color-accent-darker'),
          active: colorActive('--color-accent-darker'),
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
    scrollbarPlugin(),
    gridPlugin(),
    typescalePlugin(),
    pointerPlugin(),
    // textShadowPlugin(),
    // formPlugin(),
    // linkPlugin(),
    // textWrapPlugin(),
    // cssVariablesPlugin(),
    // elevationPlugin(),
    // hocusPlugin(),
    // focusablePlugin(),
    // layoutPlugin(),
    // buttonPlugin(),
    // surfacePlugin({
    //   canvas: 'canvas',
    //   1: 'surface-1',
    //   2: 'surface-2',
    //   primary: 'surface-primary',
    // }),
  ],
} satisfies Config
