<script lang="ts">
  import clsx from 'clsx'
  import TrainerStep from './TrainerStep.svelte'
  // import { TrainerContext } from './TrainerContext.svelte'

  type Props = {
    serie: Types.RoutineSerie
    serieIndex: number
    total: number
    isCurrent: boolean
    isCompleted?: boolean
    records?: Record<string, Types.TrainerRecord>
  }

  let { serie, serieIndex, total, isCurrent, isCompleted, records }: Props = $props()

  // function updateSerieNotes(value: string) {
  //   trainerContext.updateSerieNotes(serieIndex, value)
  // }
</script>

<li
  class="mx-auto grid size-full max-w-[--max-width] p-layout-gap"
  role="group"
  aria-roledescription="Slide"
  aria-label={serie.name}
  aria-current={isCurrent}
  data-id={serie.id}
  inert={!isCurrent}>
  <article
    class={clsx(
      'mx-auto flex size-full flex-col overflow-y-auto rounded-card shadow transition-colors scrollbar-thin surface',
      isCompleted ? 'color-secondary-darker' : 'color-neutral-lighter',
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
    <div
      class="mt-auto flex w-full flex-none snap-x snap-mandatory scroll-p-6 justify-start gap-4 overflow-x-scroll p-6 scrollbar-thin">
      <ul class={clsx('-m-4 flex grow gap-4 rounded-card p-4')}>
        <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
        {#each serie.steps as step, stepIndex}
          <TrainerStep {serieIndex} {stepIndex} record={records?.[stepIndex]}></TrainerStep>
        {/each}
      </ul>
    </div>
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
  @property --scrollable-shadow-1 {
    syntax: '<percentage>';
    inherits: false;
    initial-value: 0%;
  }
  @property --scrollable-shadow-2 {
    syntax: '<percentage>';
    inherits: false;
    initial-value: 100%;
  }

  .scrollable-xxx {
    position: relative;
    --scrollable-shadow-size: 2rem;
    --scrollable-shadow-color: hsl(0 0 0 / 90%);
    /* display: grid;
    grid-template-rows: auto 1fr auto;
    align-items: flex-start;
    background-color: inherit; */
    contain: layout;
    background-image: linear-gradient(
      to right,
      color-mix(in oklch, var(--scrollable-shadow-color) var(--scrollable-shadow-1), transparent),
      transparent 2rem,
      transparent calc(100% - 2rem),
      color-mix(in oklch, var(--scrollable-shadow-color) var(--scrollable-shadow-2), transparent)
    );
    animation-timeline: scroll(inline self);
    animation-name: --scrollable-shadow-fade;

    /* &::before, */
    &::before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      inset: 0;
      border: 1px solid red;
      /* flex: none;
      pointer-events: none; */
      /*  */
      /* position: sticky;
      height: var(--scrollable-shadow-size);
      background-color: inherit;
      margin-block-start: calc(var(--scrollable-shadow-size) * -1);
      opacity: 0;
      z-index: 1; */
    }

    /* &::before {
      top: 0;
      background-image: radial-gradient(
        farthest-side at top center,
        var(--scrollable-shadow-color) 33%,
        transparent
      );
      mask-image: linear-gradient(to bottom, black, transparent);
    } */

    /* &::after {
      bottom: 0;
      background-image: radial-gradient(
        farthest-side at bottom center,
        var(--scrollable-shadow-color) 33%,
        transparent
      );
      mask-image: linear-gradient(to top, black, transparent);
      animation-direction: reverse;
    } */
  }

  @keyframes --scrollable-shadow-fade {
    0% {
      --scrollable-shadow-1: 0%;
      --scrollable-shadow-2: 100%;
    }
    10% {
      --scrollable-shadow-1: 100%;
      --scrollable-shadow-2: 100%;
    }
    90% {
      --scrollable-shadow-1: 100%;
      --scrollable-shadow-2: 100%;
    }
    100% {
      --scrollable-shadow-1: 100%;
      --scrollable-shadow-2: 0%;
    }
  }
</style>
