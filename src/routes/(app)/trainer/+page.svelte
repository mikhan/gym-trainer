<script lang="ts">
  import { goto } from '$app/navigation'
  import Result from './Result.svelte'
  import Trainer from './Trainer.svelte'
  import { TrainerContext } from './TrainerContext.svelte'

  const trainerContext = TrainerContext.getContext()

  $effect(() => {
    if (trainerContext.state.status === 'unset') {
      goto('/trainings')
    }
  })
</script>

{#if trainerContext.state.status === 'running'}
  <Trainer data={trainerContext.state}></Trainer>
{:else if trainerContext.state.status === 'completed'}
  <Result state={trainerContext.state}></Result>
{/if}
