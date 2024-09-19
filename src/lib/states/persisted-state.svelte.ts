import { onDestroy } from 'svelte'
import { browser } from '$app/environment'

type StorageType = 'local' | 'session'

const namespace = 'state'

function getStorageArea(type: StorageType) {
  if (!browser) return null

  if (type === 'local') return globalThis.localStorage
  if (type === 'session') return globalThis.sessionStorage

  throw new TypeError(`Unknown storage type '${type}`)
}

export function getPersistedState<T>(type: StorageType, key: string, defaultValue: T): T {
  const storageKey = `${namespace}:${key}`
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
