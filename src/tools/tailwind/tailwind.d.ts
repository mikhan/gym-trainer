declare module 'tailwindcss/lib/util/toColorValue' {
  declare const toColorValue: (maybeFunction: ((arg: unknown) => string) | string) => string
  export = toColorValue
}

declare module 'tailwindcss/lib/util/flattenColorPalette' {
  declare const flattenColorPalette: (colors: unknown) => Record<string, string>
  export = flattenColorPalette
}
