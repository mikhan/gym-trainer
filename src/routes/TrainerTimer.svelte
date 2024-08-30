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

  let timeStart = $state(0)
  let timeCurrent = $state(0)

  function calculate() {
    timeCurrent = Date.now() - timeStart

    requestAnimationFrame(calculate)
  }

  function start() {
    timeStart = Date.now()
    calculate()
  }

  const pad = (number: number, length = 1) => String(number).padStart(length, '0')

  function getTime(timestamp: number) {
    const duration = Math.floor(timestamp / 1000)
    const ms = Math.floor((timestamp % 1000) / 10)

    const s = ~~duration % 60
    if (duration < 60) return [pad(s, 2), pad(ms, 2)]

    const m = ~~((duration % 3600) / 60)
    if (duration < 3600) return [pad(m), pad(s, 2), pad(ms, 2)]

    const h = ~~(duration / 3600)
    return [pad(h), pad(m, 2), pad(s, 2), pad(ms, 2)]
  }
</script>

<div class="flex flex-none flex-wrap items-baseline justify-end text-right font-mono">
  {#each getTime(timeCurrent) as part}
    <span>{part}</span>
  {/each}
</div>
<div class="flex flex-col items-center gap-2">
  <UiIconbutton class="size-12 color-primary" label="Siguiente ejercicio" onclick={start}>
    <Fa icon={faAnglesRight}></Fa>
  </UiIconbutton>
  <UiIconbutton
    class="size-9 color-neutral"
    label="Terminar entrenamiento"
    onclick={() => trainerContext.terminateTraining()}>
    <Fa icon={faStop}></Fa>
  </UiIconbutton>
</div>

<style lang="postcss">
  span:nth-last-child(1) {
    @apply w-full text-xs leading-3;
  }
  span:nth-last-child(2) {
    @apply text-2xl leading-6;
  }

  span:nth-last-child(3),
  span:nth-last-child(4) {
    &::after {
      content: ':';
    }
  }
</style>
