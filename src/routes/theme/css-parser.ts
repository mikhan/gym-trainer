export class UnitLengthToken {
  readonly type = 'unit-length'
  value: number
  readonly min: number | undefined
  readonly max: number | undefined
  readonly unit: string
  constructor(value: number, options: { min?: number; max?: number; unit?: string } = {}) {
    this.value = value
    this.min = options.min
    this.max = options.max
    this.unit = options.unit ?? ''
  }

  toString() {
    return this.value + this.unit
  }
}

export class VarToken {
  readonly type = 'var'
  constructor(public value: string) {}

  toString() {
    return this.value
  }
}

export class TextToken {
  readonly type = 'text'
  constructor(public value: string) {}

  toString() {
    return this.value
  }
}

type Token = UnitLengthToken | VarToken | TextToken

type TokenMatcher = {
  test: RegExp
  handle: (match: RegExpExecArray) => { start: number; end: number; value: Token }
}

const matchers: TokenMatcher[] = []

matchers.push({
  test: /(?<value>-?[0-9]+(?:\.[0-9]+)?)(?<unit>[a-z%]+)?/g,
  handle({ 0: match, index, groups }) {
    return {
      start: index,
      end: index + match.length,
      value: new UnitLengthToken(parseFloat(match), { min: 0, unit: groups?.unit }),
    }
  },
})

matchers.push({
  test: /--[-a-z]+/g,
  handle({ 0: match, index }) {
    return {
      start: index,
      end: index + match.length,
      value: new VarToken(match),
    }
  },
})

const isToken = (value: Token | null): value is Token => value !== null

export function parse(value?: string): Token[] {
  if (!value) return []

  const parts: (Token | null)[] = Array.from({ length: value.length }, () => null)

  for (const matcher of matchers) {
    for (const match of value.matchAll(matcher.test)) {
      const { start, end, value } = matcher.handle(match)
      const section = parts.slice(start, end)

      if (section.some(isToken)) throw new Error('CSS Parser error')

      parts.splice(start, section.length, ...section.map(() => value))
    }
  }

  const result = parts
    .reduce((parts, part, index) => {
      if (part === null) {
        const prev = parts[index - 1]
        const textToken: TextToken = prev && prev.type === 'text' ? prev : new TextToken('')
        textToken.value += value[index] ?? ''
        parts.push(textToken)
      } else {
        parts.push(part)
      }

      return parts
    }, [] as Token[])
    .filter((e, i, a) => a.indexOf(e) === i)

  return result
}
