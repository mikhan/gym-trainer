const m = 0x80000000 // 2**31;
const a = 1103515245
const c = 12345

export class Random {
  state: number

  constructor(seed: number) {
    this.state = seed ? seed : Math.floor(Math.random() * (m - 1))
  }

  nextInt() {
    this.state = (a * this.state + c) % m
    return this.state
  }

  nextFloat() {
    return this.nextInt() / (m - 1)
  }

  nextRange(start: number, end: number) {
    const rangeSize = end - start
    const randomUnder1 = this.nextInt() / m
    return start + Math.floor(randomUnder1 * rangeSize)
  }

  choose(array: unknown[]) {
    return array[this.nextRange(0, array.length)]
  }
}
