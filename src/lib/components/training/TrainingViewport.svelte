<script lang="ts">
  import TrainingRoutineList from './TrainingRoutineList.svelte'
  import TrainingRoutineGrid from './TrainingRoutineGrid.svelte'
  import AppTopbar from '$lib/components/app/AppTopbar.svelte'
  import UiButton from '../ui/ui-button.svelte'
  import UiIconbutton from '../ui/ui-iconbutton.svelte'
  import Fa from 'svelte-fa'
  import { TrainingViewportContext } from './TrainingViewportContext.svelte'
  import { faList, faTableCells } from '@fortawesome/free-solid-svg-icons'
  import { LocalStorageState } from '$lib/states/persisted-state.svelte'
  import { startViewTransition } from '$lib/actions/transition.action'
  import AppEditTopbar from '../app/AppEditTopbar.svelte'
  import AppMetadata from '../app/AppMetadata.svelte'

  type Props = {
    training: Types.Training
  }
  type LayoutType = 'grid' | 'list'

  const { training }: Props = $props()
  const trainingViewportContext = TrainingViewportContext.create({ training })
  const layout = new LocalStorageState<LayoutType>('layout', 'grid')
  const layoutTypeIcons = { list: faList, grid: faTableCells }

  function toggleLayout() {
    startViewTransition({
      update: () => (layout.value = layout.value === 'list' ? 'grid' : 'list'),
      types: ['navigation'],
    })
  }
</script>

<AppMetadata title={`Entrenamiento ${trainingViewportContext.training$.name}`}></AppMetadata>

<AppTopbar previous="/trainings" title={trainingViewportContext.training$.name}>
  {#snippet actions()}
    <UiIconbutton label="Layout" onclick={toggleLayout}>
      <Fa icon={layoutTypeIcons[layout.value]}></Fa>
    </UiIconbutton>
  {/snippet}
</AppTopbar>

{#if trainingViewportContext.pristine$ === false}
  <AppEditTopbar title={`Editar entrenamiento ${trainingViewportContext.training$.name}`}>
    <UiButton
      onclick={() => trainingViewportContext.reset()}
      disabled={trainingViewportContext.saving$}>Reset</UiButton>
    <UiButton
      class="color-primary"
      onclick={() => trainingViewportContext.save()}
      disabled={trainingViewportContext.saving$}>Save</UiButton>
  </AppEditTopbar>
{/if}

<!-- <div class="mx-auto max-w-screen-xl"> -->
{#if layout.value === 'list'}
  <TrainingRoutineList
    training={trainingViewportContext.training$}
    chartData={trainingViewportContext.graphData}></TrainingRoutineList>
{:else}
  <TrainingRoutineGrid
    training={trainingViewportContext.training$}
    chartData={trainingViewportContext.graphData}></TrainingRoutineGrid>
{/if}
<!-- </div> -->
