import plugin from 'tailwindcss/plugin'

const DEFAULT_CONFIG = {
  theme: {
    zoom: {
      lg: '1.25',
      xl: '1.5',
    },
  },
}

export function zoomPlugin() {
  return plugin(function ({ matchUtilities, theme }) {
    matchUtilities(
      {
        zoom: (value) => {
          return {
            zoom: value,
          }
        },
      },
      { values: theme('zoom') },
    )
  }, DEFAULT_CONFIG)
}
