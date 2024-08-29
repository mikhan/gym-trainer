import { browser } from '$app/environment'
import { onDestroy } from 'svelte'

type StorageType = 'local' | 'session'

class PersistedState<T> {
  static readonly namespace = 'state'

  #defaultValue: string

  readonly type: StorageType
  readonly key: string
  value = $state<T>() as T

  constructor(key: string, defaultValue: T, type: StorageType = 'local') {
    this.type = type
    this.key = `${PersistedState.namespace}:${key}`
    this.value = defaultValue
    this.#defaultValue = this.serialize(defaultValue)

    const storage = getStorage(type)
    if (!storage) return

    const storedValue = storage.getItem(this.key)
    if (storedValue) this.value = this.deserialize(storedValue)

    let persistValue = false

    const onStorage = (event: StorageEvent) => {
      if (event.storageArea !== storage) return
      if (event.key !== this.key) return
      persistValue = false
      const newValue = typeof event.newValue === 'string' ? event.newValue : this.#defaultValue
      this.value = this.deserialize(newValue)
    }

    globalThis.addEventListener('storage', onStorage)
    onDestroy(() => globalThis.removeEventListener('storage', onStorage))

    $effect(() => {
      const value = $state.snapshot(this.value)
      if (persistValue) storage.setItem(this.key, this.serialize(value))
      else persistValue = true
    })
  }

  serialize(value: T): string {
    return JSON.stringify(value)
  }

  deserialize(item: string): T {
    return JSON.parse(item)
  }
}

export class LocalStorageState<T> extends PersistedState<T> {
  constructor(key: string, defaultValue: T) {
    super(key, defaultValue, 'local')
  }
}

export class SessionStorageState<T> extends PersistedState<T> {
  constructor(key: string, defaultValue: T) {
    super(key, defaultValue, 'session')
  }
}

function getStorage(type: StorageType) {
  if (!browser) return null

  if (type === 'local') return globalThis.localStorage
  if (type === 'session') return globalThis.sessionStorage

  throw new TypeError(`Unknown storage type '${type}`)
}
