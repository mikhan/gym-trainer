<script lang="ts">
  import { TrainerContext } from './trainer/TrainerContext.svelte'
  import AppFooter from '$lib/components/app/app-footer.svelte'
  import Fa from 'svelte-fa'
  import { faAnglesRight, faStop } from '@fortawesome/free-solid-svg-icons'
  import UiIconbutton from '$lib/components/ui/ui-iconbutton.svelte'

  const trainerContext = TrainerContext.getContext()
</script>

<AppFooter>
  <div class="flex w-full items-center color-neutral-darkest surface">
    <div class="container mx-auto flex items-center gap-2 px-layout-gap py-2">
      {#if trainerContext.state.status === 'running'}
        <a
          class="focusable-ring mr-auto block overflow-hidden rounded-button px-4 py-2 hover:bg-default-hover"
          href="/trainer">
          <div class="typescale-label truncate">
            {trainerContext.state.training.name} / {trainerContext.state.currentRoutine.name}
          </div>
          <div class="truncate font-bold md:typescale-title">
            {trainerContext.state.currentSerie.name}
          </div>
        </a>
        <UiIconbutton
          class="color-neutral"
          label="Terminar entrenamiento"
          onclick={() => trainerContext.terminateTraining()}>
          <Fa icon={faStop}></Fa>
        </UiIconbutton>
        <UiIconbutton class="size-12 color-primary" label="Siguiente ejercicio">
          <Fa icon={faAnglesRight}></Fa>
        </UiIconbutton>
      {:else if trainerContext.state.status === 'completed'}
        <a
          class="focusable-ring mr-auto block overflow-hidden rounded-button px-4 py-2 hover:bg-default-hover"
          href="/trainer">
          <div class="typescale-label truncate">Entrenamiento completado</div>
          <div class="truncate font-bold md:typescale-title">
            {trainerContext.state.training.name}
          </div>
        </a>
      {/if}
    </div>
  </div>
</AppFooter>
