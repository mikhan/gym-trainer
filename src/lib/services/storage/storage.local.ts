import { browser } from '$app/environment'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Initializer<T> = () => T

export function getItem<T>(name: string): T | undefined
export function getItem<T>(name: string, getInitial: Initializer<T>): T
export function getItem<T>(name: string, getInitial: Initializer<T | undefined>): T | undefined
export function getItem<T>(name: string, getInitial?: Initializer<T>) {
  const rawValue = browser ? window.localStorage.getItem(name) : null
  let value: unknown

  if (typeof rawValue === 'string') {
    value = JSON.parse(rawValue) as T
  } else if (typeof getInitial === 'undefined') {
    value = undefined
  } else {
    value = getInitial() as T
    browser && window.localStorage.setItem(name, JSON.stringify(value))
  }

  // console.log(`getItem(${name})`)
  // console.log(value)
  return value
}

export function setItem<T>(name: string, value: T) {
  // console.log(`setItem(${name})`)
  // console.log(value)
  if (!browser) return

  window.localStorage.setItem(name, JSON.stringify(value))
}

export function getValue<T>(name: string): LocalStorageValue<T | undefined>
export function getValue<T>(name: string, getInitial: Initializer<T>): LocalStorageValue<T>
export function getValue<T>(
  name: string,
  getInitial: Initializer<T | undefined>,
): LocalStorageValue<T | undefined>
export function getValue<T>(name: string, getInitial?: Initializer<T>) {
  return new LocalStorageValue(name, getInitial)
}

class LocalStorageValue<T> {
  private value: T

  constructor(
    readonly name: string,
    getInitial?: Initializer<T>,
  ) {
    const rawValue = browser ? window.localStorage.getItem(name) : null

    if (typeof rawValue === 'string') this.value = JSON.parse(rawValue) as T
    else if (typeof getInitial === 'undefined') this.value = undefined as T
    else this.value = getInitial() as T
  }

  get() {
    return this.value
  }

  set(value: T) {
    window.localStorage.setItem(this.name, JSON.stringify(value))
    this.value = value
  }
}
