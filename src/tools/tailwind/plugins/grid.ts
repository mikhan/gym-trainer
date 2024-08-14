import plugin from 'tailwindcss/plugin'

export function gridPlugin() {
  return plugin(function ({ matchUtilities, theme }) {
    matchUtilities(
      {
        'grid-cols-fill': (value) => ({
          gridTemplateColumns: `repeat(auto-fill, minmax(min(${value}, 100%), 1fr))`,
        }),
        'grid-cols-fit': (value) => ({
          gridTemplateColumns: `repeat(auto-fit, minmax(min(${value}, 100%), 1fr))`,
        }),
      },
      {
        values: theme('width', {}),
      },
    )
  })
}
