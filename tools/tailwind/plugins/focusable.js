import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette'
import { parseColorFormat } from 'tailwindcss/lib/util/pluginUtils'
import toColorValue from 'tailwindcss/lib/util/toColorValue'
import plugin from 'tailwindcss/plugin'

const DEFAULTS = {
  color: 'currentColor',
  style: 'solid',
  width: `2px`,
  offset: '2px',
}

export function focusablePlugin() {
  return plugin(function ({ addBase, addUtilities, matchUtilities, theme }) {
    const config = { ...DEFAULTS, ...theme('focusable') }

    addBase({
      ':root': {
        '--focusable-width': config.width,
        '--focusable-style': config.style,
        '--focusable-color': toColorValue(parseColorFormat(config.color)),
        '--focusable-offset': config.offset,
        '--focusable-direction': '1',
      },
      '@keyframes focusable-focus': {
        from: {
          'outline': 'var(--focusable-width) var(--focusable-style) transparent',
          'outline-offset': 'calc(1rem * var(--focusable-direction))',
        },
        to: {
          'outline': 'var(--focusable-width) var(--focusable-style) var(--focusable-color)',
          'outline-offset': 'calc(var(--focusable-offset) * var(--focusable-direction))',
        },
      },
    })

    matchUtilities(
      {
        focusable: (value) => {
          return { '--focusable-color': toColorValue(value) }
        },
      },
      { values: flattenColorPalette(theme('colors')), type: 'color' },
    )

    const selectors = ['focus', 'focus-visible', 'focus-within']

    for (const selector of selectors) {
      const className = selector.replace('focus', 'focusable')
      addUtilities({
        [`.${className}`]: {
          [`&:${selector}`]: {
            animation: `${theme('transitionDuration.normal')} focusable-focus forwards`,
          },
        },
      })
    }

    addUtilities({
      '.focusable-inner': {
        '--focusable-direction': '-1',
      },
    })
  })
}
