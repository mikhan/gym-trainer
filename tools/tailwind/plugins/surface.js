import plugin from 'tailwindcss/plugin'

/**
 *
 * @param {Record<string, string>} values
 * @returns
 */
export function surfacePlugin(values) {
  return plugin(function ({ addUtilities, matchUtilities, theme }) {
    addUtilities({
      '.surface-border': {
        border: '1px solid var(--surface-border)',
      },
    })

    matchUtilities(
      {
        surface: (name) => {
          return {
            '--surface-bg': theme(`colors.${name}.bg`)?.replace(' / <alpha-value>', ''),
            '--surface-fg': theme(`colors.${name}.fg`)?.replace(' / <alpha-value>', ''),
            '--surface-border': theme(`colors.${name}.border`)?.replace(' / <alpha-value>', ''),
            '--surface-hover': theme(`colors.${name}.hover`)?.replace(' / <alpha-value>', ''),
            'background-color': 'var(--surface-bg)',
          }
        },
      },
      {
        values,
      },
    )
  })
}
