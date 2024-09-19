<script lang="ts">
  import { faAnglesDown, faAnglesUp, faTrash } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa'
  import { slide } from 'svelte/transition'
  import AppShellHeader from '$lib/components/app/AppBar.svelte'
  import AppShellSection from '$lib/components/app/AppShellSection.svelte'
  import UiIconbutton from '$lib/components/ui/UiIconbutton.svelte'
  import PlayerTimer from './PlayerTimer.svelte'
  import { type TrainerContextStateRunning } from './TrainerContext.svelte'

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
  <AppShellHeader class="color-neutral-darkest surface" name="timer-history" align="end">
    {#snippet aside()}
      {#if showHistory}
        <div
          class="flex justify-start px-layout-gap py-2"
          transition:slide={{ axis: 'y', duration: 100 }}>
          <ul
            class="grid max-h-[4.5lh] flex-1 grid-cols-[auto,auto] content-start justify-end gap-x-4 overflow-auto px-2 text-right font-mono leading-5 scrollbar-thin scrollbar-stable">
            {#each history as duration, index}
              <li class="col-span-2 grid grid-cols-subgrid">
                <time>{formatTime(duration)}</time>
                <span>{index + 1}</span>
              </li>
            {/each}
          </ul>
          <UiIconbutton label="Eliminar historial" onclick={clearHistory}>
            <Fa icon={faTrash}></Fa>
          </UiIconbutton>
        </div>
      {/if}
    {/snippet}

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
      <PlayerTimer ontime={(time) => history.push(time.duration)}></PlayerTimer>
    {/snippet}
  </AppShellHeader>
</AppShellSection>
