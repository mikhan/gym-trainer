import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette'
import toColorValue from 'tailwindcss/lib/util/toColorValue'
import plugin from 'tailwindcss/plugin'

export function scrollbarPlugin() {
  return plugin(function ({ matchUtilities, theme, addUtilities }) {
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

    matchUtilities(
      {
        'scrollbar-border': (value) => {
          return {
            '&::-webkit-scrollbar:vertical': {
              'border-left': `1px solid ${toColorValue(value)}`,
            },
            '&::-webkit-scrollbar:horizontal': {
              'border-top': `1px solid ${toColorValue(value)}`,
            },
          }
        },
      },
      { values: flattenColorPalette(theme('colors')), type: 'color' },
    )

    addUtilities({
      '.scrollbar-none': {
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      },
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
