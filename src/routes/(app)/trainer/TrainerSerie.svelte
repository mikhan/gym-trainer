<script lang="ts">
  import clsx from 'clsx'
  import TrainerStep from './TrainerStep.svelte'
  import Fa from 'svelte-fa'
  import { faPlus } from '@fortawesome/free-solid-svg-icons'
  import UiIconbutton from '$lib/components/ui/ui-iconbutton.svelte'

  type Props = {
    serie: Types.RoutineSerie
    serieIndex: number
    total: number
    isCurrent: boolean
    isCompleted?: boolean
    records?: Record<string, Types.TrainerRecord>
  }

  let { serie, serieIndex, total, isCurrent, isCompleted, records }: Props = $props()
</script>

<li
  class="mx-auto grid size-full"
  role="group"
  aria-roledescription="Slide"
  aria-label={serie.name}
  aria-current={isCurrent}
  data-id={serie.id}
  inert={!isCurrent}>
  <div class="p-layout-gap">
    <article
      class={clsx(
        'mx-auto flex size-full flex-col overflow-auto rounded-card shadow transition-colors contain-strict scrollbar-thin surface',
        isCompleted
          ? 'delay-200 duration-long color-secondary-darker'
          : 'duration-short color-neutral-lighter',
      )}>
      <header class="flex items-center gap-4 p-6">
        <div class="flex items-center gap-1">
          <span class="text-6xl font-light leading-10">{serieIndex + 1}</span>
          <span class="text-lg leading-5 opacity-75">DE<br />{total}</span>
        </div>
        <h1 class="typescale-headline grow">{serie.name}</h1>
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
      <div class="typescale-title mt-auto px-6">
        {serie.steps.length} series
      </div>
      <ul
        class="grid w-full snap-x snap-mandatory scroll-p-6 auto-cols-max grid-flow-col content-end justify-start gap-x-4 gap-y-2 overflow-x-scroll p-6 scrollbar-thin *:snap-start">
        <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
        {#each serie.steps as step, stepIndex}
          <TrainerStep {serieIndex} {stepIndex} record={records?.[stepIndex]}></TrainerStep>
        {/each}
        <div class="row-span-4 grid snap-start grid-rows-subgrid">
          <UiIconbutton
            class={clsx(
              'row-start-2 place-self-center transition-colors',
              isCompleted ? 'color-neutral-darker' : 'color-neutral-lighter',
            )}
            variant="outlined"
            label="Agregar serie">
            <Fa icon={faPlus} size="lg"></Fa>
          </UiIconbutton>
        </div>
      </ul>
      {#if isCompleted}
        <div class="pointer-events-none fixed inset-0 z-2 contain-paint">
          <div
            class="ripple absolute bottom-0 left-0 size-[100vmin] rounded-full bg-default-active">
          </div>
        </div>
      {/if}
    </article>
  </div>
</li>

<style lang="postcss">
  .ripple {
    scale: 0;
    translate: -50% 50%;
    animation-name: ripple;
    animation-duration: theme('transitionDuration.medium');
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }

  @keyframes ripple {
    to {
      scale: 3;
      opacity: 0;
    }
  }

  li > * {
    @media (min-width: theme('screens.xl')) {
      animation-name: --stack-left, --scale-in, --fade-in-out;
      animation-timing-function: linear, linear, ease-in-out;
      animation-timeline: view(x);
      transform-origin: 0% 50%;
    }
  }

  @keyframes --stack-left {
    0% {
      translate: -90%;
    }
    50% {
      translate: 0%;
    }

    100% {
      translate: 100%;
    }
  }

  @keyframes --fade-in-out {
    0% {
      opacity: 0;
    }

    25%,
    50% {
      opacity: 1;
    }

    75%,
    100% {
      opacity: 0.5;
    }
  }

  @keyframes --scale-in {
    0% {
      scale: 0.9;
    }

    50%,
    100% {
      scale: 1;
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
