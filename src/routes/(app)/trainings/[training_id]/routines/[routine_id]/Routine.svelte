<script lang="ts">
  // import { faUndo } from '@fortawesome/free-solid-svg-icons'
  // import Fa from 'svelte-fa'
  // import AppEditTopbar from '$lib/components/app/AppEditTopbar.svelte'
  // import AppMetadata from '$lib/components/app/AppMetadata.svelte'
  // import AppShellSection from '$lib/components/app/AppShellSection.svelte'
  // import AppTopbar from '$lib/components/app/AppTopbar.svelte'
  // import UiButton from '$lib/components/ui/UiButton.svelte'
  import TrainingListItem from '../../TrainingListItem.svelte'
  import { TrainingViewportContext } from '../../TrainingViewportContext.svelte'

  type Props = {
    routineIndex: number
  }

  const { routineIndex }: Props = $props()
  const trainingViewportContext = TrainingViewportContext.get()
  const routine = $derived(trainingViewportContext.training$.routines[routineIndex]!)
</script>

<!-- <AppMetadata title={`Rutina ${routine.name}`}></AppMetadata> -->

<!-- <AppShellSection name="header">
  <AppTopbar
    name="routine-app-topbar"
    previous={`/trainings/${training.id}`}
    title={`Rutina ${routine.name}`}></AppTopbar>
</AppShellSection>

{#if trainingViewportContext.pristine$ === false}
  <AppEditTopbar title={`Editar rutina ${routine.name}`}>
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
{/if} -->

<TrainingListItem {routineIndex} chartData={trainingViewportContext.graphData[routine.id]}
></TrainingListItem>
