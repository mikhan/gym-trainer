import type { Action } from 'svelte/action'
import { type Readable, writable } from 'svelte/store'

let intersectionObserver: IntersectionObserver | null = null
let currentVisible: { element: HTMLElement | null } = { element: null }
const currentStore = writable(currentVisible)
const targets = new Map<Element, IntersectionObserverEntry>()

function getObserver(): IntersectionObserver {
  return (intersectionObserver ??= new IntersectionObserver(observerCallback, {
    threshold: [0, 1],
  }))
}

function observerCallback(entries: IntersectionObserverEntry[]) {
  for (const entry of entries) targets.set(entry.target, entry)
  updateStore()
}

function updateStore() {
  const intersecting = Array.from(targets.values())
    .filter((entry) => entry.isIntersecting)
    .toSorted((a, b) => b.intersectionRatio - a.intersectionRatio)

  const element = (intersecting.at(0)?.target as HTMLElement) ?? null

  if (currentVisible.element !== element) {
    currentVisible = { element: element }
    currentStore.set(currentVisible)
  }
}

export const currentTocTarget: Readable<{ element: HTMLElement | null }> = {
  subscribe: currentStore.subscribe,
}

export const tocTarget: Action<HTMLElement> = (element) => {
  const observer = getObserver()
  observer.observe(element)

  return {
    destroy() {
      observer.unobserve(element)
      targets.delete(element)
      updateStore()

      if (targets.size === 0) {
        intersectionObserver?.disconnect()
        intersectionObserver = null
      }
    },
  }
}
