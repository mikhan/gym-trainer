<script lang="ts">
  import { sortitem, sortlist } from '$lib/actions/sortable.action'
  import LineChart, { type ChartData } from './LineChart.svelte'
  import { TrainingViewportContext } from './TrainingViewportContext.svelte.js'

  type Props = {
    training: Types.Training
    routine: Types.Routine
    chartData?: ChartData[]
  }

  const { training, routine, chartData }: Props = $props()
  const trainingViewportContext = TrainingViewportContext.get()

  function getFromRegistry(elements: HTMLElement[]): Types.RoutineSerie[] {
    return elements.map((e) => {
      const routineId = e.dataset.routineId
      if (!routineId) throw new Error(`Attribute data-routine-id is not defined.`)
      const serieId = e.dataset.serieId
      if (!serieId) throw new Error(`Attribute data-serie-id is not defined.`)
      const routine = training.routines.find(({ id }) => id == routineId)
      if (!routine) throw new Error(`Routine id '${routineId}' doesn't exists.`)
      const serie = routine.series.find(({ id }) => id == serieId)
      if (!serie) throw new Error(`Serie id '${serieId}' doesn't exists.`)
      return serie
    })
  }

  function updateSeries(routine: Types.Routine, series: Types.RoutineSerie[]) {
    trainingViewportContext.updateRoutine({ ...routine, series })
  }
</script>

<article class="grid space-y-4 rounded-card border p-4 color-neutral surface">
  <div class="typescale-title">{routine.name}</div>
  {#if chartData}
    <LineChart data={chartData}></LineChart>
  {/if}
  <ul
    class="grid"
    use:sortlist={training.id}
    onsortend={(event) => updateSeries(routine, getFromRegistry(event.detail.elements))}>
    {#each routine.series as serie (serie.id)}
      <li
        class="-mx-4 flex h-8 cursor-grab items-center gap-2 truncate px-4 text-left text-sm hover:bg-neutral-hover"
        use:sortitem={training.id}
        data-routine-id={routine.id}
        data-serie-id={serie.id}
        draggable={true}>
        <div
          class="h-6 w-2 flex-none rounded-button border border-black"
          style:background-color={chartData?.find(({ label }) => label === serie.muscle)?.color}>
        </div>
        <div class="truncate">{serie.name}</div>
      </li>
    {/each}
  </ul>
</article>
