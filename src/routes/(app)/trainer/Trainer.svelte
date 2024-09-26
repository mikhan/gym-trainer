<script lang="ts">
  import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa'
  import { startViewTransition, viewTransitionName } from '$lib/actions/transition.action'
  // import AppShellSection from '$lib/components/app/AppShellSection.svelte'
  // import AppTopbar from '$lib/components/app/AppTopbar.svelte'
  import UiButton from '$lib/components/ui/UiButton.svelte'
  import UiCarousel from '$lib/components/ui/UiCarousel.svelte'
  import { TrainerContext, type TrainerContextStateRunning } from './TrainerContext.svelte'
  import TrainerNavigator from './TrainerNavigator.svelte'
  import TrainerNotes from './TrainerNotes.svelte'
  import TrainerScroller from './TrainerScroller.svelte'
  import TrainerSerie from './TrainerSerie.svelte'
  import TrainerSerieInstructions from './TrainerSerieInstructions.svelte'
  import TrainerStatics from './TrainerStatics.svelte'

  type Props = {
    data: TrainerContextStateRunning
  }

  const { data }: Props = $props()
  let carousel: UiCarousel
  let root: HTMLElement
  const trainerContext = TrainerContext.getContext()

  function setCurrentSerie(serieId?: string) {
    if (serieId) {
      const serieIndex = data.currentRoutine.series.findIndex((serie) => serie.id === serieId)
      trainerContext.setCurrentSerieIndex(serieIndex)
    }
  }

  function terminate() {
    startViewTransition(() => trainerContext.terminateTraining())
  }

  let pointerdown = false

  function gotoSerie(index: number) {
    const update = () => {
      carousel.goto(index)
      if (!pointerdown) root.scrollIntoView({ behavior: 'smooth' })
    }

    if (pointerdown) update()
    else startViewTransition({ update, types: ['trainer-running-transition'] })
  }
</script>

<svelte:document
  onpointerdown={() => (pointerdown = true)}
  onpointerup={() => (pointerdown = false)}
  onpointercancel={() => (pointerdown = false)} />

<!-- <AppShellSection name="header">
  <AppTopbar
    icon={faChevronDown}
    previous={`/trainings/${data.training.id}`}
    title={data.currentRoutine.name}>
    {#snippet actions()}
      <UiButton class="color-primary" outlined onclick={terminate}>Terminar</UiButton>
    {/snippet}
  </AppTopbar>
</AppShellSection> -->

<div
  class="grid items-start auto-rows-auto gap-layout-gap p-layout-gap
  grid-cols-1 lg:grid-cols-2 3xl:grid-cols-[36rem,1fr]
  relative mx-auto size-full lg:container"
  bind:this={root}>
  <div
    class="flex flex-col gap-layout-gap p-layout-gap lg:sticky [@media(min-height:41rem)]:top-layout-viewport-top
    -m-layout-gap min-h-[36rem] max-h-[60rem] h-layout-viewport-height">
    <div
      class="flex gap-2 justify-between surface surface-outlined rounded-full p-1 color-neutral-darker">
      <UiButton is="a" href={`/trainings/${data.training.id}/routines/${data.currentRoutine.id}`}>
        <Fa icon={faChevronDown}></Fa>
        <span>Rutina: {data.currentRoutine.name}</span>
      </UiButton>
      <UiButton onclick={terminate}>Terminar</UiButton>
    </div>
    <div
      class="-m-layout-gap grow"
      use:viewTransitionName={{
        name: 'trainer-running-serie',
        type: 'trainer-running-transition',
      }}>
      <UiCarousel
        class="size-full scrollbar-none"
        direction="horizontal"
        label="Ejercicios"
        onscrollsnapchange={(e) => setCurrentSerie(e.detail.snapTargetInline?.dataset.id)}
        bind:this={carousel}>
        {#each data.currentRoutine.series as serie, serieIndex (serie.id)}
          <TrainerSerie
            {serie}
            {serieIndex}
            total={data.currentRoutine.series.length}
            isCurrent={serie.id === data.currentSerie.id}
            isCompleted={data.progress[serie.id] === 1}
            records={data.records[serie.id]}></TrainerSerie>
        {/each}
      </UiCarousel>
    </div>
    <TrainerScroller
      value={data.currentSerieIndex}
      min={0}
      max={data.currentRoutine.series.length - 1}
      onchange={(value) => gotoSerie(value)}></TrainerScroller>
  </div>

  <div
    class="max-lg:contents grid items-start gap-layout-gap container mx-auto w-full 3xl:grid-cols-[1fr,36rem]">
    <div class="grid gap-layout-gap">
      <TrainerNavigator {data} onselect={(serieIndex) => gotoSerie(serieIndex)}></TrainerNavigator>
      <TrainerSerieInstructions
        image={'https://ik.imagekit.io/mikhan/gym-trainer/exercises/00289eafca-v258577.gif'}
        alt={`Imagen demostrando como ejecutar el ejercicio ${data.currentSerie.name}`}>
      </TrainerSerieInstructions>
      <TrainerNotes></TrainerNotes>
    </div>

    <div
      class="max-3xl:contents sticky [@media(min-height:41rem)]:top-layout-viewport-top -my-layout-gap py-layout-gap h-layout-viewport-height">
      <TrainerStatics></TrainerStatics>
    </div>
  </div>
</div>

<style lang="postcss">
  :global {
    ::view-transition-old(trainer-running-viewport) {
      animation:
        210ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
        500ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-bottom;
    }

    ::view-transition-new(trainer-running-viewport) {
      animation:
        210ms cubic-bezier(0, 0, 0.2, 1) both fade-in,
        500ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-bottom;
    }

    @keyframes fade-in {
      from {
        opacity: 0;
      }
    }

    @keyframes fade-out {
      to {
        opacity: 0;
      }
    }

    @keyframes slide-from-bottom {
      from {
        transform: translateY(100%);
      }
    }

    @keyframes slide-to-bottom {
      to {
        transform: translateY(100%);
      }
    }

    ::view-transition-group(trainer-running-serie) {
      --duration: theme('transitionDuration.short');
      --bias: 0.3;
      --duration-old: calc(var(--duration) * var(--bias));
      --duration-new: calc(var(--duration) * calc(1 - var(--bias)));
    }

    ::view-transition-old(trainer-running-serie) {
      animation:
        var(--duration-old) cubic-bezier(0.4, 0, 1, 1) both fade-out,
        var(--duration) cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
    }

    ::view-transition-new(trainer-running-serie) {
      animation:
        var(--duration-new) cubic-bezier(0, 0, 0.2, 1) var(--duration-old) both fade-in,
        var(--duration) cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
    }

    @keyframes slide-from-right {
      from {
        transform: translateX(60px);
      }
    }

    @keyframes slide-to-left {
      to {
        transform: translateX(-60px);
      }
    }
  }
</style>
