import { browser } from '$app/environment'
import { type Readable, writable } from 'svelte/store'

export type WakeLockStatus = 'pending' | 'released' | 'locked' | 'denied'

const wakelock: globalThis.WakeLock | null = (browser && navigator.wakeLock) || null
const { subscribe, ...statusStore } = writable<WakeLockStatus>('released')

let wakelockSentinel: null | globalThis.WakeLockSentinel = null

function onVisibilityChange() {
  if (document.visibilityState === 'visible') request()
}

function onRelease() {
  wakelockSentinel = null
  statusStore.set('released')
}

async function request(): Promise<void> {
  try {
    if (wakelockSentinel && !wakelockSentinel.released) return
    if (!wakelock) throw 'NotAllowedError'

    statusStore.set('pending')

    document.addEventListener('visibilitychange', onVisibilityChange)

    wakelockSentinel = await wakelock.request('screen')
    wakelockSentinel.addEventListener('release', onRelease)

    statusStore.set('locked')
  } catch {
    statusStore.set('denied')
  }
}

async function release() {
  if (!wakelockSentinel) return

  await wakelockSentinel.release()
  document.removeEventListener('visibilitychange', onVisibilityChange)
}

export type WakeLockStore = Readable<WakeLockStatus> & {
  request(): Promise<void>
  release(): Promise<void>
}

export const wakeLock: WakeLockStore = { subscribe, request, release }
