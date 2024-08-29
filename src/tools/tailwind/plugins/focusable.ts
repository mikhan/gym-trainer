import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette'
import toColorValue from 'tailwindcss/lib/util/toColorValue'
import plugin from 'tailwindcss/plugin'

export function focusablePlugin() {
  return plugin(function ({ matchUtilities, theme }) {
    const getStyle = (value: string) => ({
      'outline': `2px solid ${toColorValue(value)}`,
      'outline-offset': '-2px',
    })
    matchUtilities(
      {
        'focusable': (value) => ({ '&:focus-visible': getStyle(value) }),
        'focusable-within': (value) => ({ '&:has(:focus-visible)': getStyle(value) }),
        'focused': (value) => getStyle(value),
      },
      { values: flattenColorPalette(theme('colors')), type: 'color' },
    )
  })
}
