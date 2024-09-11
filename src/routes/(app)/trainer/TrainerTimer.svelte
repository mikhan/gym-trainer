<script lang="ts">
  import Fa from 'svelte-fa'
  import { faArrowRotateBack, faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
  import UiIconbutton from '$lib/components/ui/ui-iconbutton.svelte'
  import UiCircularProgress from '$lib/components/ui/UiCircularProgress.svelte'
  import { onDestroy } from 'svelte'
  import { wakeLock } from '$lib/stores/wakelock.store'
  import { longpress } from '$lib/actions/longpress.action'
  import clsx from 'clsx'

  type Time = { start: number; duration: number }
  type State = 'stopped' | 'playing' | 'paused'
  type Props = {
    pausePressDuration?: number
    ontime?: (time: Time) => void
  }

  const { pausePressDuration = 1000, ontime }: Props = $props()

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
    if (currentTime) currentTime.duration = ~~(performance.now() - currentTime.start)
    requestAnimationFrame(calculate)
  }

  function start() {
    if (status === 'playing' && currentTime) {
      history.push(currentTime)
      ontime?.(currentTime)
    }

    if (status === 'paused' && currentTime) {
      currentTime.start += performance.now() - (currentTime.start + currentTime.duration)
    } else {
      value = { ...defaultValue }
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

<svelte:document
  on:mouseup={() => {
    pressing = false
  }} />

<div class="grid grid-cols-[auto,3rem] items-center gap-2 rounded-full p-1 color-neutral surface">
  {#key value}
    <div
      class="grid h-full content-end items-end pl-2 text-right font-mono"
      class:animate-paused={status === 'paused'}>
      <span class="h-6 w-[4ch] text-3xl/6">{value.minutes}:</span>
      <span class="h-6 w-[2ch] text-3xl/6">{value.seconds}</span>
      <span class="col-span-2 h-4 text-base/4">{value.milliseconds}</span>
    </div>
  {/key}
  <UiIconbutton
    class="relative color-primary"
    size="lg"
    label={currentTime ? 'Reiniciar cronómetro' : 'Iniciar cronómetro'}
    onclick={() => start()}
    onpointerdown={() => {
      pressing = status === 'playing'
    }}
    onpointerup={() => (pressing = false)}
    onpointercancel={() => (pressing = false)}>
    <Fa size="lg" icon={status !== 'playing' ? faPlay : pressing ? faPause : faArrowRotateBack}
    ></Fa>
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
            class={clsx('size-24 color-primary sm:size-full', !pressing && 'hidden')}
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
