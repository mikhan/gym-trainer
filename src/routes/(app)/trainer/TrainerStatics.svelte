<script lang="ts">
  import { convertUnit, type Unit } from '$lib/utils/unit-converter'

  type WeightLiftRecord = {
    date: Date
    max: { value: number; unit: Unit }
    min: { value: number; unit: Unit }
  }

  type ChartData = {
    week: number
    start: Date
    end: Date
    records: { date: Date; values: number[] }[]
  }

  const DAY = 24 * 60 * 60 * 1000
  const formatter = new Intl.DateTimeFormat(['es-MX'], { dateStyle: 'short' })
  const weekDays = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom']

  const unit: Unit = 'lb'

  const data = getDummyData()
  // console.log(data)

  const valueLimits = getLimits(data, unit)
  // const minValue = valueLimits?.min.value ?? 0
  const maxValue = valueLimits?.max.value ?? 0
  // $inspect(valueLimits)

  const chartData = getCalendar(data)

  function getCalendar(data: WeightLiftRecord[]): ChartData[] {
    const dates = data.map(({ date }) => date).toSorted((a, b) => +a - +b)
    const first = +getMonday(clearTime(dates.at(0)!))
    const last = +getMonday(clearTime(dates.at(-1)!)) + 6 * DAY
    const chartData: Record<string, ChartData> = {}

    for (let timestamp = first; timestamp <= last; timestamp += DAY) {
      const records = Array.from({ length: 7 }, (_, i) => new Date(timestamp + i * DAY))
      const week = getWeekNumber(records.at(0)!)

      chartData[week] = {
        week: getWeekNumber(records.at(0)!),
        start: records.at(0)!,
        end: records.at(-1)!,
        records: records.map((date) => ({ date, values: [] })),
      }
    }

    for (const { date, min, max } of data) {
      const week = getWeekNumber(date)
      const day = date.getDay()
      const record = chartData[week]!.records[day - 1]!
      record.values.push(convertUnit(min.value, min.unit, unit))
      record.values.push(convertUnit(max.value, max.unit, unit))
      record.values = record.values.toSorted().filter((v, i, a) => a.indexOf(v) === i)
    }

    return Object.values(chartData)
  }

  // const dataSorted = data.toSorted((a, b) => a.date.getTime() - b.date.getTime())
  // console.log('dataSorted')
  // dataSorted.map(({ date }) => console.log(date.toJSON().slice(0, 10)))

  // const groupedData = Object.groupBy(data, ({ date }) => getWeekNumber(date))

  // const range = Object.keys(groupedData)
  //   .map((week) => +week)
  //   .sort()
  // console.log(
  //   Object.fromEntries(
  //     createRange(range.at(0)!, range.at(-1)!).map((week) => [week, groupedData[week] ?? []]),
  //   ),
  // )

  // console.log(chartData)

  // const chartData: ChartData[] = Object.entries(groupedData).map(([week, records = []]) => {
  //   const grouped = Object.groupBy(records, (i) => i.date.getDay() - 1)
  //   const start = getMonday(records[0]!.date)
  //   const end = new Date(start.getTime() + 6 * DAY)
  //   const fullRecords = Array.from({ length: 7 }, (_, i) => ({
  //     date: new Date(start.getTime() + DAY * i),
  //     values:
  //       grouped[i]
  //         ?.map(({ min, max }) => [
  //           convertUnit(min.value, min.unit, unit),
  //           convertUnit(max.value, max.unit, unit),
  //         ])
  //         .flat()
  //         .toSorted()
  //         .filter((v, i, a) => a.indexOf(v) === i) ?? null,
  //   }))
  //   return { week, start, end, records: fullRecords }
  // })
  // .reduce((charData, current, index) => {
  //   if (index === 0) return charData

  //   const diff = Number(current.week) - Number(charData.at(-1)!.week)
  //   for (let index = 1; index <= diff; index++) {
  //     const week = String(Number(charData.at(-1)!.week) + index)
  //     const start = getMonday(records[0]!.date)
  //     charData.push({ week })
  //   }
  //   charData.push(current)

  //   return charData
  // }, [] as ChartData[])

  // console.log('chartData', chartData)

  function clearTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

  function getMonday(date: Date) {
    date = new Date(date)
    const day = date.getDay()
    const diff = date.getDate() - day + (day == 0 ? -6 : 1)
    return new Date(date.setDate(diff))
  }

  function getWeekNumber(date: Date): number {
    date = clearTime(date)
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7))
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
    return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  }

  function getLimits(records: WeightLiftRecord[], unit: Unit): WeightLiftRecord | null {
    if (records.length < 2) return records[0] ?? null

    return records.reduce(
      (values, { date, min, max }) => ({
        date: new Date(Math.max(values.date.getTime(), date.getTime())),
        min: {
          value: +Math.min(
            values.min.value,
            convertUnit(min.value, min.unit, unit),
            convertUnit(max.value, max.unit, unit),
          ).toFixed(1),
          unit,
        },
        max: {
          value: +Math.max(
            values.max.value,
            convertUnit(min.value, min.unit, unit),
            convertUnit(max.value, max.unit, unit),
          ).toFixed(1),
          unit,
        },
      }),
      {
        date: new Date(0),
        min: { value: Infinity, unit },
        max: { value: -Infinity, unit },
      } as WeightLiftRecord,
    )
  }

  // function createRange(min: number, max: number) {
  //   return Array.from({ length: max - min }, (_, i) => min + i)
  // }

  function getDummyData(): WeightLiftRecord[] {
    const config: [number, number, number][] = [
      [1, 15, 25],
      [3, 20, 25],
      [3, 20, 30],
      [2, 25, 30],
      [2, 25, 35],
      [3, 30, 40],
      [3, 30, 35],
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

      if ([1, 3, 5].includes(date.getDay()) === false) continue

      const { min, max } = values[index++]!

      data.push({
        date,
        min: { value: min, unit: 'lb' },
        max: { value: max, unit: 'lb' },
      })
    }

    return data.toSorted((a) => (a.date.getDate() % 3) - 1)
  }
