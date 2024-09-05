<script lang="ts">
  import { type TrainerContextStateRunning } from './trainer/TrainerContext.svelte'
  import TrainerTimer from './TrainerTimer.svelte'
  import AppShellSection from '$lib/components/app/AppShellSection.svelte'
  import AppShellFooter from '$lib/components/app/AppShellFooter.svelte'
  import UiIconbutton from '$lib/components/ui/ui-iconbutton.svelte'
  import { faAnglesDown, faAnglesUp, faTrash } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa'
  import clsx from 'clsx'

  type Props = { state: TrainerContextStateRunning }

  const { state: trainerContextState }: Props = $props()
  const history: number[] = $state([])
  let showHistory = $state(false)

  function formatTime(timestamp: number) {
    timestamp = ~~(timestamp / 1000)
    const minutes = ~~(timestamp / 60)
    const seconds = timestamp % 60
    return minutes.toString() + ':' + seconds.toString().padStart(2, '0')
  }

  function clearHistory() {
    history.length = 0
    showHistory = false
  }
</script>

<AppShellSection name="footer">
  <!-- <AppShellFooter
    class={clsx('-mb-2 transition-all color-neutral-darkest', showHistory ? 'h-36' : 'h-0')}>
    {#snippet end()}
      <div class="flex h-full max-h-80 justify-start">
        <div class="flex flex-col items-center gap-2 text-right font-bold">
          <ul
            class="grid flex-1 grid-cols-[auto,auto] content-start justify-end gap-x-4 overflow-auto px-2 text-right font-mono leading-5 scrollbar-thin">
            {#each history as duration, index}
              <li class="col-span-2 grid grid-cols-subgrid">
                <time>{formatTime(duration)}</time>
                <span>{index + 1}</span>
              </li>
            {/each}
          </ul>
        </div>
        <UiIconbutton label="Eliminar historial" onclick={clearHistory}>
          <Fa icon={faTrash}></Fa>
        </UiIconbutton>
      </div>
    {/snippet}
  </AppShellFooter> -->
  <AppShellFooter class="color-neutral-darkest">
    {#snippet start()}
      <a
        class="-ml-2 grid h-12 place-content-center rounded-button px-2 focusable-ring hover:bg-default-hover md:-ml-4 md:px-4"
        href="/trainer">
        <div
          class="line-clamp-2 text-balance font-bold leading-4 md:typescale-title md:line-clamp-1">
          {trainerContextState.currentSerie.name}
        </div>
      </a>
    {/snippet}

    {#snippet end()}
      {#if history.length > 0}
        <UiIconbutton label="Historial de tiempos" onclick={() => (showHistory = !showHistory)}>
          <Fa icon={showHistory ? faAnglesDown : faAnglesUp}></Fa>
        </UiIconbutton>
      {/if}
      <TrainerTimer ontime={(time) => history.push(time.duration)}></TrainerTimer>
    {/snippet}
  </AppShellFooter>
</AppShellSection>
