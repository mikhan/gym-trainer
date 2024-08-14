<script lang="ts">
  import UiTooltip from './../../lib/components/ui/ui-tooltip.svelte'
  import AppTopbar from '$lib/components/app/app-topbar.svelte'
  import AppFooter from '$lib/components/app/app-footer.svelte'
  import UiIconbutton from '$lib/components/ui/ui-iconbutton.svelte'
  import UiCarousel from '$lib/components/ui/ui-carousel.svelte'
  import { PersistedState } from '$lib/states/persisted-state.svelte'
  import Fa from 'svelte-fa'
  import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

  type Props = {
    training: Types.Training
    routine: Types.Routine
  }

  let { training, routine }: Props = $props()
  const currentSerieId = new PersistedState(
    'trainer:currentSerieId',
    routine.series[0]?.id,
    'session',
  )
  let currentSerie: Types.RoutineSerie | undefined = $derived(
    routine.series.find((serie) => serie.id === currentSerieId.value),
  )
  let currentIndex = $derived(routine.series.findIndex((serie) => serie.id === currentSerie?.id))
  const elements: Record<string, HTMLElement> = $state({})

  function scrollById(serieId: string) {
    elements[serieId]?.scrollIntoView({ behavior: 'smooth' })
  }

  function setCurrentSerie(serieId?: string) {
    currentSerieId.value = serieId
  }

  let carousel: UiCarousel
</script>

<AppTopbar previous={`/trainings/${training.id}`}>{routine.name}</AppTopbar>

<div
  class="relative grid h-full w-full grid-cols-[auto,1fr,auto] grid-rows-[100%] overflow-y-auto pb-8 contain-size scrollbar">
  <div
    class="pointer-coarse:hidden sticky left-0 top-0 z-1 col-start-1 row-start-1 grid h-full w-16 place-content-center"
    class:hidden={currentIndex === 0}>
    <UiIconbutton
      class="ui-button-lg shadow"
      label="Serie anterior"
      onclick={() => carousel.previous()}><Fa icon={faChevronLeft}></Fa></UiIconbutton>
  </div>
  <div
    class="pointer-coarse:hidden sticky right-0 top-0 z-1 col-start-3 row-start-1 grid h-full w-16 place-content-center"
    class:hidden={currentIndex === routine.series.length - 1}>
    <UiIconbutton
      class="ui-button-lg shadow"
      label="Siguiente serie"
      onclick={() => carousel.next()}><Fa icon={faChevronRight}></Fa></UiIconbutton>
  </div>
  <UiCarousel
    class="col-span-3 col-start-1 row-start-1 scrollbar-none"
    direction="horizontal"
    snap="center"
    label="Ejercicios"
    onchange={(e) => setCurrentSerie(e.detail.current?.dataset.id)}
    bind:this={carousel}>
    {#each routine.series as serie}
      <li
        class="mx-auto grid size-full max-w-screen-sm p-layout-gap"
        role="group"
        aria-roledescription="Slide"
        aria-label={serie.name}
        aria-current={serie.id === currentSerie?.id}
        data-id={serie.id}
        bind:this={elements[serie.id]}>
        <div class="bg-secondary text-secondary-fg flex size-full flex-col rounded-card p-6 shadow">
          <div class="typescale-headline mb-4">{serie.name}</div>
          <div class="mt-auto space-y-2">
            {#each serie.steps as step, index}
              <div class="flex items-center gap-2">
                <div class="mr-auto opacity-50">{index + 1}</div>
                <div>{step.value}</div>
                <div>{step.type}</div>

                <input
                  class="ui-input bg-secondary-darker border-secondary-darker-line text-secondary-darker-fg focusable w-16 rounded-card"
                  type="number"
                  bind:value={step.weight.value} />
                <select
                  class="ui-input bg-secondary-darker border-secondary-darker-line text-secondary-darker-fg focusable w-16 rounded-card"
                  bind:value={step.weight.unit}>
                  <option value="kg">Kg.</option>
                  <option value="lb">Lb.</option>
                </select>
              </div>
            {/each}
          </div>
        </div>
      </li>
    {/each}
  </UiCarousel>
  <div class="col-span-3 mx-auto grid w-full max-w-screen-sm gap-layout-gap px-layout-gap">
    <div class="h-96 rounded-card bg-neutral shadow"></div>
    <div class="h-96 rounded-card bg-neutral shadow"></div>
    <div class="h-96 rounded-card bg-neutral shadow"></div>
    <div class="h-96 rounded-card bg-neutral shadow"></div>
  </div>
  <!-- <div
    class="sticky bottom-0 left-0 mt-auto h-12 w-full shrink-0 bg-gradient-to-t from-neutral-darkest to-transparent">
  </div> -->
</div>

<AppFooter>
  <div class="flex size-full h-20 items-center justify-center bg-neutral-darkest">
    <div class="container flex items-center justify-between gap-2 px-layout-gap">
      {#each routine.series as serie, index}
        <button
          id={`button-${index}`}
          class="size-6 rounded-full border-2 text-xs font-bold"
          class:bg-secondary={serie.id === currentSerie?.id}
          onclick={() => scrollById(serie.id)}>{index + 1}</button>
        <UiTooltip target={`button-${index}`}>Ir a directamente a la serie {index + 1}</UiTooltip>
      {/each}
    </div>
  </div>
</AppFooter>

<!-- <style lang="postcss">
  li {
    animation-name: fade-in-out;
    animation-timeline: view(x);
  }

  @keyframes fade-in-out {
    0%,
    100% {
      /* scale: 0.85; */
      opacity: 0;
    }

    40%,
    60% {
      /* scale: 1; */
      opacity: 1;
    }
  }
</style> -->