</script>

<section
  class="grid grid-rows-[auto,1fr] gap-4 rounded-card shadow color-neutral-darker surface mb-96">
  <div class="typescale-title p-4">Historial de peso levantado</div>

  <picture
    class="grid grid-cols-[1fr,theme(spacing.6)] grid-rows-[theme(spacing.12),theme(spacing.48),1fr]">
    <div
      class="flex flex-col justify-between col-start-1 row-start-2 h-48 typescale-label
      utline outline-1 -outline-offset-1 outline-[red]">
      <div class="w-full border-t border-dashed border-default-line"></div>
      <div class="w-full border-t border-dashed border-default-line"></div>
      <div class="w-full border-t border-dashed border-default-line"></div>
      <div class="w-full border-t border-dashed border-default-line"></div>
      <div class="w-full"></div>
    </div>

    <scroll
      class="grid auto-cols-[100%] grid-flow-col size-full contain-paint px-4 scroll-px-4 gap-4
      col-start-1 row-start-1 row-span-3 z-1
      overflow-x-auto snap-x snap-mandatory scrollbar outline-none"
      dir="rtl">
      {#each chartData as { week, start, end, records }}
        <section class="grid grid-rows-[auto,1fr] snap-start">
          <header class="h-12 sticky left-0 w-max pr-4">
            Semana {week} del {formatter.format(start)} - {formatter.format(end)}
          </header>
          <ul class="grid grid-cols-7 utline-dashed outline-1 -outline-offset-1 outline-[green]">
            {#each records as record, index}
              <li class="grid grid-rows-[theme(spacing.48),auto]">
                {#if record.values.length}
                  <div
                    class="bg-primary w-3 mx-auto relative rounded-full"
                    style:margin-bottom={`calc(12rem * ${record.values.at(0)! / maxValue})`}
                    style:margin-top={`calc(12rem * ${1 - record.values.at(-1)! / maxValue})`}>
                    <!-- <div
                      class="absolute left-1/2 -translate-x-1/2 text-center top-0 -translate-y-full typescale-label opacity-75">
                      {record.values.at(-1)}
                    </div>
                    <div
                      class="absolute left-1/2 -translate-x-1/2 text-center bottom-0 translate-y-full typescale-label opacity-75">
                      {record.values.at(0)}
                    </div> -->
                  </div>
                {:else}
                  <div></div>
                {/if}
                <div
                  class="text-center border-t-2 border-default-line p-1 mb-2 typescale-label relative">
                  <div class="absolute left-1/2 h-1 w-0.5 top-0 bg-default-line"></div>
                  {weekDays[index]}
                </div>
              </li>
            {/each}
          </ul>
        </section>
      {/each}
    </scroll>
  </picture>
</section>
