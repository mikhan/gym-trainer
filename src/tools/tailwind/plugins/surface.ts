// import toColorValue from 'tailwindcss/lib/util/toColorValue'
import plugin from 'tailwindcss/plugin'

const required = ['DEFAULT', 'fg', 'line', 'contrast', 'under', 'hover', 'active'] as const

interface ThemeColors {
  [K: string]: string | ThemeColors
}

type Valid = {
  [K in (typeof required)[number]]: string
}

function isValid(value: ThemeColors): value is Valid & Record<string, ThemeColors> {
  return required.every((key) => key in value && typeof value[key] === 'string')
}

function getValues(colors: ThemeColors, parts: string[] = []) {
  let newColors: Record<string, Valid> = {}

  for (const [key, value] of Object.entries(colors)) {
    if (typeof value === 'string') continue

    if (isValid(value)) {
      const { DEFAULT, fg, line, contrast, under, hover, active, ...other } = value
      newColors[[...parts, key].join('-')] = { DEFAULT, fg, line, contrast, under, hover, active }

      const subcolors = getValues(other, [...parts, key])

      newColors = { ...newColors, ...subcolors }
    }
  }

  return newColors
}

// type MaybeFunction = ((arg: unknown) => string) | string

export function surfacePlugin() {
  return plugin(function ({ addBase, addUtilities, matchUtilities, theme }) {
    matchUtilities(
      {
        color: (config) => {
          if (typeof config === 'string') return null
          const css: Record<string, string> = {}

          for (const [key, value] of Object.entries(config)) {
            const varName = key === 'DEFAULT' ? '--color-default' : `--color-default-${key}`

            // const fn = (({ opacityValue = 1 }) =>
            //   value.replace(/<alpha-value>/g, opacityValue.toString())) as unknown as MaybeFunction
            // css[varName] = toColorValue(fn)

            css[varName] = value.replace(
              /<alpha-value>/g,
              key === 'DEFAULT' ? 'var(--tw-bg-opacity, 1)' : '1',
            )
          }

          return css
        },
      },
      { values: getValues(theme('colors')), type: 'color' },
    )

    addUtilities({
      '.surface': {
        'background-color': 'var(--color-default)',
        'color': 'var(--color-default-fg)',
        'border-color': 'var(--color-default-line)',
      },
    })

    const properties = {
      '--color-default': 'hsl(0 0% 20%)',
      '--color-default-fg': 'hsl(0 0% 80%)',
      '--color-default-line': 'hsl(0 0% 40%)',
      '--color-default-contrast': 'hsl(0 0% 20%)',
      '--color-default-under': 'hsl(0 0% 15%)',
      '--color-default-hover': 'hsl(0 0% 25%)',
      '--color-default-active': 'hsl(0 0% 30%)',
    }

    for (const [property, value] of Object.entries(properties)) {
      addBase({
        [`@property ${property}`]: {
          syntax: '"<color>"',
          inherits: 'true',
          initialValue: value,
        },
      })
    }
  })
}
