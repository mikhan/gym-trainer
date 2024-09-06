<script lang="ts">
  import TrainerSerieImage from './TrainerSerieImage.svelte'
  import TrainerSerieInstructions from './TrainerSerieInstructions.svelte'
  import TrainerSerie from './TrainerSerie.svelte'
  import UiIconbutton from '$lib/components/ui/ui-iconbutton.svelte'
  import UiCarousel from '$lib/components/ui/ui-carousel.svelte'
  import Fa from 'svelte-fa'
  import { faChevronDown, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
  import { TrainerContext } from './TrainerContext.svelte'
  import UiButton from '$lib/components/ui/ui-button.svelte'
  import { startViewTransition } from '$lib/actions/transition.action'
  import AppShellSection from '$lib/components/app/AppShellSection.svelte'
  import AppShellHeader from '$lib/components/app/AppShellHeader.svelte'
  import { goto } from '$app/navigation'
  import clsx from 'clsx'

  type Props = {
    training: Types.Training
    currentRoutine: Types.Routine
    currentSerieIndex: number
    currentSerie: Types.RoutineSerie
    records: Types.TrainerRecords
  }

  let { training, currentRoutine, currentSerie, currentSerieIndex, records }: Props = $props()
  let carousel: UiCarousel
  const trainerContext = TrainerContext.getContext()

  function setCurrentSerie(serieId?: string) {
    if (serieId) {
      const serieIndex = currentRoutine.series.findIndex((serie) => serie.id === serieId)
      trainerContext.setCurrentSerieIndex(serieIndex)
    }
  }

  function terminate() {
    startViewTransition(() => trainerContext.terminateTraining())
  }

  function closeViewport() {
    goto(`/trainings/${training.id}`)
  }
</script>

<AppShellSection name="header">
  <AppShellHeader class="app-topbar">
    {#snippet start()}
      <UiButton onclick={closeViewport}>
        <Fa icon={faChevronDown}></Fa>
        <span>{currentRoutine.name}</span>
      </UiButton>
    {/snippet}
    {#snippet end()}
      <UiButton class="color-neutral" variant="outlined" onclick={terminate}>Terminar</UiButton>
    {/snippet}
  </AppShellHeader>
</AppShellSection>

<div
  class="relative grid size-full content-start surface"
  style:--carousel-height="calc(var(--layout-viewport-height) * .8)">
  <UiCarousel
    class="size-auto h-[--carousel-height] max-h-[50rem] min-h-[25rem] scrollbar-none"
    direction="horizontal"
    snap="center"
    label="Ejercicios"
    onscrollsnapchange={(e) => setCurrentSerie(e.detail.snapTargetInline?.dataset.id)}
    bind:this={carousel}>
    {#each currentRoutine.series as serie, serieIndex (serie.id)}
      <TrainerSerie
        {serie}
        {serieIndex}
        total={currentRoutine.series.length}
        isCurrent={serie.id === currentSerie.id}
        records={records[serie.id]}></TrainerSerie>
    {/each}
  </UiCarousel>
  <div
    class="sticky bottom-layout-footer-height mx-auto -mt-layout-gap w-full max-w-screen-sm space-y-layout-gap p-layout-gap pointer-coarse:hidden">
    <div
      class="flex items-center justify-between gap-1 rounded-full p-2 shadow color-neutral-darker surface sm:gap-2">
      <UiIconbutton
        disabled={currentSerieIndex === 0}
        class="color-neutral-lighter"
        size="sm"
        label="Serie anterior"
        onclick={() => carousel.previous()}><Fa icon={faChevronLeft}></Fa></UiIconbutton>
      {#each currentRoutine.series as serie}
        {@const isCurrent = serie.id === currentSerie.id}
        <div
          class={clsx(
            'rounded-full p-1 transition-all surface',
            isCurrent
              ? 'grid size-6 place-content-center color-primary sm:size-8'
              : 'aspect-square size-3 color-neutral-lighter sm:size-4',
          )}>
        </div>
      {/each}
      <UiIconbutton
        disabled={currentSerieIndex === currentRoutine.series.length - 1}
        size="sm"
        class="color-neutral-lighter"
        label="Siguiente serie"
        onclick={() => carousel.next()}><Fa icon={faChevronRight}></Fa></UiIconbutton>
    </div>
  </div>
  <div class="mx-auto -mt-layout-gap w-full max-w-screen-sm space-y-layout-gap p-layout-gap">
    <TrainerSerieImage
      title="Ejecución de ejercicio"
      src="https://ik.imagekit.io/mikhan/gym-trainer/exercises/00289eafca-v258577.gif"
      alt={`Imagen demostrando como ejecutar el ejercicio ${currentSerie.name}`}
    ></TrainerSerieImage>
    <TrainerSerieInstructions>
      <p>
        Amet ipsum sint duis ex nisi anim cupidatat labore proident do ullamco culpa consectetur.
        Sint minim quis amet voluptate nostrud sint fugiat duis pariatur ad anim sint. Ad ea laborum
        duis labore duis et do pariatur eiusmod ad culpa veniam. Fugiat dolore nulla amet ullamco
        est elit deserunt ullamco. In adipisicing eu irure incididunt commodo fugiat culpa aliqua
        commodo non commodo esse ex. Excepteur aute voluptate anim mollit do amet officia dolore
        excepteur occaecat ullamco sit.
      </p>
    </TrainerSerieInstructions>
  </div>
</div>

<style lang="postcss">
  ::view-transition-old(trainer-running-viewport) {
    animation:
      210ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
      theme('transitionDuration.medium') cubic-bezier(0.4, 0, 0.2, 1) both slide-to-bottom;
  }

  ::view-transition-new(trainer-running-viewport) {
    animation:
      210ms cubic-bezier(0, 0, 0.2, 1) both fade-in,
      theme('transitionDuration.medium') cubic-bezier(0.4, 0, 0.2, 1) both slide-from-bottom;
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
