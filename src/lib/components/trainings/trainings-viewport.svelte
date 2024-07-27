<script lang="ts">
  import AppTopbar from '$lib/components/app/app-topbar.svelte'

  type Props = {
    trainings: Types.Training[]
  }
  const { trainings }: Props = $props()
</script>

<AppTopbar>
  <div class="text-2xl">Trainings</div>
</AppTopbar>

<div class="overflow-y-auto p-layout-gap">
  {#each trainings as training}
    <a href={`/trainings/${training.id}`}>{training.name}</a>
  {/each}
</div>
