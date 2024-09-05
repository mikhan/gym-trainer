import { browser } from '$app/environment'
import { onDestroy } from 'svelte'

type StorageType = 'local' | 'session'

class PersistedState<T> {
  static readonly namespace = 'state'

  #defaultValue: string

  readonly type: StorageType
  readonly key: string
  value = $state<T>() as T

  constructor(key: string, defaultValue: T, type: StorageType) {
    this.type = type
    this.key = `${PersistedState.namespace}:${key}`
    this.value = defaultValue
    this.#defaultValue = serialize(defaultValue)

    let initialized = false

    const storageArea = getStorageArea(type)
    if (!storageArea) return

    const storedValue = storageArea.getItem(this.key)
    if (storedValue) this.value = deserialize(storedValue)

    let persistValue = false

    const onStorage = (event: StorageEvent) => {
      if (event.storageArea !== storageArea) return
      if (event.key !== this.key) return
      persistValue = false
      const newValue = typeof event.newValue === 'string' ? event.newValue : this.#defaultValue
      this.value = deserialize(newValue)
    }

    const abortController = new AbortController()
    window.addEventListener('storage', onStorage, { signal: abortController.signal })
    onDestroy(() => abortController.abort())

    $effect(() => {
      // if (key === 'TrainerContext.state') {
      //   console.group('TrainerContext $effect() {...}')
      //   console.log(`  initialized`, initialized)
      //   console.log(`  persistValue`, persistValue)
      //   console.log('  this.value', $state.snapshot(this.value))
      //   console.groupEnd()
      // }

      if (initialized && persistValue) {
        storageArea.setItem(this.key, serialize(this.value))
      }

      persistValue = true
      initialized = true
    })
  }
}

class LocalStorageState<T> extends PersistedState<T> {
  constructor(key: string, defaultValue: T) {
    super(key, defaultValue, 'local')
  }
}

class SessionStorageState<T> extends PersistedState<T> {
  constructor(key: string, defaultValue: T) {
    super(key, defaultValue, 'session')
  }
}

function getStorageArea(type: StorageType) {
  if (!browser) return null

  if (type === 'local') return globalThis.localStorage
  if (type === 'session') return globalThis.sessionStorage

  throw new TypeError(`Unknown storage type '${type}`)
}

export function getLocalState<T>(key: string, defaultValue: T): LocalStorageState<T> {
  return new LocalStorageState(key, defaultValue)
}

export function getSessionState<T>(key: string, defaultValue: T): SessionStorageState<T> {
  return new SessionStorageState(key, defaultValue)
}

export function getPersistedState<T>(type: StorageType, key: string, defaultValue: T): T {
  const storageKey = `${PersistedState.namespace}:${key}`
  let value = $state(defaultValue)
  const initialValue = serialize(defaultValue)

  let initialized = false

  const storageArea = getStorageArea(type)
  if (!storageArea) return value

  const storedValue = storageArea.getItem(storageKey)
  if (storedValue) value = deserialize(storedValue)

  let persistValue = false

  const onStorage = (event: StorageEvent) => {
    if (event.storageArea !== storageArea) return
    if (event.key !== storageKey) return
    persistValue = false
    const newValue = typeof event.newValue === 'string' ? event.newValue : initialValue
    value = deserialize(newValue)
  }

  const abortController = new AbortController()
  window.addEventListener('storage', onStorage, { signal: abortController.signal })
  onDestroy(() => abortController.abort())

  $effect(() => {
    // if (key === 'TrainerContext.state') {
    //   console.group('TrainerContext $effect() {...}')
    //   console.log(`  initialized`, initialized)
    //   console.log(`  persistValue`, persistValue)
    //   console.log('  this.value', $state.snapshot(value))
    //   console.groupEnd()
    // }

    const newValue = serialize(value)

    if (initialized && persistValue) {
      storageArea.setItem(storageKey, newValue)
    }

    persistValue = true
    initialized = true
  })

  return value
}

function serialize<T>(value: T): string {
  return JSON.stringify(value)
}

function deserialize<T>(item: string): T {
  return JSON.parse(item)
}
