<script lang="ts">
  import TrainingViewport from './TrainingViewport.svelte'

  const { data } = $props()
</script>

<TrainingViewport training={data.training}></TrainingViewport>
