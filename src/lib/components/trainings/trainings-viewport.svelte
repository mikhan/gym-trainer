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

<div class="size-full overflow-y-auto">
  <div class="grid gap-layout-gap p-layout-gap grid-cols-fill-60">
    {#each trainings as training}
      <a
        class="active:bg-neutral-active block rounded-card bg-neutral p-4 text-neutral-fg shadow transition-colors hover:bg-neutral-hover"
        href={`/trainings/${training.id}`}>
        <div class="text-2xl">{training.name}</div>
      </a>
    {/each}
  </div>
</div>
