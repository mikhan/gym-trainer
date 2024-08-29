<script lang="ts">
  import TrainingSerieEditor from '$lib/components/training/TrainingSerieEditor.svelte'
  import Fa from 'svelte-fa'
  import { sortitem, sortlist } from '$lib/actions/sortable.action'
  import { faEllipsisV, faGripLines, faPlay, faPlus } from '@fortawesome/free-solid-svg-icons'
  import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
  import UiMenu from '$lib/components/ui/ui-menu.svelte'
  import UiMenuitem from '$lib/components/ui/ui-menuitem.svelte'
  import { tocTarget } from '$lib/actions/toc.action'
  import { TrainingViewportContext } from './TrainingViewportContext.svelte'
  import UiIconbutton from '$lib/components/ui/ui-iconbutton.svelte'
  import { getMuscleGroups, type MuscleGroup } from '$data/trainer/config'
  import { goto } from '$app/navigation'
  import { TrainerContext } from '../../../routes/trainer/TrainerContext.svelte'
  import LineChart, { type ChartData } from './LineChart.svelte'

  type Props = {
    training: Types.Training
    routine: Types.Routine
    chartData?: ChartData[]
  }

  let { training, routine, chartData }: Props = $props()
  const muscleGroups = getMuscleGroups()
  const trainingViewportContext = TrainingViewportContext.get()
  let currentSerie$: Types.RoutineSerie | null = $state(null)
  let newSerie$: Types.RoutineSerie | undefined = $state.raw()
  const groupedSeries$ = $derived.by(() => groupByMuscle(routine.series))
  const trainerContext = TrainerContext.getContext()

  function groupByMuscle(series: Types.RoutineSerie[]) {
    const groupedSeries: { group: MuscleGroup; series: Types.RoutineSerie[] }[] = []

    for (const serie of series) {
      let groupedSerie = groupedSeries.at(-1)
      if (!groupedSerie || groupedSerie.group.id !== serie.group) {
        const group = muscleGroups.find(({ id }) => id === serie.group)!
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
    console.log(newSerie$)
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
    trainerContext.startTraining($state.snapshot(training), routineIndex)
    goto(`/trainer`)
  }
</script>

{#if newSerie$}
  <TrainingSerieEditor
    serie={newSerie$}
    open={newSerie$ !== undefined}
    onclose={() => (newSerie$ = undefined)}></TrainingSerieEditor>
{/if}

<article
  class="grid scroll-mt-layout-gap rounded-card border contain-paint color-neutral surface xl:grid-cols-[4fr,8fr] xl:grid-rows-[auto,1fr]"
  id={`routine-${routine.id}`}
  use:tocTarget>
  <header
    class="top-layout-viewport-top sticky z-1 border-default-line bg-inherit p-4 ps-8 xl:border-r">
    <div class="flex items-center gap-2">
      <div class="typescale-title grow">{routine.name}</div>
      <UiIconbutton label="Iniciar entrenamiento" onclick={() => startRoutine(routine.id)}>
        <Fa icon={faPlay}></Fa></UiIconbutton>
      <UiIconbutton label="Agregar serie" onclick={() => addSerie()}>
        <Fa icon={faPlus}></Fa></UiIconbutton>
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
    </div>
  </header>
  <div class="col-start-1 row-start-2 space-y-4 border-default-line p-4 xl:border-r">
    <p>
      Duis deserunt dolore qui nisi ullamco eu aliqua amet occaecat non commodo pariatur mollit.
      Eiusmod cillum esse amet sunt officia incididunt adipisicing exercitation voluptate in ex non
      aliquip. Laborum reprehenderit eiusmod sint elit esse ipsum dolore ipsum veniam. Exercitation
      aliquip irure eiusmod ipsum magna ad reprehenderit sint culpa occaecat. Magna mollit do in
      aliqua nostrud dolore id sunt non voluptate esse sint nulla.
    </p>
    {#if chartData}
      <LineChart data={chartData}></LineChart>
    {/if}
  </div>
  <ul
    class="row-span-2"
    use:sortlist={training.id}
    onsortend={(event) => updateSeries(getFromRegistry(event.detail.elements))}>
    {#each groupedSeries$ as groupedSerie}
      <div class="px-8 py-4 text-sm font-bold">{groupedSerie.group.name}</div>

      {#each groupedSerie.series as serie (serie.id)}
        <li
          class="relative grid h-16 grid-cols-[auto,1fr,auto] items-center gap-4 px-4 transition-colors hover:bg-default-hover"
          use:sortitem={training.id}
          data-routine-id={routine.id}
          data-serie-id={serie.id}>
          <button
            class="grid h-full w-4 shrink-0 cursor-grab place-content-center"
            type="button"
            draggable={true}
            tabindex="-1"
            title="Drag to sort"
            aria-label="Drag to sort">
            <Fa icon={faGripLines}></Fa>
          </button>
          <button
            class="group flex h-full w-full items-center gap-2 overflow-hidden text-left outline-none"
            type="button"
            onclick={() => (currentSerie$ = serie)}>
            <div class="flex-1 overflow-hidden">
              <div class="truncate">{serie.name}</div>
              <div class="typescale-label truncate">{getStepsDescription(serie)}</div>
            </div>
            <div
              class="absolute inset-0 -z-1 group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:-outline-offset-2 group-focus-visible:outline-ring">
            </div>
          </button>
          <UiIconbutton class="shrink-0" id={`serie-${serie.id}-actions`} label="More actions">
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
</article>
