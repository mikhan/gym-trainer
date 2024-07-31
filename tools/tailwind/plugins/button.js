import { parseColorFormat } from 'tailwindcss/lib/util/pluginUtils'
import toColorValue from 'tailwindcss/lib/util/toColorValue'
import plugin from 'tailwindcss/plugin'

export function buttonPlugin() {
  return plugin(function ({ addComponents, matchComponents, theme }) {
    addComponents({
      '.button': {
        'display': 'inline-flex',
        'justify-content': 'center',
        'align-items': 'center',
        'gap': theme('spacing.2'),
        'transition-duration': '150ms',
        'transition-property': 'background-color, border-color, transform',
        'border': '2px solid var(--bg)',
        'border-radius': theme('borderRadius.DEFAULT'),
        'padding-block': '0',
        'padding-inline': theme('spacing.6'),
        'min-width': theme('spacing.16'),
        'height': theme('spacing.12'),
        'font-weight': 'bold',
        'letter-spacing': theme('letterSpacing.wider'),
        'text-transform': 'uppercase',
        '&:is(:hover, :active)': {
          'border': '2px solid var(--hover)',
          'color': 'var(--fg)',
          'background-color': 'var(--hover)',
        },
        '&:active': {
          transform: 'translateY(2px)',
        },
      },
      '.button-filled': {
        'color': 'var(--fg)',
        'background-color': 'var(--bg)',
        'box-shadow': theme('elevation.low'),
      },
    })

    matchComponents(
      {
        button: (value) => {
          return {
            '--fg': toColorValue(parseColorFormat(value['fg'])),
            '--bg': toColorValue(parseColorFormat(value['bg'])),
            '--hover': toColorValue(parseColorFormat(value['hover'])),
          }
        },
      },
      { values: theme('buttons') },
    )
  })
}
