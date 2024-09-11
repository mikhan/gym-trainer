<script lang="ts">
  import TrainingRoutineList from './TrainingRoutineList.svelte'
  import TrainingRoutineGrid from './TrainingRoutineGrid.svelte'
  import AppTopbar from '$lib/components/app/AppTopbar.svelte'
  import UiButton from '$lib/components/ui/ui-button.svelte'
  import UiIconbutton from '$lib/components/ui/ui-iconbutton.svelte'
  import Fa from 'svelte-fa'
  import { TrainingViewportContext } from './TrainingViewportContext.svelte'
  import { faList, faTableCells } from '@fortawesome/free-solid-svg-icons'
  import { getPersistedState } from '$lib/states/persisted-state.svelte'
  import { startViewTransition } from '$lib/actions/transition.action'
  import AppEditTopbar from '$lib/components/app/AppEditTopbar.svelte'
  import AppMetadata from '$lib/components/app/AppMetadata.svelte'
  import AppShellSection from '$lib/components/app/AppShellSection.svelte'

  type Props = {
    training: Types.Training
  }
  type LayoutType = 'grid' | 'list'

  const { training }: Props = $props()
  const trainingViewportContext = TrainingViewportContext.create({ training })
  const layoutTypeIcons = { list: faList, grid: faTableCells }
  const localState = getPersistedState('local', 'TrainingViewport.state', {
    layout: 'grid' as LayoutType,
  })

  function toggleLayout() {
    startViewTransition({
      update: () => (localState.layout = localState.layout === 'list' ? 'grid' : 'list'),
    })
  }
</script>

<AppMetadata title={`Entrenamiento ${trainingViewportContext.training$.name}`}></AppMetadata>

<AppShellSection name="header">
  <AppTopbar previous="/" title={trainingViewportContext.training$.name}>
    {#snippet actions()}
      <UiIconbutton label="Layout" onclick={toggleLayout}>
        <Fa icon={layoutTypeIcons[localState.layout]}></Fa>
      </UiIconbutton>
    {/snippet}
  </AppTopbar>
</AppShellSection>

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

{#if localState.layout === 'list'}
  <TrainingRoutineList
    training={trainingViewportContext.training$}
    chartData={trainingViewportContext.graphData}></TrainingRoutineList>
{:else}
  <TrainingRoutineGrid
    training={trainingViewportContext.training$}
    chartData={trainingViewportContext.graphData}></TrainingRoutineGrid>
{/if}
