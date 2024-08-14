import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette'
import toColorValue from 'tailwindcss/lib/util/toColorValue'
import plugin from 'tailwindcss/plugin'

export function scrollbarPlugin() {
  return plugin(function ({ matchUtilities, theme, addUtilities }) {
    matchUtilities(
      {
        scrollbar: ([trackSize, thumbSize]) => {
          return {
            '--scrollbar-track-size': trackSize ?? '',
            '--scrollbar-track-color': 'transparent',
            '--scrollbar-thumb-size': thumbSize ?? '',
            '--scrollbar-thumb-color': 'currentColor',
            '@media (hover: hover)': {
              '&::-webkit-scrollbar-thumb:hover': {
                'background-color': 'var(--scrollbar-thumb-color)',
              },
              '&::-webkit-scrollbar': {
                'width': 'var(--scrollbar-track-size)',
                'height': 'var(--scrollbar-track-size)',
                'background-color': 'var(--scrollbar-track-color)',
              },
              '&::-webkit-scrollbar-corner ': {
                'background-color': 'var(--scrollbar-track-color)',
              },
              '&::-webkit-scrollbar-thumb': {
                'border':
                  'calc(calc(var(--scrollbar-track-size) - var(--scrollbar-thumb-size)) / 2) solid transparent',
                'border-radius': 'calc(var(--scrollbar-track-size) / 2)',
                'background-color':
                  'color-mix(in oklch, var(--scrollbar-thumb-color) 50%, transparent)',
                'background-clip': 'content-box',
              },
            },
          }
        },
      },
      {
        values: {
          DEFAULT: ['16px', '8px'],
          thin: ['8px', '4px'],
        } as Record<string, [string, string]>,
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

    matchUtilities(
      {
        'scrollbar-border': (value) => {
          return {
            '@media (hover: hover)': {
              '&::-webkit-scrollbar:vertical': {
                'border-left': `1px solid ${toColorValue(value)}`,
              },
              '&::-webkit-scrollbar:horizontal': {
                'border-top': `1px solid ${toColorValue(value)}`,
              },
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
