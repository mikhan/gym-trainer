<script lang="ts">
  import UiCircularProgress from './UiCircularProgress.svelte'

  import Fa from 'svelte-fa'
  import {
    faArrowRotateBack,
    faClockRotateLeft,
    faPause,
    faPlay,
  } from '@fortawesome/free-solid-svg-icons'
  import UiIconbutton from '$lib/components/ui/ui-iconbutton.svelte'
  import { onDestroy } from 'svelte'
  import { wakeLock } from '$lib/stores/wakelock.store'
  import { longpress } from '$lib/actions/longpress.action'
  import UiPopup from '$lib/components/ui/ui-popup.svelte'
  import clsx from 'clsx'

  type Time = { start: number; duration: number }
  type State = 'stopped' | 'playing' | 'paused'

  const pausePressDuration = 1000
  const history: Time[] = $state([])
  const defaultValue = {
    minutes: '0',
    seconds: '00',
    milliseconds: '000',
  }

  let currentTime: Time | undefined = $state()
  let status: State = $state('stopped')
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
    if (status !== 'playing') return
    if (currentTime) currentTime.duration = performance.now() - currentTime.start
    requestAnimationFrame(calculate)
  }

  function formatTime(timestamp: number) {
    timestamp = ~~(timestamp / 1000)
    const minutes = ~~(timestamp / 60)
    const seconds = timestamp % 60
    return minutes.toString() + ':' + seconds.toString().padStart(2, '0')
  }

  function start() {
    if (status === 'playing' && currentTime) {
      history.push(currentTime)
    }

    if (status === 'paused' && currentTime) {
      currentTime.start += performance.now() - (currentTime.start + currentTime.duration)
    } else {
      currentTime = { start: performance.now(), duration: 0 }
    }

    status = 'playing'
    wakeLock.request()
    requestAnimationFrame(calculate)
  }

  function pause() {
    if (status !== 'playing') return
    status = 'paused'
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
    {#if history.length > 0}
      <UiIconbutton id="trainer-timer-history-button" label="Historial de tiempos">
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
    {/if}
  </div>
  <div
    class={clsx(
      'grid h-full content-end items-end text-right font-mono',
      status === 'paused' && 'animate-paused',
    )}>
    <span class="h-4 min-w-[4ch] text-xl leading-4" class:opacity-50={value.minutes === '0'}
      >{value.minutes}:</span>
    <span class="h-6 min-w-[2ch] text-4xl font-bold leading-6">{value.seconds}</span>
    <span class="col-span-3 h-4 text-xs leading-4">{value.milliseconds}</span>
  </div>
  <UiIconbutton
    class="relative color-primary"
    size="lg"
    label={currentTime ? 'Reiniciar temporizador' : 'Iniciar temporizador'}
    onclick={() => {
      start()
    }}
    onpointerdown={() => {
      pressing = status === 'playing'
    }}>
    <Fa size="lg" icon={status !== 'playing' ? faPlay : pressing ? faPause : faArrowRotateBack}
    ></Fa>
    <div
      class={clsx(
        'absolute -inset-2 opacity-0 transition-opacity delay-100',
        pressing && 'opacity-100',
      )}
      use:longpress={pausePressDuration}
      onlongpress={() => {
        pause()
        pressing = false
      }}>
      <UiCircularProgress
        class={clsx('size-full', !pressing && 'hidden')}
        duration={`${pausePressDuration}ms`}
        stroke={16}></UiCircularProgress>
    </div>
  </UiIconbutton>
</div>

<style lang="postcss">
  .animate-paused {
    animation: paused 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes paused {
    50% {
      opacity: 0;
    }
  }
</style>
