<script lang="ts">
  import TrainingsViewport from './TrainingsViewport.svelte'

  const { data } = $props()
</script>

<TrainingsViewport trainings={data.trainings}></TrainingsViewport>
