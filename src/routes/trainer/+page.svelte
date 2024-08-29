<script lang="ts">
  import TrainerRunning from './TrainerRunning.svelte'
  import { TrainerContext } from './TrainerContext.svelte'
  import { goto } from '$app/navigation'
  import TrainerCompleted from './TrainerCompleted.svelte'

  const trainerContext = TrainerContext.getContext()

  $effect(() => {
    if (trainerContext.state.status === 'unset') {
      goto('/trainings')
    }
  })
</script>

{#if trainerContext.state.status === 'running'}
  {@const { training, currentSerieIndex, currentRoutine, currentSerie } = trainerContext.state}
  <TrainerRunning {training} {currentSerieIndex} {currentRoutine} {currentSerie}></TrainerRunning>
{:else if trainerContext.state.status === 'completed'}
  <TrainerCompleted
    training={trainerContext.state.training}
    currentRoutine={trainerContext.state.currentRoutine}></TrainerCompleted>
{/if}
