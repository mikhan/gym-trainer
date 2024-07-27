import { type Writable, writable } from 'svelte/store'

export interface SignalStore<T> extends Writable<T> {
  get: () => T
}

export function signal<T>(initialValue?: T): SignalStore<T> {
  let value = initialValue as T
  const { set, subscribe } = writable(value)

  return {
    get: () => {
      return value
    },
    set: (newValue) => {
      value = newValue
      set(value)
    },
    update: (updater) => {
      value = updater(value)
      set(value)
    },
    subscribe,
  }
}
