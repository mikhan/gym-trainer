<script lang="ts">
  import { faArrowRotateBack, faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
  import clsx from 'clsx'
  import { onMount } from 'svelte'
  import Fa from 'svelte-fa'
  import { longpress } from '$lib/actions/longpress.action'
  import UiCircularProgress from '$lib/components/ui/UiCircularProgress.svelte'
  import UiIconbutton from '$lib/components/ui/UiIconbutton.svelte'
  import { wakeLock } from '$lib/stores/wakelock.store'
  import { TrainerContext, type TrainerContextStateRunning } from './TrainerContext.svelte'

  type Props = {
    state: TrainerContextStateRunning
  }

  const { state: trainerContextState }: Props = $props()
  const pausePressDuration = 1000
  const trainerContext = TrainerContext.getContext()
  const timer: Utils.DeepReadonly<Types.TimePlayer> = $derived(trainerContextState.timer)
  const defaultTimeParts = {
    hours: '',
    minutes: '0:',
    seconds: '00',
    milliseconds: '000',
  }

  let currentTime = $state() as { start: number; duration: number } | undefined
  let pressing = $state(false)
  let timeParts = $state({ ...defaultTimeParts })

  $effect(() => {
    if (currentTime) updateParts(currentTime.duration)
  })

  const pad = (value: number) => String(value).padStart(2, '0')
  function updateParts(timestamp: number) {
    const duration = ~~(timestamp / 1000)
    const milliseconds = ~~((timestamp % 1000) / 10)
    const seconds = ~~(duration % 60)
    const minutes = ~~(duration / 60) % 60
    const hours = ~~(duration / 60 / 60)
    timeParts.milliseconds = pad(milliseconds)
    timeParts.seconds = pad(seconds)
    if (minutes) timeParts.minutes = `${hours ? pad(minutes) : minutes}:`
    if (hours) timeParts.hours = `${hours}:`
  }

  function play() {
    if (timer.status === 'stopped') {
      trainerContext.startPlayer(trainerContextState.currentSerie.name)
    } else if (timer.status === 'playing') {
      trainerContext.restartPlayer(trainerContextState.currentSerie.name)
    } else {
      trainerContext.resumePlayer()
    }

    startTimer()
  }

  function pause() {
    if (timer.status !== 'playing') return
    trainerContext.pausePlayer()
    wakeLock.release()
  }

  function startTimer() {
    const start = timer.currentTime?.start

    if (start) {
      const pauseTime = timer.pauseTime
      const duration = pauseTime ? pauseTime - start : Date.now() - start
      currentTime = { start, duration }
      timeParts = { ...defaultTimeParts }
      wakeLock.request()
      requestAnimationFrame(recalculateDuration)
    }

    function recalculateDuration() {
      if (!currentTime || timer.status !== 'playing') return
      currentTime.duration = ~~(Date.now() - currentTime.start)
      requestAnimationFrame(recalculateDuration)
    }
  }

  onMount(() => {
    startTimer()

    return () => wakeLock.release()
  })
</script>

<svelte:document on:mouseup={() => (pressing = false)} />

<div class="grid grid-cols-[auto,3rem] items-center gap-2 rounded-full p-1 color-neutral surface">
  {#key timeParts}
    <div
      class="grid h-full content-end items-end pl-2 text-right font-mono"
      class:animate-paused={timer.status === 'paused'}>
      <span class="h-4 w-[3ch] text-xl/4">{timeParts.hours}</span>
      <span class="h-6 w-[3ch] text-3xl/6">{timeParts.minutes}</span>
      <span class="h-6 text-3xl/6">{timeParts.seconds}</span>
      <span class="col-span-3 h-4 text-base/4">{timeParts.milliseconds}</span>
    </div>
  {/key}
  <UiIconbutton
    class={clsx('relative', timer.status === 'playing' ? 'color-secondary' : 'color-primary')}
    filled
    size="lg"
    label={currentTime ? 'Reiniciar cronómetro' : 'Iniciar cronómetro'}
    onclick={() => play()}
    onpointerdown={() => {
      pressing = timer.status === 'playing'
    }}
    onpointerup={() => (pressing = false)}
    onpointercancel={() => (pressing = false)}>
    <Fa
      size="lg"
      icon={timer.status !== 'playing' ? faPlay : pressing ? faPause : faArrowRotateBack}></Fa>
    <div
      class="absolute inset-0"
      use:longpress={pausePressDuration}
      onlongpress={() => {
        pause()
        pressing = false
      }}>
      <div
        class={clsx(
          'pointer-events-none fixed inset-0 grid place-content-center bg-black/50 transition-opacity sm:absolute sm:-inset-2 sm:bg-transparent',
          pressing ? 'opacity-100 delay-200' : 'opacity-0 delay-0',
        )}>
        <div
          class="flex flex-col items-center gap-4 rounded-card p-4 shadow-over color-canvas surface sm:contents"
          class:hidden={!pressing}>
          <UiCircularProgress
            class={clsx('size-24 color-secondary sm:size-full', !pressing && 'hidden')}
            duration={`${pausePressDuration}ms`}
            stroke={16}></UiCircularProgress>
          <div class="text-base/4 sm:hidden">Pausar cronómetro</div>
        </div>
      </div>
    </div>
  </UiIconbutton>
</div>

<style lang="postcss">
  .animate-paused {
    animation-name: --intermitent;
    animation-duration: 1s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  @keyframes --intermitent {
    0% {
      opacity: 1;
    }
    60% {
      opacity: 1;
    }
    70% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }
</style>
