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
  class="relative grid size-full grid-cols-[auto,minmax(auto,480px),auto] grid-rows-[calc(var(--layout-viewport-height)-4rem)] pb-layout-gap surface">
  <div
    class="sticky left-0 top-40 z-1 col-start-1 row-start-1 mx-4 grid size-10 justify-self-end pointer-coarse:hidden">
    <UiIconbutton
      disabled={currentSerieIndex === 0}
      class="ui-button-lg shadow color-neutral-lighter surface-glass"
      label="Serie anterior"
      onclick={() => carousel.previous()}><Fa icon={faChevronLeft}></Fa></UiIconbutton>
  </div>
  <div
    class="sticky right-0 top-40 z-1 col-start-3 row-start-1 mx-4 grid size-10 justify-self-start pointer-coarse:hidden">
    <UiIconbutton
      disabled={currentSerieIndex === currentRoutine.series.length - 1}
      class="ui-button-lg shadow color-neutral-lighter surface-glass"
      label="Siguiente serie"
      onclick={() => carousel.next()}><Fa icon={faChevronRight}></Fa></UiIconbutton>
  </div>
  <UiCarousel
    class="col-span-3 col-start-1 row-start-1 scrollbar-none"
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
  <div class="col-span-3 mx-auto grid w-full max-w-screen-sm gap-layout-gap px-layout-gap">
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
