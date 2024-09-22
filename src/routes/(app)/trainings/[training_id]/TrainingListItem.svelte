<script lang="ts">
  import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
  import { faEllipsisV, faGripLines, faPlay } from '@fortawesome/free-solid-svg-icons'
  import { getMuscleGroups, type MuscleGroup } from '$data/trainer/config'
  import { onMount } from 'svelte'
  import Fa from 'svelte-fa'
  import { goto } from '$app/navigation'
  import { sortitem, sortlist } from '$lib/actions/sortable.action'
  import { tocTarget } from '$lib/actions/toc.action'
  import UiButton from '$lib/components/ui/UiButton.svelte'
  import UiIconbutton from '$lib/components/ui/UiIconbutton.svelte'
  import UiMenu from '$lib/components/ui/UiMenu.svelte'
  import UiMenuitem from '$lib/components/ui/UiMenuitem.svelte'
  import { TrainerContext } from '../../trainer/TrainerContext.svelte'
  import LineChart, { type ChartData } from './LineChart.svelte'
  import TrainingSerieEditor from './TrainingSerieEditor.svelte'
  import { TrainingViewportContext } from './TrainingViewportContext.svelte'

  type Props = {
    training: Types.Training
    routineIndex: number
    chartData?: ChartData[]
  }

  let { training, routineIndex, chartData }: Props = $props()

  const muscleGroups = getMuscleGroups()
  const trainingViewportContext = TrainingViewportContext.get()
  let currentSerie$: Types.RoutineSerie | null = $state(null)
  let newSerie$: Types.RoutineSerie | undefined = $state.raw()
  const routine = $derived(training.routines[routineIndex]!)
  const groupedSeries$ = $derived.by(() => groupByMuscle(routine.series))
  const trainerContext = TrainerContext.getContext()
  let container = $state() as HTMLElement

  onMount(() => {
    // container.scrollIntoView()
  })

  function groupByMuscle(series: Types.RoutineSerie[]) {
    const groupedSeries: { group: MuscleGroup; series: Types.RoutineSerie[] }[] = []

    for (const serie of series) {
      let groupedSerie = groupedSeries.at(-1)
      if (!groupedSerie || groupedSerie.group.id !== serie.muscle) {
        const group = muscleGroups.find(({ id }) => id === serie.muscle)!
        groupedSerie = { group, series: [] }
        groupedSeries.push(groupedSerie)
      }
      groupedSerie.series.push(serie)
    }

    return groupedSeries
  }

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

  function getStepsDescription(serie: Types.RoutineSerie): string {
    const values = serie.steps.map(({ value }) => value)
    const sameValue = values.every((value) => values[0] === value)

    return sameValue ? `${serie.steps.length} x ${values[0]} reps` : `${values.join(', ')} reps`
  }

  function addSerie() {
    newSerie$ = {
      id: crypto.randomUUID(),
      name: '',
      group: '',
      muscle: '',
      notes: '',
      steps: [{ type: 'repetitions', value: '8', delay: 60, weight: { unit: 'kg', value: 0 } }],
    }
  }

  function deleteRutine(routineId: string) {
    trainingViewportContext.deleteRoutine(routineId)
  }

  function updateSerie(serie: Types.RoutineSerie) {
    trainingViewportContext.updateSerie(routine.id, serie)
  }

  function updateSeries(series: Types.RoutineSerie[]) {
    trainingViewportContext.updateRoutine({ ...routine, series })
  }

  function deleteSerie(serieId: string) {
    trainingViewportContext.deleteSerie(routine.id, serieId)
  }

  function startRoutine(routineId: string) {
    const routineIndex = training.routines.findIndex((routine) => routine.id === routineId)
    trainerContext.startTraining(training, routineIndex)
    goto(`/trainer`)
  }
</script>

