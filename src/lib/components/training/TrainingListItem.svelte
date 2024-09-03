<script lang="ts">
  import TrainingSerieEditor from '$lib/components/training/TrainingSerieEditor.svelte'
  import Fa from 'svelte-fa'
  import { sortitem, sortlist } from '$lib/actions/sortable.action'
  import {
    faChevronDown,
    faChevronUp,
    faEllipsisV,
    faGripLines,
    faPlay,
  } from '@fortawesome/free-solid-svg-icons'
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
  import UiCollapsibleText from '../ui/UiCollapsibleText.svelte'
  import clsx from 'clsx'
  import UiButton from '../ui/ui-button.svelte'

  type Props = {
    training: Types.Training
    routineIndex: number
    expanded?: boolean
    chartData?: ChartData[]
  }

  let { training, routineIndex, expanded = $bindable(), chartData }: Props = $props()

  const muscleGroups = getMuscleGroups()
  const trainingViewportContext = TrainingViewportContext.get()
  let currentSerie$: Types.RoutineSerie | null = $state(null)
  let newSerie$: Types.RoutineSerie | undefined = $state.raw()
  const routine = $derived(training.routines[routineIndex]!)
  const groupedSeries$ = $derived.by(() => groupByMuscle(routine.series))
  const trainerContext = TrainerContext.getContext()
  // $inspect(routine)
  // $inspect(groupedSeries$)

  function groupByMuscle(series: Types.RoutineSerie[]) {
    console.groupCollapsed()
    console.log(series)
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

    console.log(groupedSeries)
    console.groupEnd()
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

<article
  class={clsx(
    'grid scroll-mt-layout-gap items-center rounded-card border contain-paint color-neutral surface xl:grid-cols-[4fr,8fr]',
    expanded && 'xl:grid-flow-col xl:grid-rows-[auto,auto,1fr] xl:items-stretch',
  )}
  use:tocTarget
  id={`routine-${routine.id}`}>
  <header class={clsx('sticky top-layout-viewport-top z-1 bg-inherit p-4 ps-8')}>
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="-m-2 flex grow items-center gap-2 rounded-button p-2 text-left focusable-ring"
        onclick={() => (expanded = !expanded)}>
        <Fa icon={expanded ? faChevronUp : faChevronDown}></Fa>
        <span class="typescale-title">{routine.name}</span>
      </button>
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
    </div>
  </header>
  <div class="px-4 max-lg:last:pb-4">
    {#if chartData}
      <LineChart data={chartData}></LineChart>
    {/if}
  </div>
  {#if expanded}
    <div class={clsx('space-y-2 p-4', !expanded && 'hidden')}>
      <!-- {#if routine.description} -->
      <p>
        <UiCollapsibleText maxLines={2}
          >{'Laborum excepteur dolore do proident ullamco excepteur adipisicing dolor anim culpa eu nostrud deserunt. Aliquip nostrud ullamco eu ex et mollit occaecat commodo quis qui ea tempor adipisicing occaecat. Do anim nulla anim amet Lorem occaecat minim sit. Sit esse est amet amet pariatur aliqua nostrud aliquip eiusmod labore adipisicing. Labore ea elit Lorem consequat do aliquip occaecat sit. Incididunt Lorem excepteur qui minim culpa ullamco quis nostrud ut.'}</UiCollapsibleText>
      </p>
      <!-- {/if} -->
    </div>
    <div
      class={clsx(
        'border-default-line xl:row-span-3',
        expanded && 'xl:border-l',
        !expanded && 'hidden',
      )}>
      <div class="p-4">
        <UiButton class="color-neutral-lighter max-md:mx-auto" onclick={() => addSerie()}
          >Agregar serie</UiButton>
      </div>
      <ul
        use:sortlist={training.id}
        onsortend={(event) => updateSeries(getFromRegistry(event.detail.elements))}>
        {#each groupedSeries$ as groupedSerie}
          <li role="presentation" class="px-8 py-4 text-sm font-bold">{groupedSerie.group.name}</li>

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
    </div>
  {/if}
</article>
