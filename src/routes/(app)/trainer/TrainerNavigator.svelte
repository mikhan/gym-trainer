<script lang="ts">
  import clsx from 'clsx'
  import { type TrainerContextStateRunning } from './TrainerContext.svelte'

  type Props = {
    data: TrainerContextStateRunning
    onselect?: (serieIndex: number) => void
  }

  const { data, onselect = () => {} }: Props = $props()
  const groupedData = $derived(Object.groupBy(data.currentRoutine.series, (serie) => serie.group))
</script>

<section class="flex flex-wrap items-center gap-2">
  {#each Object.entries(groupedData) as [group, series = []] (group)}
    <div class="w-full typescale-label font-bold uppercase">{group}</div>
    {#each series as serie}
      {@const percent = `${((data.progress[serie.id] ?? 0) * 100).toFixed(0)}%`}
      <button
        class={clsx(
          'group stack relative min-w-min rounded-button text-left',
          data.currentSerie.id === serie.id && 'ring-4 ring-secondary-line',
        )}
        type="button"
        onclick={() => onselect(data.currentRoutine.series.indexOf(serie))}>
        <div
          class="line-clamp-1 px-2 py-1 color-neutral bg-default group-hover:bg-default-hover group-active:bg-default-active transition-all rounded-button shadow">
          {serie.name}
        </div>
        <div
          class="line-clamp-1 px-2 py-1 color-secondary bg-default group-hover:bg-default-hover group-active:bg-default-active transition-all rounded-button shadow"
          style="clip-path: rect(auto var(--clip-width) auto auto)"
          style:--clip-width={percent}>
          {serie.name}
        </div>
        <div class="absolute -inset-2"></div>
      </button>
    {/each}
  {/each}
</section>
