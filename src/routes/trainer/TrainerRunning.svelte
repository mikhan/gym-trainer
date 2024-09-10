<script lang="ts">
  import { viewTransitionName } from '$lib/actions/transition.action'
  import TrainerSerieImage from './TrainerSerieImage.svelte'
  import TrainerSerieInstructions from './TrainerSerieInstructions.svelte'
  import TrainerSerie from './TrainerSerie.svelte'
  import UiCarousel from '$lib/components/ui/ui-carousel.svelte'
  import Fa from 'svelte-fa'
  import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
  import { TrainerContext, type TrainerContextStateRunning } from './TrainerContext.svelte'
  import UiButton from '$lib/components/ui/ui-button.svelte'
  import { startViewTransition } from '$lib/actions/transition.action'
  import AppShellSection from '$lib/components/app/AppShellSection.svelte'
  import AppShellHeader from '$lib/components/app/AppShellHeader.svelte'
  import TrainerScroller from './TrainerScroller.svelte'
  import { goto } from '$app/navigation'
  import SvelteMarkdown from 'svelte-markdown'

  type Props = {
    data: TrainerContextStateRunning
  }

  const { data }: Props = $props()
  let carousel: UiCarousel
  let root: HTMLElement
  const trainerContext = TrainerContext.getContext()
  const instructions = `
Amet ipsum sint duis ex nisi anim cupidatat labore proident do ullamco culpaconsectetur.

1. Sint minim quis amet **voluptate** nostrud sint fugiat duis pariatur ad anim sint.
2. Ad ea laborum duis labore duis et do pariatur eiusmod ad culpa veniam. Fugiat dolore nulla amet ullamco est elit deserunt ullamco.
3. In adipisicing eu irure incididunt commodo fugiat culpa aliqua commodo non commodo esse ex.

Excepteur aute voluptate anim mollit do amet officia dolore excepteur occaecat ullamco sit.`

  function setCurrentSerie(serieId?: string) {
    if (serieId) {
      const serieIndex = data.currentRoutine.series.findIndex((serie) => serie.id === serieId)
      trainerContext.setCurrentSerieIndex(serieIndex)
    }
  }

  function terminate() {
    startViewTransition(() => trainerContext.terminateTraining())
  }

  function closeViewport() {
    goto(`/trainings/${data.training.id}`)
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

<AppShellSection name="header">
  <AppShellHeader class="app-topbar app-topbar-docked">
    {#snippet start()}
      <UiButton onclick={closeViewport}>
        <Fa icon={faChevronDown}></Fa>
        <span>{data.currentRoutine.name}</span>
      </UiButton>
    {/snippet}
    {#snippet end()}
      <UiButton class="color-neutral" variant="outlined" onclick={terminate}>Terminar</UiButton>
    {/snippet}
  </AppShellHeader>
</AppShellSection>

<div
  class="relative mx-auto grid size-full auto-rows-auto grid-rows-[clamp(30rem,var(--layout-viewport-height),60rem)] content-start gap-x-layout-gap xl:container xl:grid-cols-2"
  bind:this={root}>
  <div
    class="flex flex-col gap-layout-gap p-layout-gap xl:sticky xl:pr-0 [@media(min-height:768px)]:top-layout-viewport-top">
    <div
      class="-m-layout-gap grow"
      use:viewTransitionName={{
        name: 'trainer-running-serie',
        type: 'trainer-running-transition',
      }}>
      <UiCarousel
        class="size-full scrollbar-none"
        direction="horizontal"
        snap="center"
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
    class="container row-span-2 mx-auto w-full space-y-layout-gap p-layout-gap max-xl:pt-0 xl:pl-0">
    <section class="flex flex-wrap gap-4">
      {#each data.currentRoutine.series as serie, serieIndex (serie.id)}
        {@const percent = `${((data.progress[serie.id] ?? 0) * 100).toFixed(0)}%`}
        <button
          class="relative min-w-min rounded-button px-2 py-1 text-left shadow color-neutral surface surface-hoverable surface-activable focusable-outside focusable-ring"
          type="button"
          onclick={() => gotoSerie(serieIndex)}>
          <div class="typescale-label line-clamp-1">{serie.name}</div>
          <div
            class="typescale-label absolute inset-0 line-clamp-1 overflow-clip rounded-button px-2 py-1 transition-all color-secondary surface"
            style="clip-path: rect(auto var(--clip-width) auto auto)"
            style:--clip-width={percent}>
            {serie.name}
          </div>
          <div class="absolute -inset-2"></div>
        </button>
      {/each}
    </section>
    <TrainerSerieInstructions>
      <div class="flex flex-col gap-layout-gap sm:flex-row sm:flex-wrap">
        <div class="prose prose-invert flex-1 sm:min-w-96">
          <SvelteMarkdown source={instructions} />
        </div>
        <div class="flex-1 sm:min-w-48">
          <TrainerSerieImage
            src="https://ik.imagekit.io/mikhan/gym-trainer/exercises/00289eafca-v258577.gif"
            alt={`Imagen demostrando como ejecutar el ejercicio ${data.currentSerie.name}`}>
          </TrainerSerieImage>
        </div>
      </div>
    </TrainerSerieInstructions>
    <section class="space-y-4 rounded-card p-4 shadow color-neutral surface">
      <div class="typescale-title">Notas</div>
      <p>
        Eu consectetur officia labore aliqua id nisi fugiat dolore ipsum et sit est. Reprehenderit
        elit ad fugiat velit ipsum. Laborum pariatur ullamco non fugiat Lorem elit adipisicing duis
        cupidatat eiusmod commodo proident incididunt mollit. Id cillum ullamco aliqua nisi eiusmod
        laboris.
      </p>
    </section>
    <section class="min-h-96 rounded-card p-4 shadow color-neutral surface">
      <div class="typescale-title">Historial</div>
    </section>
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
