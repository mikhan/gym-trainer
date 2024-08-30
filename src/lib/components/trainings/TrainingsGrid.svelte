<script lang="ts">
  import TrainingsGridItem from './TrainingsGridItem.svelte'

  type Props = {
    trainings: Types.Training[]
  }
  const { trainings }: Props = $props()
</script>

<ul class="grid gap-layout-gap grid-cols-fill-64">
  {#each trainings as training}
    <TrainingsGridItem {training}></TrainingsGridItem>
  {/each}
</ul>
