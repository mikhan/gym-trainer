<script lang="ts">
  import Fa from 'svelte-fa'
  import { faArrowRotateBack, faPlay, faStop } from '@fortawesome/free-solid-svg-icons'
  import UiIconbutton from '$lib/components/ui/ui-iconbutton.svelte'
  import { onDestroy } from 'svelte'
  import { wakeLock } from '$lib/stores/wakelock.store'

  type Time = { start: number; duration: number }

  let timeStart: number | null = $state(null)
  let timeDuration = $state(0)
  let currentTime: Time | null = null

  const value = $state({
    hours: '',
    minutes: '',
    seconds: '',
    milliseconds: '',
  })

  const history: Time[] = $state([])

  $effect(() => {
    update(timeDuration)
  })

  function update(timestamp: number) {
    const duration = Math.floor(timestamp / 1000)

    value.milliseconds = ((timestamp % 1000) / 10).toFixed(0).padStart(2, '0')
    value.seconds = String(~~duration % 60).padStart(2, '0')
    if (duration >= 60) value.minutes = `${~~(duration / 60)}:`
  }

  function calculate() {
    if (timeStart === null) return

    timeDuration = performance.now() - timeStart

    requestAnimationFrame(calculate)
  }

  function start() {
    value.hours = ''
    value.minutes = ''
    value.seconds = ''
    value.milliseconds = ''
    timeStart = performance.now()
    wakeLock.request()
    requestAnimationFrame(calculate)
  }

  function stop() {
    timeStart = null
    wakeLock.release()
  }

  let isLongPress = false
  let timeout: number | null = $state(null)

  function onClick() {
    if (isLongPress) return
    start()
  }

  function onMousedown() {
    isLongPress = false
    if (timeStart === null) return
    if (timeout) clearTimeout(timeout)

    timeout = window.setTimeout(() => {
      timeout = null
      isLongPress = true
      stop()
    }, 3000)

    document.addEventListener('mouseup', onMouseUp, { once: true })
  }

  function onMouseUp() {
    if (timeout === null) return
    clearTimeout(timeout)
    timeout = null
  }

  onDestroy(() => {
    wakeLock.release()
    if (timeout !== null) clearTimeout(timeout)
  })
</script>

<div class="flex items-center gap-2">
  <div
    class="grid flex-none items-baseline text-right font-mono"
    class:invisible={timeStart === null}>
    <span>{value.minutes}</span>
    <span>{value.seconds}</span>
    <span>{value.milliseconds}</span>
  </div>
  <UiIconbutton
    class="relative color-primary"
    size="lg"
    label="Siguiente ejercicio"
    onclick={onClick}
    onmousedown={onMousedown}>
    <Fa size="lg" icon={timeStart === null ? faPlay : timeout === null ? faArrowRotateBack : faStop}
    ></Fa>
    {#if timeout !== null}
      <svg viewBox="0 0 48 48" class="circular-progress pointer-events-none absolute inset-0">
        <circle class="fg"></circle>
      </svg>
    {/if}
  </UiIconbutton>
</div>

<style lang="postcss">
  span:nth-child(1) {
    @apply h-4 min-w-[4ch] text-xl leading-4;
  }

  span:nth-child(2) {
    @apply h-6 min-w-[2ch] text-4xl font-bold leading-6;
  }

  span:nth-child(3) {
    @apply col-span-3 h-4 text-xs leading-4;
  }

  .circular-progress {
    --size: 48px;
    --half-size: calc(var(--size) / 2);
    --stroke-width: 4px;
    --radius: calc((var(--size) - var(--stroke-width)) / 2);
    --circumference: calc(var(--radius) * pi * 2);
    --dash: calc((var(--progress) * var(--circumference)) / 100);
    animation: progress-animation 3000ms linear 0s 1 forwards;
  }

  .circular-progress circle {
    cx: var(--half-size);
    cy: var(--half-size);
    r: var(--radius);
    stroke-width: var(--stroke-width);
    fill: none;
    stroke-linecap: round;
    transform: rotate(-90deg);
    transform-origin: center;
    stroke-dasharray: var(--dash) calc(var(--circumference) - var(--dash));
    stroke: currentColor;
  }

  @property --progress {
    syntax: '<number>';
    inherits: false;
    initial-value: 0;
  }

  @keyframes progress-animation {
    from {
      --progress: 0;
    }
    to {
      --progress: 100;
    }
  }
</style>
