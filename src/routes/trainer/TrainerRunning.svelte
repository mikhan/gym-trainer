<script lang="ts">
  import TrainerSerieImage from './TrainerSerieImage.svelte'

  import TrainerSerieInstructions from './TrainerSerieInstructions.svelte'

  import TrainerSerie from './TrainerSerie.svelte'
  import UiIconbutton from '$lib/components/ui/ui-iconbutton.svelte'
  import UiCarousel from '$lib/components/ui/ui-carousel.svelte'
  import Fa from 'svelte-fa'
  import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
  import { TrainerContext } from './TrainerContext.svelte'
  import AppTopbar from '$lib/components/app/AppTopbar.svelte'

  type Props = {
    training: Types.Training
    currentRoutine: Types.Routine
    currentSerieIndex: number
    currentSerie: Types.RoutineSerie
  }

  let { training, currentRoutine, currentSerie, currentSerieIndex }: Props = $props()
  const trainerContext = TrainerContext.getContext()

  function setCurrentSerie(serieId?: string) {
    if (serieId) {
      const serieIndex = currentRoutine.series.findIndex((serie) => serie.id === serieId)
      trainerContext.setCurrentSerieIndex(serieIndex)
    }
  }

  let carousel: UiCarousel
</script>

<AppTopbar previous={`/trainings/${training.id}`} title={currentRoutine.name}></AppTopbar>

<div
  class="relative grid size-full grid-cols-[auto,minmax(auto,480px),auto] grid-rows-[calc(var(--layout-viewport-height)-4rem)] pb-layout-gap">
  <div
    class="sticky left-0 top-40 z-1 col-start-1 row-start-1 mx-4 grid size-10 justify-self-end pointer-coarse:hidden">
    <UiIconbutton
      disabled={currentSerieIndex === 0}
      class="ui-button-lg shadow color-neutral"
      label="Serie anterior"
      onclick={() => carousel.previous()}><Fa icon={faChevronLeft}></Fa></UiIconbutton>
  </div>
  <div
    class="sticky right-0 top-40 z-1 col-start-3 row-start-1 mx-4 grid size-10 justify-self-start pointer-coarse:hidden">
    <UiIconbutton
      disabled={currentSerieIndex === currentRoutine.series.length - 1}
      class="ui-button-lg shadow color-neutral"
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
        isCurrent={serie.id === currentSerie.id}></TrainerSerie>
    {/each}
  </UiCarousel>
  <div class="col-span-3 mx-auto grid w-full max-w-screen-sm gap-layout-gap px-layout-gap">
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
    <TrainerSerieImage
      title="Ejecución de ejercicio"
      src="https://ik.imagekit.io/mikhan/gym-trainer/exercises/00289eafca-v258577.gif"
      alt={`Imagen demostrando como ejecutar el ejercicio ${currentSerie.name}`}
    ></TrainerSerieImage>
  </div>
</div>
