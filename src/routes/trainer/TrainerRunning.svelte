<script lang="ts">
  import TrainerSerieImage from './TrainerSerieImage.svelte'
  import TrainerSerieInstructions from './TrainerSerieInstructions.svelte'
  import TrainerSerie from './TrainerSerie.svelte'
  import UiCarousel from '$lib/components/ui/ui-carousel.svelte'
  import Fa from 'svelte-fa'
  import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
  import { TrainerContext, type TrainerContextStateRunning } from './TrainerContext.svelte'
  import UiButton from '$lib/components/ui/ui-button.svelte'
  import { startViewTransition, viewTransitionName } from '$lib/actions/transition.action'
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
  const trainerContext = TrainerContext.getContext()
  const instructions = `Amet ipsum sint duis ex nisi anim cupidatat labore proident do ullamco culpa
consectetur. Sint minim quis amet **voluptate** nostrud sint fugiat duis pariatur ad anim
sint. Ad ea laborum duis labore duis et do pariatur eiusmod ad culpa veniam. Fugiat
dolore nulla amet ullamco est elit deserunt ullamco. In adipisicing eu irure incididunt
commodo fugiat culpa aliqua commodo non commodo esse ex. Excepteur aute voluptate anim
mollit do amet officia dolore excepteur occaecat ullamco sit.`

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
</script>

<AppShellSection name="header">
  <AppShellHeader class="app-topbar">
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

<div class="relative grid size-full content-start surface" style:--max-width="768px">
  <div class="grid h-layout-viewport-height max-h-[60rem] grid-rows-[1fr,auto]">
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
    <div class="mx-auto -mt-layout-gap w-full max-w-[--max-width] space-y-layout-gap p-layout-gap">
      <TrainerScroller
        value={data.currentSerieIndex}
        min={0}
        max={data.currentRoutine.series.length - 1}
        onchange={(value) => carousel.goto(value)}></TrainerScroller>
    </div>
  </div>

  <div class="mx-auto -mt-layout-gap w-full max-w-[--max-width] space-y-layout-gap p-layout-gap">
    <section class="flex flex-wrap gap-2">
      {#each data.currentRoutine.series as serie, serieIndex (serie.id)}
        {@const percent = `${((data.progress[serie.id] ?? 0) * 100).toFixed(0)}%`}
        <button
          class="typescale-label relative line-clamp-1 min-w-min rounded-button px-2 py-1 text-left shadow color-neutral surface surface-hoverable surface-activable"
          type="button"
          onclick={() => carousel.goto(serieIndex)}>
          <div>{serie.name}</div>
          <div
            class="absolute inset-0 line-clamp-1 overflow-clip px-2 py-1 transition-all color-secondary surface"
            style="clip-path: rect(auto var(--clip-width) auto auto)"
            style:--clip-width={percent}>
            {serie.name}
          </div>
        </button>
      {/each}
    </section>
    <TrainerSerieInstructions>
      <div class="flex flex-col gap-layout-gap sm:flex-row sm:flex-wrap">
        <div class="flex-1 sm:min-w-96">
          <SvelteMarkdown source={instructions} />
          <p></p>
        </div>
        <div class="flex-1 sm:min-w-48">
          <TrainerSerieImage
            src="https://ik.imagekit.io/mikhan/gym-trainer/exercises/00289eafca-v258577.gif"
            alt={`Imagen demostrando como ejecutar el ejercicio ${data.currentSerie.name}`}>
          </TrainerSerieImage>
        </div>
      </div>
    </TrainerSerieInstructions>
  </div>
</div>

<style lang="postcss">
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
</style>
