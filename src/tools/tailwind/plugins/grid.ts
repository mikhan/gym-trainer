import plugin from 'tailwindcss/plugin'

export function gridPlugin() {
  return plugin(function ({ addUtilities, matchUtilities, theme }) {
    addUtilities({
      '.stack': {
        display: 'grid',
      },
      '.stack > *': {
        gridColumn: '1 / -1',
        gridRow: '1 / -1',
      },
    })

    matchUtilities(
      {
        'grid-cols-fill': (value) => ({
          gridTemplateColumns: `repeat(auto-fill, minmax(min(${value}, 100%), 1fr))`,
        }),
        'grid-cols-fit': (value) => ({
          gridTemplateColumns: `repeat(auto-fit, minmax(min(${value}, 100%), 1fr))`,
        }),
        'grid-rows-fill': (value) => ({
          gridTemplateRows: `repeat(auto-fill, minmax(min(${value}, 100%), 1fr))`,
        }),
        'grid-rows-fit': (value) => ({
          gridTemplateRows: `repeat(auto-fit, minmax(min(${value}, 100%), 1fr))`,
        }),
      },
      {
        values: theme('width', {}),
      },
    )
  })
}
