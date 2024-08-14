<script lang="ts">
  import { TrainingViewportContext } from './training-viewport-context.svelte.ts'
  import { sortitem, sortlist } from '$lib/actions/sortable.action'
  type Props = {
    training: Types.Training
  }

  const { training }: Props = $props()
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

<div
  class="container mx-auto grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] items-start gap-layout-gap p-layout-gap">
  {#each training.routines as routine (routine.id)}
    <div
      class="grid rounded-card bg-neutral p-4 text-neutral-fg"
      use:sortlist={training.id}
      onsortend={(event) => updateSeries(routine, getFromRegistry(event.detail.elements))}>
      <div class="mb-2">{routine.name}</div>
      {#each routine.series as serie (serie.id)}
        <button
          class="-mx-4 h-8 truncate px-4 text-left text-sm hover:bg-neutral-hover"
          use:sortitem={trainingViewportContext.training$.id}
          data-routine-id={routine.id}
          data-serie-id={serie.id}
          draggable={true}>{serie.name}</button>
      {/each}
    </div>
  {/each}
</div>
