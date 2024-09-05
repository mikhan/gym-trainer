<script lang="ts">
  import clsx from 'clsx'
  import TrainerStep from './TrainerStep.svelte'
  // import { TrainerContext } from './TrainerContext.svelte'

  type Props = {
    serie: Types.RoutineSerie
    serieIndex: number
    total: number
    isCurrent: boolean
    records?: Record<string, Types.TrainerRecord>
  }

  let { serie, serieIndex, total, isCurrent, records }: Props = $props()

  const registered = $derived(records ? Object.keys(records) : [])
  const completed = $derived(Object.keys(serie.steps).every((index) => registered.includes(index)))

  // function updateSerieNotes(value: string) {
  //   trainerContext.updateSerieNotes(serieIndex, value)
  // }
</script>

<li
  class="mx-auto grid size-full max-w-screen-sm p-layout-gap"
  role="group"
  aria-roledescription="Slide"
  aria-label={serie.name}
  aria-current={isCurrent}
  data-id={serie.id}
  inert={!isCurrent}>
  <article
    class={clsx(
      'flex size-full flex-col overflow-y-auto rounded-card shadow transition-colors scrollbar-thin surface',
      completed ? 'color-secondary-darker' : 'color-neutral',
    )}>
    <header class="sticky top-0 z-1 mb-6 flex items-start gap-4 bg-inherit p-6 pb-4">
      <div class="flex items-center gap-1">
        <span class="text-6xl font-light leading-10">{serieIndex + 1}</span>
        <span class="text-lg leading-5 opacity-75">DE<br />{total}</span>
      </div>
      <h1 class="typescale-headline grow">{serie.name}</h1>
      <div
        class="pointer-events-none absolute -bottom-6 left-0 h-6 w-full bg-inherit"
        style="mask-image: linear-gradient(to bottom, black, transparent)">
      </div>
    </header>
    <!-- <div class="px-6">
      <label class="ui-field">
        <span class="ui-label">Notas</span>
        <div class="ui-input">
          <textarea
            class="max-h-[6lh] min-h-[2lh]"
            value={serie.notes}
            placeholder="Agrega un comentario personal a este ejercicio"
            onchange={(e) => updateSerieNotes(e.currentTarget.value)}></textarea>
        </div>
      </label>
    </div> -->
    <ul
      class="mt-auto flex w-full flex-none snap-x snap-mandatory scroll-p-6 justify-start gap-4 overflow-x-auto px-6 pb-6 scrollbar-thin"
      style="_mask-image: linear-gradient(to right, transparent, black 2rem, black calc(100% - 2rem), transparent);">
      <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
      {#each serie.steps as step, stepIndex}
        <TrainerStep {serieIndex} {stepIndex} record={records?.[stepIndex]}></TrainerStep>
      {/each}
    </ul>
  </article>
</li>

<style lang="postcss">
  article {
    animation-name: fade-in-out;
    animation-timeline: view(x);
  }

  @keyframes fade-in-out {
    0%,
    100% {
      scale: 0.85;
      opacity: 0;
    }

    40%,
    60% {
      scale: 1;
      opacity: 1;
    }
  }
</style>
