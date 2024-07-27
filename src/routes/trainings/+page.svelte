<script lang="ts">
  import { getTrainings } from '$data/trainings'
  import { getAppDatabaseContext } from '$lib/components/app/app-database-context.svelte'
  import TrainingsViewport from '$lib/components/trainings/trainings-viewport.svelte'

  const supabase = getAppDatabaseContext()
  const trainings = getTrainings(supabase)
</script>

{#await trainings then trainings}
  <TrainingsViewport {trainings}></TrainingsViewport>
{/await}
