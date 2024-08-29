import type { Action } from 'svelte/action'
import { type Writable, writable } from 'svelte/store'

const transitioning: Writable<Set<string>> = writable(new Set())

type StartViewTransitionConfig = {
  update: () => Promise<unknown> | unknown
  types?: string[]
}

export async function startViewTransition({ update, types = [] }: StartViewTransitionConfig) {
  if (!document.startViewTransition) {
    await update()
    return
  }

  transitioning.update((transitions) => transitions.union(new Set(types)))

  const transition = document.startViewTransition({
    update: async () => {
      await update()
    },
    types,
  })

  await transition.finished

  transitioning.update((transitions) => transitions.difference(new Set(types)))
}

type TransitionNameParams = { type: string; name: string }

export const transitionName: Action<HTMLElement, TransitionNameParams> = (element, params) => {
  const unsubscribe = transitioning.subscribe((transitioning) => {
    if (transitioning.has(params.type)) {
      element.style.setProperty('view-transition-name', params.name)
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
