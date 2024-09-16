<script lang="ts">
  import { goto } from '$app/navigation'
  import { TrainerContext } from './TrainerContext.svelte'
  import Trainer from './Trainer.svelte'
  import Result from './Result.svelte'

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
