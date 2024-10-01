import type { Unit } from '$lib/utils/unit-converter'

type Weight = { value: number; unit: Unit }

type WeightLiftRecord = {
  date: Date
  max: Weight
  min: Weight
}

const DAY = 24 * 60 * 60 * 1000

export function getDummyData(): WeightLiftRecord[] {
  const config: [number, number, number][] = [
    [1, 15, 25],
    [3, 20, 25],
    [3, 20, 30],
    [2, 25, 30],
    [2, 25, 35],
    [3, 30, 40],
    [3, 30, 35],
    [3, 35, 35],
    [3, 35, 40],
  ]
  const values = config
    .map(([length, min, max]) => Array.from({ length }, () => ({ min, max })))
    .flat()
    .reverse()

  const today = Date.now()
  const data: WeightLiftRecord[] = []
  let day = 0
  let index = 0
  let i = 0

  while (index < values.length) {
    const date = new Date(today - day * DAY)
    date.setHours(Math.floor(Math.random() * 23))
    date.setMinutes(Math.floor(Math.random() * 55))
    date.setSeconds(Math.floor(Math.random() * 55))

    if (++i % 12 !== 0) day++
    // if (i === 20) day += 24
    // if (i === 30) day += 10

    if ([1, 2, 3, 4, 5].includes(date.getDay()) === false) continue

    const { min, max } = values[index++]!

    data.push({
      date,
      min: { value: min, unit: 'lb' },
      max: { value: max, unit: 'lb' },
    })
  }

  return data.toSorted((a) => (a.date.getDate() % 3) - 1)
}
