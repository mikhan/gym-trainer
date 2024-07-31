<script lang="ts">
  import AppTopbar from '$lib/components/app/app-topbar.svelte'
  import TrainingHeader from './training-header.svelte'
  import TrainingNavigation from '$lib/components/training/training-navigation.svelte'
  import { TrainingViewportContext } from './training-viewport-context.svelte'
  import UiButton from '../ui/ui-button.svelte'
  import AppActions from '../app/app-actions.svelte'
  import TrainingRoutine from './training-routine.svelte'
  import UiIconbutton from '../ui/ui-iconbutton.svelte'
  import Fa from 'svelte-fa'
  import { faList, faTableCells } from '@fortawesome/free-solid-svg-icons'

  type Props = {
    training: Types.Training
  }

  const { training }: Props = $props()
  const trainingViewportContext = TrainingViewportContext.create({ training })
  let layout = $state('list')
</script>

<AppTopbar previous="/trainings">
  <div class="flex items-center">
    <div class="grow text-2xl">{trainingViewportContext.training$.name}</div>
  </div>
</AppTopbar>

<AppActions>
  {#if trainingViewportContext.pristine$ === false}
    <UiButton
      onclick={() => trainingViewportContext.reset()}
      disabled={trainingViewportContext.saving$}>Reset</UiButton>
    <UiButton
      onclick={() => trainingViewportContext.save()}
      disabled={trainingViewportContext.saving$}>Save</UiButton>
  {/if}
  <UiIconbutton
    label="Layout"
    onclick={() =>
      document.startViewTransition(async () => {
        layout = layout === 'list' ? 'grid' : 'list'
      })}>
    <Fa icon={layout === 'list' ? faTableCells : faList}></Fa>
  </UiIconbutton>
</AppActions>

<div
  class="scrollbar size-full scroll-py-layout-gap overflow-auto @container-[size] scrollbar-stable">
  {#if layout === 'list'}
    <div
      class="container mx-auto grid grid-cols-1 gap-layout-gap px-layout-gap lg:grid-cols-[minmax(min-content,30ch),1fr]">
      <TrainingNavigation training={trainingViewportContext.training$}></TrainingNavigation>
      <article class="container flex h-full flex-col gap-layout-gap py-10">
        <TrainingHeader {training}></TrainingHeader>

        <h2 class="text-xl font-bold tracking-tight">Rutinas</h2>
        {#each training.routines as routine (routine.id)}
          <TrainingRoutine routineId={routine.id}></TrainingRoutine>
        {/each}
      </article>
    </div>
  {:else}
    {#each training.routines as routine}
      <div>{routine.name}</div>
    {/each}
  {/if}
</div>
