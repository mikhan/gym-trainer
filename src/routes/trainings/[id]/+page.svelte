<script lang="ts">
  import TrainingViewport from '$lib/components/training/training-viewport.svelte'

  const { data } = $props()
</script>

<TrainingViewport training={data.training}></TrainingViewport>
