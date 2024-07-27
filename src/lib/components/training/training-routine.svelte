<script lang="ts">
  import type { Action } from 'svelte/action'
  import TrainingSerieEditor from '$lib/components/training/training-serie-editor.svelte'
  import Fa from 'svelte-fa'
  import { sortitem, sortlist } from '../../actions/sortable.action'
  import { faEllipsisV, faGripLines } from '@fortawesome/free-solid-svg-icons'
  import UiMenu from '$lib/components/ui/ui-menu.svelte'
  import UiMenuitem from '$lib/components/ui/ui-menuitem.svelte'
  import { tocTarget } from '$lib/actions/toc.action'
  import { TrainingViewportContext } from './training-viewport-context.svelte'
  import UiIconbutton from '../ui/ui-iconbutton.svelte'
  import { getMuscleGroups, type MuscleGroup } from '$data/trainer/config'
  import UiButton from '../ui/ui-button.svelte'
  import { goto } from '$app/navigation'

  type Props = {
    routineId: string
  }

  const { routineId }: Props = $props()
  const muscleGroups = getMuscleGroups()
  const trainingViewportContext = TrainingViewportContext.get()
  let currentSerie$: Types.RoutineSerie | null = $state(null)
  const routine$ = $derived.by(() => {
    return structuredClone(
      trainingViewportContext.training$.routines.find(({ id }) => id === routineId),
    )!
  })
  const groupedSeries$ = $derived.by(() => {
    const groupedSeries: { group: MuscleGroup; series: Types.RoutineSerie[] }[] = []

    for (const serie of routine$.series) {
      let groupedSerie = groupedSeries.at(-1)
      if (!groupedSerie || groupedSerie.group.id !== serie.group) {
        const group = muscleGroups.find(({ id }) => id === serie.group)!
        groupedSerie = { group, series: [] }
        groupedSeries.push(groupedSerie)
      }
      groupedSerie.series.push(serie)
    }

    return groupedSeries
  })

  function getFromRegistry(elements: HTMLElement[]): Types.RoutineSerie[] {
    return elements.map((e) => {
      const routineId = e.dataset.routineId
      if (!routineId) throw new Error(`Attribute data-routine-id is not defined.`)
      const serieId = e.dataset.serieId
      if (!serieId) throw new Error(`Attribute data-serie-id is not defined.`)
      const training = trainingViewportContext.training$
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

  function updateSeries(series: Types.RoutineSerie[]) {
    routine$.series = series
    trainingViewportContext.updateRoutine(routine$)
  }

  function deleteSerie(serieId: string) {
    trainingViewportContext.deleteSerie(routineId, serieId)
  }

  function startRoutine(routineId: string) {
    goto(`/trainer?training=${trainingViewportContext.training$.id}&routine=${routineId}`)
  }
</script>

<div class="rounded-card bg-neutral text-neutral-fg" id={`routine-${routine$.id}`} use:tocTarget>
  <div class="sticky top-0 flex rounded-card bg-neutral px-8 py-4">
    <div class="grow">{routine$.name}</div>
    <UiButton onclick={() => startRoutine(routine$.id)}>Start</UiButton>
  </div>
  <ul
    use:sortlist={trainingViewportContext.training$.id}
    onsortend={(event) => updateSeries(getFromRegistry(event.detail.elements))}>
    {#each groupedSeries$ as groupedSerie}
      <div class="px-8 py-2 text-sm font-bold">{groupedSerie.group.name}</div>
      <hr class="border-neutral-border" />

      {#each groupedSerie.series as serie (serie.id)}
        <li
          class="focusable-within group flex h-16 items-center gap-4 px-4 hover:bg-neutral-hover"
          use:sortitem={trainingViewportContext.training$.id}
          data-routine-id={routine$.id}
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
            class="flex h-full w-full grow items-center gap-2 text-left outline-none"
            type="button"
            onclick={() => (currentSerie$ = serie)}>
            <div class="grow">{serie.name}</div>
            <div class="text-sm">{getStepsDescription(serie)}</div>
          </button>
          <UiIconbutton class="shrink-0" id={`serie-${serie.id}-actions`} label="More actions">
            <Fa icon={faEllipsisV}></Fa>
          </UiIconbutton>
        </li>
        <UiMenu target={`serie-${serie.id}-actions`}>
          <UiMenuitem onclick={() => deleteSerie(serie.id)}>Eliminar</UiMenuitem>
        </UiMenu>
        <TrainingSerieEditor
          routineId={routine$.id}
          serieId={serie.id}
          open={serie.id === currentSerie$?.id}
          onclose={() => (currentSerie$ = null)}></TrainingSerieEditor>
      {/each}
      <hr class="border-neutral-border" />
    {:else}
      <li class="grid place-content-center h-16 px-4 opacity-50">Empty list</li>
    {/each}
  </ul>
  <div class="p-4">
    <UiButton>Add Serie</UiButton>
  </div>
</div>
