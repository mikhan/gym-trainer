type Prettify<T> = {
  [K in keyof T]: T[K]
} & unknown

export type PaletteConfig = {
  [K in string]: string | { color: string; shade?: number; shades?: number[] }
}

export type PaletteResult<T extends string> = Record<T, ColorResult>

export type ColorConfig = {
  color: string
  shade: number
  shades: number[]
}

export type Shades = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'

export type ColorShades = Shades | `${Shades}-fg` | 'ABC' | 'DEFAULT'

export type ColorResult = Record<ColorShades, string>

export type ColorAlias = (
  palette: PaletteResult<string>,
) => Record<string, string | Record<string, string>>

export type GeneratePalette = <P extends PaletteConfig>(
  config: P,
  options?: { dark?: boolean },
) => PaletteResult<keyof P & string>

export type GenerateVariables = <P extends PaletteResult<string>>(
  palette: P,
  alias?: ColorAlias,
) => Record<string, string>

export type GenerateColors = <P extends PaletteResult<string>, A extends ColorAlias>(
  palette: P,
  alias?: A,
) => Prettify<A extends undefined ? P : P & ReturnType<A>>

export type generateTailwindColors = <P extends PaletteResult<string>, A extends ColorAlias>(
  palette: P,
  alias?: A,
) => {
  colors: Prettify<A extends undefined ? P : P & ReturnType<A>>
  variables: Record<string, string>
}

export type GenerateColor = (config: ColorConfig, options?: { dark?: boolean }) => ColorResult

export type GetForegroundColor = (
  color: import('chroma-js').Color,
  options?: { contrastRatio?: number },
) => string | null

export type CreateFluidValue = (
  minSize: number,
  maxSize: number,
  minScreenSize: number,
  maxScreenSize: number,
) => string

export type GetPreferredValue = (
  minSize: number,
  maxSize: number,
  minScreenSize: number,
  maxScreenSize: number,
) => string