{#if newSerie$}
  <TrainingSerieEditor
    serie={newSerie$}
    open={newSerie$ !== undefined}
    onclose={() => (newSerie$ = undefined)}></TrainingSerieEditor>
{/if}

<div class="@container" bind:this={container}>
  <article
    class="grid max-w-screen-lg scroll-mt-layout-gap items-center gap-y-4 rounded-card shadow contain-paint color-neutral surface
    @xl:grid-flow-col @xl:grid-cols-[4fr,8fr] @xl:grid-rows-[auto,1fr] @xl:items-stretch"
    use:tocTarget
    id={`routine-${routine.id}`}>
    <header
      class="sticky top-layout-viewport-top z-1 flex items-center gap-2 border-default-line bg-inherit p-4 @xl:border-b">
      <div class="typescale-title grow">{routine.name}</div>
      <UiIconbutton label="Iniciar entrenamiento" onclick={() => startRoutine(routine.id)}>
        <Fa icon={faPlay}></Fa></UiIconbutton>
      <UiIconbutton label="Más acciones" id={`routine-${routine.id}-actions`}>
        <Fa icon={faEllipsisV}></Fa></UiIconbutton>
      <UiMenu target={`routine-${routine.id}-actions`}>
        <UiMenuitem onclick={() => deleteRutine(routine.id)}>
          {#snippet icon()}
            <Fa icon={faTrashAlt}></Fa>
          {/snippet}
          Eliminar rutina
        </UiMenuitem>
      </UiMenu>
    </header>
    <div class="px-4 last:pb-4 @xl:last:pb-0">
      {#if chartData}
        <LineChart data={chartData}></LineChart>
      {/if}
    </div>
    <div
      class="row-span-2 grid grid-rows-subgrid border-default-line @xl:row-start-1 @xl:-row-end-1 @xl:border-l">
      <div class="m-auto px-4 @xl:mr-0">
        <UiButton class="color-primary" filled onclick={() => addSerie()}
          >Agregar ejercicio</UiButton>
      </div>
      <ul
        use:sortlist={training.id}
        onsortend={(event) => updateSeries(getFromRegistry(event.detail.elements))}>
        {#each groupedSeries$ as groupedSerie}
          <li role="presentation" class="px-8 py-4 text-sm font-bold">{groupedSerie.group.name}</li>

          {#each groupedSerie.series as serie (serie.id)}
            <li
              class="flex h-16 items-center gap-4 px-4 contain-strict"
              use:sortitem={training.id}
              data-routine-id={routine.id}
              data-serie-id={serie.id}>
              <!-- Handle -->
              <button
                class="grid size-4 flex-none cursor-grab place-content-center pointer-coarse:hidden"
                type="button"
                draggable={true}
                tabindex="-1"
                title="Drag to sort"
                aria-label="Drag to sort">
                <Fa icon={faGripLines}></Fa>
              </button>
              <!-- Item -->
              <button
                class="group flex-1 text-left outline-none contain-inline-size"
                type="button"
                onclick={() => (currentSerie$ = serie)}>
                <div class="flex-1">
                  <div class="truncate">{serie.name}</div>
                  <div class="typescale-label truncate">{getStepsDescription(serie)}</div>
                </div>
                <div
                  class="absolute inset-0 -z-1 ring-inset ring-ring transition-colors group-hover:bg-default-hover group-focus-visible:ring-2 group-active:bg-default-active">
                </div>
              </button>
              <!-- Actions -->
              <UiIconbutton class="flex-none" id={`serie-${serie.id}-actions`} label="More actions">
                <Fa icon={faEllipsisV}></Fa>
              </UiIconbutton>
            </li>
            <UiMenu target={`serie-${serie.id}-actions`}>
              <UiMenuitem onclick={() => deleteSerie(serie.id)}>
                {#snippet icon()}
                  <Fa icon={faTrashAlt}></Fa>
                {/snippet}
                Eliminar Serie</UiMenuitem>
            </UiMenu>
            <TrainingSerieEditor
              {serie}
              open={serie.id === currentSerie$?.id}
              onclose={(serie) => {
                if (serie) updateSerie(serie)
                currentSerie$ = null
              }}></TrainingSerieEditor>
          {/each}
        {:else}
          <div class="grid place-content-center h-16 px-4 opacity-50">Empty list</div>
        {/each}
      </ul>
    </div>
  </article>
</div>
