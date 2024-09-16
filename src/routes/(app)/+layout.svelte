<script lang="ts">
  import { viewTransitionName } from '$lib/actions/transition.action'
  import AppShell from '$lib/components/app/AppShell.svelte'
  import { TrainerContext } from './trainer/TrainerContext.svelte'
  import { wakeLock, type WakeLockStatus } from '$lib/stores/wakelock.store'
  import Player from './trainer/Player.svelte'

  let { children } = $props()

  const trainerContext = TrainerContext.setContext()

  const colors: Record<WakeLockStatus, string> = {
    pending: 'gray',
    locked: 'green',
    denied: 'red',
    released: 'yellow',
  }
</script>

<AppShell>
  {@render children()}

  {#if trainerContext.state.status === 'running'}
    <Player state={trainerContext.state}></Player>
  {/if}
</AppShell>

<div
  class="fixed bottom-0 right-0 z-3 size-3 rounded-tl-button bg-default"
  use:viewTransitionName={'wakelock-status'}
  style:--color-default={colors[$wakeLock]}>
</div>
