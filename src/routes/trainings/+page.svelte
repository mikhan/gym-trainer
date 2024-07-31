<script lang="ts">
  import TrainingsViewport from '$lib/components/trainings/trainings-viewport.svelte'

  const { data } = $props()
</script>

<TrainingsViewport trainings={data.trainings}></TrainingsViewport>
