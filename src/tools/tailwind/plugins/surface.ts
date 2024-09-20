// import toColorValue from 'tailwindcss/lib/util/toColorValue'
import plugin from 'tailwindcss/plugin'

const required = ['DEFAULT', 'fg', 'line', 'contrast', 'under', 'hover', 'active'] as const

interface ColorConfig {
  [K: string]: string | ColorConfig
}

type ColorComponents = {
  [K in (typeof required)[number]]: string
}

function isValidConfig(value: ColorConfig): value is ColorComponents & ColorConfig {
  return required.every((key) => key in value && typeof value[key] === 'string')
}

function getValues(colors: ColorConfig, parts: string[] = []) {
  let newColors: Record<string, ColorComponents> = {}

  for (const [key, value] of Object.entries(colors)) {
    if (typeof value === 'string' || !isValidConfig(value)) continue
    const { DEFAULT, fg, line, contrast, under, hover, active, ...other } = value
    newColors[[...parts, key].join('-')] = { DEFAULT, fg, line, contrast, under, hover, active }
    newColors = { ...newColors, ...getValues(other, [...parts, key]) }
  }

  return newColors
}

// type MaybeFunction = ((arg: unknown) => string) | string

export function surfacePlugin() {
  return plugin(function ({ addBase, addUtilities, matchUtilities, theme }) {
    const flattenColors = getValues(theme('colors'))
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
      { values: flattenColors, type: 'color' },
    )

    for (const name of Object.keys(flattenColors)) {
      const varName = `--color-${name}`
      addBase({
        body: {
          [`${varName}-contrast`]: `oklch(from var(${varName}-fg) calc(1 - l) c h)`,
          [`${varName}-under`]: `color-mix(in oklch, var(${varName}), var(${varName}-contrast) 10%)`,
          [`${varName}-hover`]: `color-mix(in oklch, var(${varName}), var(${varName}-fg) 10%)`,
          [`${varName}-active`]: `color-mix(in oklch, var(${varName}), var(${varName}-fg) 30%)`,
        },
      })
    }

    addUtilities({
      '.surface': {
        '@apply bg-default text-default-fg border-default-line': '',
      },
      '.surface-editable': {
        '@apply bg-default-under': '',
      },
      '.surface-hoverable': {
        '@apply hocus:bg-default-hover': '',
      },
      '.surface-activable': {
        '@apply active:bg-default-active': '',
      },
      '.surface-outlined': {
        '@apply outline outline-2 outline-default-line -outline-offset-2': '',
      },
      '.surface-focusable': {
        '@apply focusable-ring': '',
      },
      '.surface-glass': {
        '@apply bg-opacity-75 backdrop-blur': '',
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
