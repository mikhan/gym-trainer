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

  const valueLimits = getLimits(data, unit)
  const maxValue = valueLimits?.max.value ?? 0
  const subdivisions = (valueLimits && getSubdivisions(valueLimits, 5)) || []

  const chartData = getCalendar(data)

  function getSubdivisions(record: WeightLiftRecord, interval = 10) {
    const { value, unit } = record.max
    return Array.from(
      { length: Math.ceil(value / interval) },
      (_, i) => `${(i + 1) * interval} ${unit}`,
    )
  }

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

  function getDummyData(): WeightLiftRecord[] {
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

  function formatDateInterval(start: Date, end: Date) {
    const sameYear = start.getFullYear() === end.getFullYear()
    const sameMonth = sameYear && start.getMonth() === end.getMonth()
    const sameDay = sameMonth && start.getDate() === end.getDate()
    const thisYear = sameYear && start.getFullYear() === new Date().getFullYear()

    const formatMonth = new Intl.DateTimeFormat('es-MX', { month: 'long' })
    if (sameDay) {
      return formatMonth.format(start)
    }

    if (sameMonth) {
      const month = formatMonth.format(start)
      const year = start.getFullYear()
      return (
        `del ${start.getDate()} al ${end.getDate()} de ${month}` + (thisYear ? '' : ` de ${year}`)
      )
    }

    if (sameYear) {
      const year = start.getFullYear()
      return (
        `del ${start.getDate()} de ${formatMonth.format(start)} al ${end.getDate()} de ${formatMonth.format(end)}` +
        (thisYear ? '' : ` de ${year}`)
      )
    }

    return formatter.format(start) + ' - ' + formatter.format(end)
  }
</script>

<section class="grid grid-rows-[auto,1fr] gap-4 surface color-neutral-darker rounded-card shadow">
  <div class="typescale-title p-4">Historial de peso levantado</div>
  <picture
    class="grid grid-cols-[1fr,5ch] grid-rows-[theme(spacing.12),theme(spacing.48),1fr] px-4">
    <div
      class="flex flex-col justify-between col-start-1 row-start-2 h-48 typescale-label
      utline outline-1 -outline-offset-1 outline-[red]">
      {#each subdivisions.toReversed() as subdivision}
        <div class="relative w-full border-t border-dashed border-default-line">
          <span class="absolute right-0 translate-x-full -translate-y-1/2 pl-2">{subdivision}</span>
        </div>
      {/each}
      <div class="w-full"></div>
    </div>

    <scroll
      class="grid auto-cols-[100%] grid-flow-col size-full contain-paint
      col-start-1 row-start-1 row-span-3 z-1
      overflow-x-auto snap-x snap-mandatory scrollbar outline-none"
      dir="rtl">
      {#each chartData.toReversed() as { start, end, records }}
        <section class="grid grid-rows-[auto,1fr] snap-start snap-always">
          <header class="h-12 w-full text-left typescale-label">
            Semana {formatDateInterval(start, end)}
          </header>
          <ul class="grid grid-cols-7 utline-dashed outline-1 -outline-offset-1 outline-[green]">
            {#each records.toReversed() as record, index}
              <li class="grid grid-rows-[12rem,auto]">
                <div class="relative flex flex-col items-center @container-[size]">
                  {#if record.values.length}
                    <div
                      class="absolute box-content w-2 bg-primary rounded-full"
                      style:top={`calc(100cqb * ${1 - record.values.at(-1)! / maxValue} - 4px)`}
                      style:bottom={`calc(100cqb * ${record.values.at(0)! / maxValue} - 4px)`}>
                      <!-- {#if record.values.at(0) !== record.values.at(-1)}
                        <span
                          class="absolute right-full text-center bottom-0 border-b-2 border-primary m-1 typescale-label opacity-75">
                          {record.values.at(0)}
                        </span>
                        <span
                          class="absolute left-full text-center top-0 border-t-2 border-primary m-1 typescale-label opacity-75">
                          {record.values.at(-1)}
                        </span>
                      {:else}
                        <span
                          class="absolute left-full text-center top-0 -translate-y-1/2 m-1 typescale-label opacity-75">
                          {record.values.at(-1)}
                        </span>
                      {/if} -->
                    </div>
                  {/if}
                </div>
                <div
                  class="text-center border-t-2 border-default-line p-1 mb-2 typescale-label relative">
                  <div class="absolute left-1/2 h-1 w-0.5 top-0 bg-default-line"></div>
                  {weekDays[records.length - 1 - index]}
                </div>
              </li>
            {/each}
          </ul>
        </section>
      {/each}
    </scroll>
  </picture>
</section>
