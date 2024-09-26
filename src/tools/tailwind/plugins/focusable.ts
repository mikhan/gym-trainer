import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette'
import toColorValue from 'tailwindcss/lib/util/toColorValue'
import plugin from 'tailwindcss/plugin'

export function focusablePlugin() {
  return plugin(function ({ addUtilities, matchUtilities, theme }) {
    const outlineStyle = '2px solid transparent'
    const outlineOffset = 'var(--focusable-offset, 0)'

    addUtilities({
      '.focusable-inside': {
        '--focusable-offset': '-2px',
      },
      '.focusable-outside': {
        '--focusable-offset': '0',
      },
    })

    matchUtilities(
      {
        'focusable': (value) => ({
          'outline': outlineStyle,
          'outline-offset': outlineOffset,
          '&:focus-visible': {
            'outline-color': toColorValue(value),
          },
        }),
        'focusable-within': (value) => ({
          'outline': outlineStyle,
          'outline-offset': outlineOffset,
          '&:has(:focus-visible)': {
            'outline-color': toColorValue(value),
          },
        }),
        'focused': (value) => ({
          'outline': outlineStyle,
          'outline-offset': outlineOffset,
          'outline-color': toColorValue(value),
        }),
      },
      { values: flattenColorPalette(theme('colors')), type: 'color' },
    )
  })
}
