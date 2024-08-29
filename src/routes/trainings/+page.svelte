<script lang="ts">
  import TrainingsViewport from '$lib/components/trainings/TrainingsViewport.svelte'

  const { data } = $props()
</script>

<TrainingsViewport trainings={data.trainings}></TrainingsViewport>
