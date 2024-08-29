<script lang="ts">
  import TrainingViewport from '$lib/components/training/TrainingViewport.svelte'

  const { data } = $props()
</script>

<TrainingViewport training={data.training}></TrainingViewport>
