import plugin from 'tailwindcss/plugin'

export function cssVariablesPlugin() {
  return plugin(function ({ addBase, theme }) {
    const variables = theme('variables')

    addBase({
      ':root': variables,
      '::backdrop': variables,
    })
  })
}
