<script lang="ts">
  import { faList, faTableCells, faUndo } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa'
  import { startViewTransition } from '$lib/actions/transition.action'
  import AppEditTopbar from '$lib/components/app/AppEditTopbar.svelte'
  import AppMetadata from '$lib/components/app/AppMetadata.svelte'
  import AppShellSection from '$lib/components/app/AppShellSection.svelte'
  import AppTopbar from '$lib/components/app/AppTopbar.svelte'
  import UiButton from '$lib/components/ui/UiButton.svelte'
  import UiIconbutton from '$lib/components/ui/UiIconbutton.svelte'
  import { getPersistedState } from '$lib/states/persisted-state.svelte'
  import TrainingRoutineGrid from './TrainingRoutineGrid.svelte'
  import TrainingRoutineList from './TrainingRoutineList.svelte'
  import { TrainingViewportContext } from './TrainingViewportContext.svelte'

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
  <AppTopbar previous="/" title={`Entrenamiento ${trainingViewportContext.training$.name}`}>
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
      outlined
      onclick={() => trainingViewportContext.reset()}
      disabled={trainingViewportContext.saving$}>
      <Fa icon={faUndo}></Fa>
      <span>Deshacer</span>
    </UiButton>
    <UiButton
      filled
      outlined
      class="color-primary"
      onclick={() => trainingViewportContext.save()}
      disabled={trainingViewportContext.saving$}>Guardar</UiButton>
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
