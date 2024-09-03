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
    let initialized = false
    key = `${PersistedState.namespace}:${key}`

    this.type = type
    this.key = key
    this.value = defaultValue
    this.#defaultValue = this.serialize(defaultValue)

    const storageArea = getStorageArea(type)
    if (!storageArea) return

    const storedValue = storageArea.getItem(this.key)
    if (storedValue) this.value = this.deserialize(storedValue)

    let persistValue = false

    const onStorage = (event: StorageEvent) => {
      if (event.storageArea !== storageArea) return
      if (event.key !== this.key) return
      persistValue = false
      const newValue = typeof event.newValue === 'string' ? event.newValue : this.#defaultValue
      this.value = this.deserialize(newValue)
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
        storageArea.setItem(this.key, this.serialize(this.value))
      }

      persistValue = true
      initialized = true
    })
  }

  private serialize(value: T): string {
    return JSON.stringify(value)
  }

  private deserialize(item: string): T {
    return JSON.parse(item)
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
