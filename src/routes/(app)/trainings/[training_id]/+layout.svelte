<script lang="ts">
  import Training from './Training.svelte'

  const { data, children } = $props()
</script>

<Training training={data.training}>{@render children()}</Training>
