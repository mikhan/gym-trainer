<script lang="ts">
  type Props = { title: string }

  let { title }: Props = $props()
</script>

<svelte:head>
  <title>{title} • Gym Trainer</title>
</svelte:head>
