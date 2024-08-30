<script lang="ts">
  import { TrainerContext } from './trainer/TrainerContext.svelte'
  import AppFooter from '$lib/components/app/app-footer.svelte'
  import TrainerTimer from './TrainerTimer.svelte'

  const trainerContext = TrainerContext.getContext()
</script>

{#if trainerContext.state.status !== 'unset'}
  <AppFooter>
    <div class="flex w-full items-center color-neutral-darkest surface">
      <div class="container mx-auto flex items-center gap-2 px-layout-gap py-2">
        {#if trainerContext.state.status === 'running'}
          <a
            class="-ms-2 mr-auto block overflow-hidden rounded-button p-2 focusable-ring hover:bg-default-hover"
            href="/trainer">
            <div class="typescale-label truncate">
              {trainerContext.state.training.name} / {trainerContext.state.currentRoutine.name}
            </div>
            <div class="truncate font-bold md:typescale-title">
              {trainerContext.state.currentSerie.name}
            </div>
          </a>
          <TrainerTimer></TrainerTimer>
        {:else if trainerContext.state.status === 'completed'}
          <a
            class="-ms-2 mr-auto block overflow-hidden rounded-button p-2 focusable-ring hover:bg-default-hover"
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
{/if}
