<script lang="ts">
  import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
  import clsx from 'clsx'
  import { onMount } from 'svelte'
  import Fa from 'svelte-fa'
  import UiCarousel from '$lib/components/ui/UiCarousel.svelte'
  import UiIconbutton from '$lib/components/ui/UiIconbutton.svelte'
  import { convertUnit, type Unit } from '$lib/utils/unit-converter'
  import { getDummyData } from './utils'

  type Weight = { value: number; unit: Unit }

  type WeightLiftLimits = {
    max: Weight
    min: Weight
  }

  type WeightLiftRecord = {
    date: Date
  } & WeightLiftLimits

  type ChartData = {
    label: string
    values: ({ min: number; max: number } | null)[]
  }

  type Props = { data?: WeightLiftRecord[] }
  const { data = getDummyData() }: Props = $props()

  const DAY = 24 * 60 * 60 * 1000
  const stepLb = { value: 10, unit: 'lb' } as Weight
  const stepKg = { value: 5, unit: 'kg' } as Weight
  const formatter = new Intl.DateTimeFormat(['es-MX'], { dateStyle: 'short' })

  let unit: Unit = $state(data[0]?.min.unit ?? 'lb')
  let currentIndex = $state(0)
  const step = $derived(unit === 'lb' ? stepLb : stepKg)
  const normalizedData = $derived(normalizeData(data, unit))
  const groupedData = $derived(groupData(normalizedData))
  const current = $derived(groupedData[currentIndex]!)
  const limits = $derived(getLimits(normalizedData, step))
  const maxValue = $derived(limits?.max.value ?? 0)
  const xLabels = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom']
  const yLabels = $derived((limits && getSubdivisions(limits, step).toReversed()) || [])

  function normalizeData(data: WeightLiftRecord[], unit: Unit) {
    return data.map(({ date, min, max }) => ({
      date,
      min: { value: +convertUnit(min.value, min.unit, unit).toFixed(1), unit: min.unit },
      max: { value: +convertUnit(max.value, max.unit, unit).toFixed(1), unit: max.unit },
    }))
  }

  function groupData(data: WeightLiftRecord[]): ChartData[] {
    const sortedDates = data.map(({ date }) => date).toSorted((a, b) => +a - +b)
    const first = +getMonday(clearTime(sortedDates.at(0)!))
    const last = +getMonday(clearTime(sortedDates.at(-1)!)) + 6 * DAY
    const groupedData: Record<string, ChartData> = {}

    for (let timestamp = first; timestamp <= last; timestamp += DAY) {
      const records = Array.from({ length: 7 }, (_, i) => new Date(timestamp + i * DAY))
      const start = records.at(0)!
      const end = records.at(-1)!
      const week = getWeekNumber(start)

      groupedData[week] = {
        label: formatDateInterval(start, end),
        values: records.map(() => null),
      }
    }

    for (const { date, min, max } of data) {
      const week = getWeekNumber(date)
      const day = date.getDay()
      groupedData[week]!.values[day - 1] = {
        min: min.value,
        max: max.value,
      }
    }

    console.log(groupedData)

    return Object.values(groupedData)
  }

  function getLimits(records: WeightLiftRecord[], step: Weight): WeightLiftLimits | null {
    if (records.length < 2) return records[0] ?? null

    const { min, max } = records.reduce(
      (values, { min, max }) => ({
        min: {
          value: Math.min(values.min.value, min.value, max.value),
          unit: step.unit,
        },
        max: {
          value: Math.max(values.max.value, min.value, max.value),
          unit: step.unit,
        },
      }),
      {
        min: { value: Infinity, unit: step.unit },
        max: { value: -Infinity, unit: step.unit },
      } as WeightLiftLimits,
    )

    min.value = min.value - (min.value % step.value)
    max.value = max.value + (step.value - (max.value % step.value))

    return { min, max }
  }

  function getSubdivisions(record: WeightLiftLimits, step: Weight) {
    const { value, unit } = record.max
    const length = Math.ceil(value / step.value) + 1
    return Array.from({ length }, (_, i) => `${i * step.value} ${unit}`)
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

  function formatDateInterval(start: Date, end: Date) {
    const sameYear = start.getFullYear() === end.getFullYear()
    const sameMonth = sameYear && start.getMonth() === end.getMonth()
    const sameDay = sameMonth && start.getDate() === end.getDate()
    const thisYear = sameYear && start.getFullYear() === new Date().getFullYear()

    if (sameDay) {
      const formatMonth = new Intl.DateTimeFormat('es-MX', { month: 'long' })
      return formatMonth.format(start)
    }

    if (sameMonth) {
      const formatMonth = new Intl.DateTimeFormat('es-MX', { month: 'long' })
      const month = formatMonth.format(start)
      const year = start.getFullYear()
      return `${start.getDate()} - ${end.getDate()} de ${month}` + (thisYear ? '' : ` de ${year}`)
    }

    if (sameYear) {
      const formatMonth = new Intl.DateTimeFormat('es-MX', { month: 'short' })
      const year = start.getFullYear()
      return (
        `${start.getDate()} de ${formatMonth.format(start)} - ${end.getDate()} de ${formatMonth.format(end)}` +
        (thisYear ? '' : ` de ${year}`)
      )
    }

    return formatter.format(start) + ' - ' + formatter.format(end)
  }

  const weekGraphElements: HTMLElement[] = $state([])

  function gotoWeekGraph(index: number) {
    weekGraphElements[index]?.scrollIntoView({ behavior: 'smooth' })
  }

  function setCurrentElement(element: HTMLElement | null) {
    if (typeof element?.dataset.index === 'undefined') return
    currentIndex = Number.parseInt(element.dataset.index)
  }

  onMount(() => {
    currentIndex = groupedData.length - 1
  })
</script>

<section class="p-4 space-y-4 surface color-neutral-darker rounded-card shadow">
  <div class="flex items-center gap-2">
    <div class="typescale-title flex-1">Historial de peso levantado</div>
    <label class="ui-input">
      <select bind:value={unit}>
        <option value="lb">Lb.</option>
        <option value="kg">Kg.</option>
      </select>
    </label>
  </div>
  <div class="flex items-center gap-2">
    <UiIconbutton
      class="flex-none"
      size="sm"
      label="Anterior"
      disabled={currentIndex === 0}
      onclick={() => gotoWeekGraph(currentIndex - 1)}>
      <Fa icon={faChevronLeft}></Fa>
    </UiIconbutton>
    <div class="flex-1 text-center">
      {current.label}
    </div>
    <UiIconbutton
      class="flex-none"
      size="sm"
      label="Siguiente"
      disabled={currentIndex === groupedData.length - 1}
      onclick={() => gotoWeekGraph(currentIndex + 1)}>
      <Fa icon={faChevronRight}></Fa>
    </UiIconbutton>
  </div>
  <picture class="grid grid-cols-[1fr,3rem] grid-rows-[auto,auto]">
    <!-- Divisions -->
    <div class="flex flex-col justify-between col-start-1 row-start-1 typescale-label">
      <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
      {#each yLabels as _}
        <div class="relative w-full border-t border-default-line"></div>
      {/each}
    </div>

    <!-- Data -->
    <UiCarousel
      class="col-start-1 row-start-1 scrollbar-none outline-none"
      dir="rtl"
      onscrollsnapchange={({ detail }) => setCurrentElement(detail.snapTargetInline)}>
      {#each groupedData.toReversed() as { values: records }, index}
        {@const chartIndex = groupedData.length - 1 - index}
        <section
          class="h-48 grid grid-cols-7"
          dir="ltr"
          data-index={chartIndex}
          bind:this={weekGraphElements[chartIndex]}>
          {#each records as record}
            <div class="group relative flex flex-col items-center @container-[size]">
              {#if record}
                <div
                  class="absolute box-content flex flex-col justify-between w-[12px] -m-1.5 bg-primary-darker rounded-full"
                  style:top={`calc(100cqb * ${1 - record.max / maxValue})`}
                  style:bottom={`calc(100cqb * ${record.min / maxValue})`}>
                  {#snippet dot()}
                    <div
                      class="size-3 rounded-full bg-primary-fg bg-clip-content border-4 border-transparent">
                    </div>
                  {/snippet}
                  {#snippet label(value: number, className?: string)}
                    <div
                      class={clsx(
                        'text-center border-primary-darker my-1 typescale-label',
                        'opacity-0 group-hover:opacity-100 transition-opacity',
                        className,
                      )}>
                      {value}
                    </div>
                  {/snippet}

                  {#if record.min === record.max}
                    {@render dot()}
                    {@render label(record.min, 'absolute right-full bottom-0 border-b-2 pr-1')}
                  {:else}
                    {@render label(record.min, 'absolute right-full bottom-0 border-b-2 pr-1')}
                    {@render dot()}
                    {@render dot()}
                    {@render label(record.max, 'absolute left-full top-0 border-t-2 pl-1')}
                  {/if}
                </div>
              {/if}
            </div>
          {/each}
        </section>
      {/each}
    </UiCarousel>

    <!-- Y Labels -->
    <div class="flex flex-col justify-between typescale-label">
      {#each yLabels as subdivision}
        <div class="relative">
          <span class="absolute left-0 -translate-y-1/2 pl-2">{subdivision}</span>
        </div>
      {/each}
    </div>

    <!-- X Labels -->
    <div class="grid grid-cols-7">
      {#each xLabels as weekday}
        <div class="text-center border-t-2 border-default-line p-1 typescale-label relative">
          <div class="absolute left-1/2 h-1 w-0.5 top-0 bg-default-line"></div>
          {weekday}
        </div>
      {/each}
    </div>
  </picture>
</section>
