<script lang="ts">
  import TrainingRoutineList from './TrainingRoutineList.svelte'
  import TrainingRoutineGrid from './TrainingRoutineGrid.svelte'
  import AppTopbar from '$lib/components/app/app-topbar.svelte'
  import { TrainingViewportContext } from './training-viewport-context.svelte'
  import UiButton from '../ui/ui-button.svelte'
  import UiIconbutton from '../ui/ui-iconbutton.svelte'
  import Fa from 'svelte-fa'
  import { faList, faTableCells } from '@fortawesome/free-solid-svg-icons'
  import { PersistedState } from '$lib/states/persisted-state.svelte'

  type Props = {
    training: Types.Training
  }
  type LayoutType = 'grid' | 'list'

  const { training }: Props = $props()
  const trainingViewportContext = TrainingViewportContext.create({ training })
  const layout = new PersistedState<LayoutType>('layout', 'grid')
  const layoutTypeIcons = { list: faList, grid: faTableCells }

  const transition = (callback: () => Promise<void> | void) => () =>
    document.startViewTransition(callback)

  function toggleLayout() {
    layout.value = layout.value === 'list' ? 'grid' : 'list'
  }
</script>

<AppTopbar previous="/trainings">
  <div class="flex items-center">
    <div class="grow text-2xl">{trainingViewportContext.training$.name}</div>
  </div>

  {#snippet actions()}
    {#if trainingViewportContext.pristine$ === false}
      <UiButton
        onclick={() => trainingViewportContext.reset()}
        disabled={trainingViewportContext.saving$}>Reset</UiButton>
      <UiButton
        onclick={() => trainingViewportContext.save()}
        disabled={trainingViewportContext.saving$}>Save</UiButton>
    {/if}
    <UiIconbutton label="Layout" onclick={transition(toggleLayout)}>
      <Fa icon={layoutTypeIcons[layout.value]}></Fa>
    </UiIconbutton>
  {/snippet}
</AppTopbar>

<div
  class="size-full scroll-py-layout-gap overflow-auto @container-[size] scrollbar scrollbar-stable">
  {#if layout.value === 'list'}
    <TrainingRoutineList training={trainingViewportContext.training$}></TrainingRoutineList>
  {:else}
    <TrainingRoutineGrid training={trainingViewportContext.training$}></TrainingRoutineGrid>
  {/if}
</div>
