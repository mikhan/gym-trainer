export const UNITS = ['kg', 'lb', 'gr'] as const

type Unit = (typeof UNITS)[number]

const conversions: Record<Unit, number> = {
  kg: 1,
  lb: 2.20462,
  gr: 1000,
}

export function convertUnit(value: number, from: string, to: string): number {
  if (!isKeyof(from, conversions)) throw new TypeError(`Invalid unit '${from}'`)
  if (!isKeyof(to, conversions)) throw new TypeError(`Invalid unit '${to}'`)

  return (value / conversions[from]) * conversions[to]
}

function isKeyof<T extends object>(value: string | number | symbol, object: T): value is keyof T {
  return value in object
}
