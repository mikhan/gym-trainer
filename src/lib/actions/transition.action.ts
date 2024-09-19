import type { Action } from 'svelte/action'
import { writable, type Writable } from 'svelte/store'

const transitioning: Writable<Set<string>> = writable(new Set())

type StartViewTransitionUpdater = () => Promise<unknown> | unknown
type StartViewTransitionConfig =
  | StartViewTransitionUpdater
  | { update: StartViewTransitionUpdater; types?: string[] }

let transition: ViewTransition | null = null

export async function startViewTransition(config: StartViewTransitionConfig) {
  const update = typeof config === 'object' ? config.update : config
  const types = (typeof config === 'object' && config.types) || ['root']

  if (!document.startViewTransition) {
    await update()
    return
  }

  if (transition) transition.skipTransition()

  transitioning.update((transitions) => transitions.union(new Set(types)))

  transition = document.startViewTransition({
    update: async () => {
      await update()
    },
    types,
  })

  await transition.finished
  transition = null

  transitioning.update((transitions) => transitions.difference(new Set(types)))
}

type TransitionNameParams = string | { name: string; type: string }

export const viewTransitionName: Action<HTMLElement, TransitionNameParams> = (
  element,
  params: TransitionNameParams,
) => {
  const { type, name } = typeof params === 'string' ? { type: 'root', name: params } : params

  const unsubscribe = transitioning.subscribe((transitioning) => {
    if (transitioning.has(type)) {
      element.style.setProperty('view-transition-name', name)
    } else {
      element.style.removeProperty('view-transition-name')
    }
  })

  return {
    destroy() {
      unsubscribe()
    },
  }
}

type TransitionClassParams = string | { class: string; type: string }

export const viewTransitionClass: Action<HTMLElement, TransitionClassParams> = (
  element,
  params: TransitionClassParams,
) => {
  const { type, class: className } =
    typeof params === 'string' ? { type: 'root', class: params } : params

  const unsubscribe = transitioning.subscribe((transitioning) => {
    if (transitioning.has(type)) {
      element.style.setProperty('view-transition-class', className)
    } else {
      element.style.removeProperty('view-transition-class')
    }
  })

  return {
    destroy() {
      unsubscribe()
    },
  }
}
