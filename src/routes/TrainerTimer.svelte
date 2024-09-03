<script lang="ts">
  import Fa from 'svelte-fa'
  import {
    faArrowRotateBack,
    faClockRotateLeft,
    faPlay,
    faStop,
  } from '@fortawesome/free-solid-svg-icons'
  import UiIconbutton from '$lib/components/ui/ui-iconbutton.svelte'
  import { onDestroy } from 'svelte'
  import { wakeLock } from '$lib/stores/wakelock.store'
  import { longpress } from '$lib/actions/longpress.action'
  import UiPopup from '$lib/components/ui/ui-popup.svelte'

  type Time = { start: number; duration: number }

  const history: Time[] = $state(
    // Array.from({ length: 20 }, () => ({ start: 0, duration: ~~(Math.random() * 500) * 1000 })),
    [],
  )
  const defaultValue = {
    minutes: '0',
    seconds: '00',
    milliseconds: '000',
  }

  let currentTime: Time | undefined = $state()
  let running = $state(false)
  let pressing = $state(false)
  let value = $state({ ...defaultValue })

  $effect(() => {
    if (currentTime) update(currentTime.duration)
  })

  function update(timestamp: number) {
    const duration = ~~(timestamp / 1000)

    value.milliseconds = String(~~((timestamp % 1000) / 10)).padStart(2, '0')
    value.seconds = String(~~duration % 60).padStart(2, '0')
    if (duration >= 60) value.minutes = String(~~(duration / 60))
  }

  function calculate() {
    if (!currentTime) return
    currentTime.duration = performance.now() - currentTime.start
    requestAnimationFrame(calculate)
  }

  function formatTime(timestamp: number) {
    timestamp = ~~(timestamp / 1000)
    const minutes = ~~(timestamp / 60)
    const seconds = timestamp % 60
    return minutes.toString() + ':' + seconds.toString().padStart(2, '0')
  }

  function start() {
    running = true

    if (currentTime) {
      history.push(currentTime)
    }

    value = { ...defaultValue }
    currentTime = { start: performance.now(), duration: 0 }
    wakeLock.request()
    requestAnimationFrame(calculate)
  }

  function stop() {
    if (!running) return
    if (currentTime) history.push(currentTime)
    running = false
    currentTime = undefined
    wakeLock.release()
  }

  onDestroy(() => {
    wakeLock.release()
  })
</script>

<svelte:document onmouseup={() => (pressing = false)} />

<div
  class="grid grid-cols-[3rem,auto,3rem] items-center gap-2 rounded-full p-1 color-neutral surface">
  <div class="grid place-content-center">
    <UiIconbutton
      id="trainer-timer-history-button"
      disabled={history.length === 0}
      label="Historial de tiempos">
      <Fa icon={faClockRotateLeft}></Fa>
    </UiIconbutton>
    <UiPopup class="w-40" target="trainer-timer-history-button">
      <div class="flex max-h-80 flex-col">
        <div class="mb-4 p-4 pb-0 text-center font-bold">Historial</div>
        <ul
          class="grid grow grid-cols-[auto,auto] justify-between gap-x-4 overflow-auto p-4 pt-0 text-right font-mono scrollbar-thin">
          {#each history as { duration }, index}
            <li class="col-span-2 grid grid-cols-subgrid">
              <span>{index + 1}</span>
              <time>{formatTime(duration)}</time>
            </li>
          {/each}
        </ul>
      </div>
    </UiPopup>
  </div>
  <div
    class="grid h-full content-end items-end text-right font-mono"
    class:invisible={currentTime === null}>
    <span class="h-4 min-w-[4ch] text-xl leading-4" class:opacity-50={value.minutes === '0'}
      >{value.minutes}:</span>
    <span class="h-6 min-w-[2ch] text-4xl font-bold leading-6">{value.seconds}</span>
    <span class="col-span-3 h-4 text-xs leading-4">{value.milliseconds}</span>
  </div>
  <UiIconbutton
    class="relative color-primary"
    size="lg"
    label={currentTime ? 'Reiniciar temporizador' : 'Iniciar temporizador'}
    onmousedown={() => (pressing = running && true)}
    onclick={() => start()}>
    <Fa size="lg" icon={!running ? faPlay : pressing ? faStop : faArrowRotateBack}></Fa>
    <div class="absolute inset-0" use:longpress={3000} onlongpress={() => stop()}>
      <svg
        viewBox="0 0 48 48"
        class="circular-progress pointer-events-none"
        class:hidden={!pressing}>
        <circle class="fg"></circle>
      </svg>
    </div>
  </UiIconbutton>
</div>

<style lang="postcss">
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
