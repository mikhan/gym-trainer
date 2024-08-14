<script lang="ts">
  import TrainerViewport from './TrainerViewport.svelte'
  import { page } from '$app/stores'

  const { data } = $props()
  const training = $derived(data.training)
  const routineId = $derived($page.url.searchParams.get('routine'))
  const routine = $derived(
    (routineId && training.routines.find((routine) => routine.id === routineId)) || null,
  )
</script>

{#if routine}
  <TrainerViewport {training} {routine}></TrainerViewport>
{/if}
