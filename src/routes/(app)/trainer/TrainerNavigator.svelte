<script lang="ts">
  import clsx from 'clsx'
  import { type TrainerContextStateRunning } from './TrainerContext.svelte'

  type Props = {
    data: TrainerContextStateRunning
    onselect?: (serieIndex: number) => void
  }

  const { data, onselect = () => {} }: Props = $props()
  const groupedData = $derived(Object.groupBy(data.currentRoutine.series, (serie) => serie.group))
  let currentSerieId = $state(data.currentSerie.id)
</script>

<section class="flex flex-wrap items-center gap-2">
  {#each Object.entries(groupedData) as [group, series = []] (group)}
    <div class="w-full typescale-label font-bold uppercase">{group}</div>
    {#each series as serie}
      {@const percent = `${((data.progress[serie.id] ?? 0) * 100).toFixed(0)}%`}
      <label
        class={clsx(
          'group stack relative min-w-min border-2 border-default-line rounded-button shadow text-left focusable-within-ring contain-paint',
          currentSerieId === serie.id ? 'color-secondary' : 'color-neutral',
        )}>
        <div
          class={clsx(
            'line-clamp-1 px-2 py-1 bg-default group-hover:bg-default-hover group-active:bg-default-active transition-all',
          )}>
          {serie.name}
        </div>
        <div
          class={clsx(
            'line-clamp-1 px-2 py-1 bg-default group-hover:bg-default-hover group-active:bg-default-active transition-all',
            currentSerieId === serie.id ? 'color-secondary-darker' : 'color-neutral-darker',
          )}
          style="clip-path: rect(auto var(--clip-width) auto auto)"
          style:--clip-width={percent}>
          {serie.name}
        </div>
        <input
          class="sr-only"
          type="radio"
          name="currentSerieId"
          bind:group={currentSerieId}
          value={serie.id}
          onchange={() => onselect(data.currentRoutine.series.indexOf(serie))} />
      </label>
    {/each}
  {/each}
</section>
