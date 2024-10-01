<script lang="ts">
  import { faPlus } from '@fortawesome/free-solid-svg-icons'
  import clsx from 'clsx'
  import Fa from 'svelte-fa'
  import UiIconbutton from '$lib/components/ui/UiIconbutton.svelte'
  import TrainerStep from './TrainerStep.svelte'

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
          ? 'delay-200 duration-long ease-out color-secondary-darker'
          : 'color-neutral-lighter',
      )}>
      {#if isCompleted}
        <div class="pointer-events-none fixed inset-0 -z-1 contain-paint">
          <div
            class="ripple absolute bottom-0 left-0 size-[100vmin] rounded-full bg-default-active">
          </div>
        </div>
      {/if}
      <header class="flex items-center gap-4 p-6">
        <div class="flex items-center gap-1">
          <span class="text-6xl font-light leading-10">{serieIndex + 1}</span>
          <span class="text-lg leading-5 opacity-75">DE<br />{total}</span>
        </div>
        <h1 class="typescale-headline grow">{serie.name}</h1>
      </header>
      <div class="typescale-title mt-auto px-6">
        {serie.steps.length} series
      </div>
      <ul
        class="grid w-full snap-x snap-mandatory scroll-p-6 auto-cols-max grid-flow-col content-end justify-start gap-x-4 gap-y-2 overflow-x-scroll p-6 scrollbar *:snap-start">
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
            outlined
            filled
            label="Agregar serie">
            <Fa icon={faPlus} size="lg"></Fa>
          </UiIconbutton>
        </div>
      </ul>
    </article>
  </div>
</li>

<style lang="postcss">
  .ripple {
    scale: 0;
    translate: -50% 50%;
    animation-name: ripple;
    animation-duration: theme('transitionDuration.long');
    animation-timing-function: theme('transitionTimingFunction.out');
  }

  @keyframes ripple {
    to {
      scale: 3;
      opacity: 0;
    }
  }

  li > * {
    @media not all and (min-width: theme('screens.lg')) {
      animation-name: --fade;
      animation-timing-function: ease-in-out;
      animation-timeline: view(x);
      transform-origin: center;
    }

    @media (min-width: theme('screens.lg')) {
      animation-name: --stack-left, --scale-in, --fade-in-out;
      animation-timing-function: linear, linear, ease-in-out;
      animation-timeline: view(x);
      transform-origin: center;
    }
  }

  @keyframes --fade {
    0% {
      opacity: 0;
    }

    40%,
    60% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }

  @keyframes --stack-left {
    0% {
      translate: -100%;
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

    50% {
      opacity: 1;
    }

    55%,
    100% {
      opacity: 0;
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
</style>
