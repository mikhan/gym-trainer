<script lang="ts">
  import UiIconbutton from '$lib/components/ui/UiIconbutton.svelte'
  import Fa from 'svelte-fa'
  import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
  import clsx from 'clsx'

  type Props = {
    value?: number
    min?: number
    max?: number
    class?: string
    onchange?: (value: number) => unknown
  }

  let { value = $bindable(0), min = 0, max = 100, class: className, onchange }: Props = $props()
  const ticks = $derived(Array.from({ length: max + 1 }, (_, index) => index))

  function previous() {
    const newValue = Math.max(min, Math.min(max, value - 1))
    if (value !== newValue) onchange?.((value = newValue))
  }

  function next() {
    const newValue = Math.max(min, Math.min(max, value + 1))
    if (value !== newValue) onchange?.((value = newValue))
  }

  function updateFromInput() {
    onchange?.(value)
  }
</script>

<section
  class={clsx(
    'flex touch-pan-y items-center justify-between gap-1 rounded-full p-1 shadow color-neutral-darker surface surface-outlined sm:gap-2',
    className,
  )}>
  <UiIconbutton label="Serie anterior" tabindex={-1} onclick={previous}>
    <Fa icon={faChevronLeft}></Fa>
  </UiIconbutton>
  <div class="relative isolate h-6 grow @container-[size]">
    <div
      class="absolute inset-0 -z-1 grid grow auto-cols-[0px] grid-flow-col items-center justify-between px-[calc(100cqb/2)]">
      <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
      {#each ticks as tick}
        <div class="h-1 w-1 -translate-x-1/2 rounded-full bg-default-fg"></div>
      {/each}
    </div>

    <input
      class="absolute inset-0 w-full cursor-pointer appearance-none rounded-full bg-transparent align-middle !outline-offset-4 focusable-ring"
      type="range"
      bind:value
      {min}
      {max}
      step="1"
      oninput={updateFromInput} />
  </div>
  <UiIconbutton label="Siguiente serie" tabindex={-1} onclick={next}>
    <Fa icon={faChevronRight}></Fa>
  </UiIconbutton>
</section>

<style lang="postcss">
  :global {
    input[type='range']::-webkit-slider-runnable-track {
      @apply h-full;
    }

    input[type='range']::-moz-range-track {
      @apply h-full;
    }

    input[type='range']::-webkit-slider-thumb {
      @apply appearance-none;
      @apply size-[100cqb] rounded-full border-2 border-solid border-secondary-lighter bg-secondary-lighter/25;
    }

    input[type='range']::-moz-range-thumb {
      @apply border-none;
      @apply size-[100cqb] rounded-full border-2 border-solid border-secondary-lighter bg-secondary-lighter/25;
    }
  }
</style>
