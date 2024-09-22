<script lang="ts">
  import Training from './Training.svelte'

  const { data } = $props()
</script>

<Training training={data.training}></Training>
