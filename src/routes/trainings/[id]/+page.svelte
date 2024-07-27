<script lang="ts">
  import TrainingViewport from '$lib/components/training/training-viewport.svelte'
  import { getTraining } from '$data/trainings'
  import { getAppDatabaseContext } from '$lib/components/app/app-database-context.svelte'

  const { data } = $props()
  const supabase = getAppDatabaseContext()
  const x = getTraining(supabase, data.trainingId)
  const training = $derived(x)
  x.catch(console.log)
</script>

{#await training then training}
  <TrainingViewport {training}></TrainingViewport>
{/await}
