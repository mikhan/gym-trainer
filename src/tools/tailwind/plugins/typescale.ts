import plugin from 'tailwindcss/plugin'

const DEFAULT_MIN_SCREEN = 480
const DEFAULT_MAX_SCREEN = 1024
const BASE_FONT = 16
const BASE_LINE = BASE_FONT * 1.5

const createFluidValue = (
  minSize: number,
  maxSize: number,
  minScreenSize = DEFAULT_MIN_SCREEN,
  maxScreenSize = DEFAULT_MAX_SCREEN,
) => {
  return `clamp(${rem(minSize)}, ${getPreferredValue(minSize, maxSize, minScreenSize, maxScreenSize)}, ${rem(
    maxSize,
  )})`
}

const getPreferredValue = (
  minSize: number,
  maxSize: number,
  minScreenSize: number,
  maxScreenSize: number,
) => {
  const vwCalc = cleanNumber((100 * (maxSize - minSize)) / (maxScreenSize - minScreenSize))
  const remCalc = cleanNumber(
    (minScreenSize * maxSize - maxScreenSize * minSize) / (minScreenSize - maxScreenSize),
  )

  return `${vwCalc}vw + ${rem(remCalc)}`
}

const rem = (px: number) => `${cleanNumber(Number(px) / 16)}rem`

const cleanNumber = (num: number) => +num.toFixed(3)
// const fontSize = (fontSize, lineHeight) => [
//   pxToRem(fontSize),
//   pxToRem(fontSize * lineHeight),
// ]

// const scaleFont = (base, step, scale) => base * scale ** step
const fluidFontSize = (step: number) =>
  createFluidValue(BASE_FONT * 1.125 ** step, BASE_FONT * 1.333 ** step)
const fluidLineHeight = (step: number) =>
  createFluidValue(BASE_LINE * 1.125 ** step, BASE_LINE * 1.333 ** step)

export function typescalePlugin() {
  return plugin(function ({ addComponents }) {
    addComponents({
      '.typescale-label': {
        'font-size': rem(BASE_FONT * 1.125 ** -2), //'0.75rem',
        'line-height': rem(BASE_LINE * 1.125 ** -2), //'1rem',
        'font-weight': '400',
      },
      '.typescale-body': {
        'font-size': rem(BASE_FONT), //'0.875rem',
        'line-height': rem(BASE_LINE), //'1.25rem',
        'font-weight': '400',
      },
      '.typescale-title': {
        'font-size': fluidFontSize(1), //'1rem',
        'line-height': fluidLineHeight(1), //'1.5rem',
        'font-weight': '500',
      },
      '.typescale-headline': {
        'font-size': fluidFontSize(2), //'1.75rem',
        'line-height': fluidLineHeight(2), //'2.25rem',
        'font-weight': '400',
      },
      '.typescale-display': {
        'font-size': fluidFontSize(4), //'2.8125rem',
        'line-height': fluidLineHeight(4), //'3.25rem',
        'font-weight': '300',
      },
    })
  })
}
