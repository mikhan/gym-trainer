import type { Action } from '$lib/types'
import { createContext } from '$lib/utils/create-context'
import { type SignalStore, signal } from '$lib/utils/signal-store'

export interface TrainerViewportContext {
  currentAction$: SignalStore<Action | undefined>
  setCurrentAction: (action: Action) => void
  getActions: () => Action[]
  addAction: (action: Action) => void
  removeAction: (action: Action) => void
}

export interface TrainerActionContext {
  action: Action
  isActive$: SignalStore<boolean>
}

export const [getTrainerViewportContext, setTrainerViewportContext] =
  createContext<TrainerViewportContext>()

let trainerViewportContext: TrainerViewportContext | null = null

export function createTrainerViewportContext(): TrainerViewportContext {
  if (trainerViewportContext) return trainerViewportContext

  const actionContexts: Action[] = []
  const currentAction$ = signal<Action | undefined>()

  trainerViewportContext = {
    currentAction$,
    getActions() {
      return actionContexts
    },
    setCurrentAction(action: Action) {
      currentAction$.set(action)
    },
    addAction(action) {
      actionContexts.push(action)

      if (typeof currentAction$.get() === 'undefined') {
        currentAction$.set(action)
      }
    },
    removeAction(action) {
      const index = actionContexts.indexOf(action)
      actionContexts.splice(index, 1)

      if (currentAction$.get() === action) {
        currentAction$.set(actionContexts[index])
      }
    },
  }

  return trainerViewportContext
}

export function createTrainerActionContext(action: Action): TrainerActionContext {
  const isActive$ = signal<boolean>(false)

  return {
    isActive$,
    action,
  }
}
