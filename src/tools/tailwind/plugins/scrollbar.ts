import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette'
import toColorValue from 'tailwindcss/lib/util/toColorValue'
import plugin from 'tailwindcss/plugin'

export function scrollbarPlugin() {
  return plugin(function ({ matchUtilities, theme, addUtilities }) {
    // const scrollbarWidth = {
    //   auto: ['16px', '8px'],
    //   thin: ['10px', '6px'],
    // } as Record<string, [string, string]>

    // matchUtilities(
    //   {
    //     scrollbar: (width) => {
    //       const [trackSize, thumbSize] = scrollbarWidth[width] ?? ['0px', '0px']

    //       return {
    //         '--scrollbar-track-color': 'rgb(0 0 0 / 20%)',
    //         '--scrollbar-thumb-color': 'rgb(255 255 255 / 25%)',
    //         '@media (pointer: fine)': {
    //           '&::-webkit-scrollbar-thumb:hover': {
    //             'background-color': 'var(--scrollbar-thumb-color)',
    //           },
    //           '&::-webkit-scrollbar': {
    //             'width': trackSize,
    //             'height': trackSize,
    //             'background-color': 'var(--scrollbar-track-color)',
    //           },
    //           '&::-webkit-scrollbar-corner ': {
    //             'background-color': 'var(--scrollbar-track-color)',
    //           },
    //           '&::-webkit-scrollbar-thumb': {
    //             'border': `calc(calc(${trackSize} - ${thumbSize}) / 2) solid transparent`,
    //             'border-radius': `calc(${trackSize} / 2)`,
    //             'background-color': 'var(--scrollbar-thumb-color)',
    //             'background-clip': 'content-box',
    //           },
    //         },
    //       }
    //     },
    //   },
    //   {
    //     values: {
    //       DEFAULT: 'auto',
    //       thin: 'thin',
    //       none: 'none',
    //     },
    //   },
    // )

    matchUtilities(
      {
        scrollbar: (width) => {
          return {
            '--scrollbar-track-color': 'rgb(0 0 0 / 0%)',
            '--scrollbar-thumb-color': 'rgb(255 255 255 / 25%)',
            'scrollbar-width': width,
            'scrollbar-color': 'var(--scrollbar-thumb-color) var(--scrollbar-track-color)',
          }
        },
      },
      {
        values: {
          DEFAULT: 'auto',
          thin: 'thin',
          none: 'none',
        },
      },
    )

    matchUtilities(
      {
        'scrollbar-thumb': (value) => {
          return {
            '--scrollbar-thumb-color': toColorValue(value),
          }
        },
      },
      { values: flattenColorPalette(theme('colors')), type: 'color' },
    )

    matchUtilities(
      {
        'scrollbar-track': (value) => {
          return {
            '--scrollbar-track-color': toColorValue(value),
          }
        },
      },
      { values: flattenColorPalette(theme('colors')), type: 'color' },
    )

    addUtilities({
      '.scrollbar-stable': {
        'scrollbar-gutter': 'stable',
      },
      '.scrollbar-autohide': {
        '&:not(:hover)': {
          '--scrollbar-thumb-color': 'transparent',
        },
      },
    })
  })
}
