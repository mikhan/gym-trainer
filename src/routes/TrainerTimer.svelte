<script lang="ts">
  import { TrainerContext } from './trainer/TrainerContext.svelte'
  import Fa from 'svelte-fa'
  import { faAnglesRight, faStop } from '@fortawesome/free-solid-svg-icons'
  import UiIconbutton from '$lib/components/ui/ui-iconbutton.svelte'
  import { onMount } from 'svelte'

  const trainerContext = TrainerContext.getContext()

  interface WakeLockSentinel extends EventTarget {
    release(): Promise<void>
  }

  let wakeLock: null | WakeLockSentinel = null

  function handleVisibilityChange() {
    if (wakeLock !== null && document.visibilityState === 'visible') {
      requestWakeLock()
    }
  }

  async function requestWakeLock() {
    if (!('wakeLock' in navigator)) return

    wakeLock = await navigator.wakeLock.request('screen')

    wakeLock.addEventListener('release', () => (wakeLock = null))
    document.addEventListener('visibilitychange', handleVisibilityChange)
  }

  async function releaseWakeLock() {
    if (!wakeLock) return
    await wakeLock.release()
    wakeLock = null
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }

  onMount(() => {
    requestWakeLock()

    return () => releaseWakeLock()
  })
</script>

<UiIconbutton
  class="color-neutral"
  label="Terminar entrenamiento"
  onclick={() => trainerContext.terminateTraining()}>
  <Fa icon={faStop}></Fa>
</UiIconbutton>
<UiIconbutton class="size-12 color-primary" label="Siguiente ejercicio">
  <Fa icon={faAnglesRight}></Fa>
</UiIconbutton>
