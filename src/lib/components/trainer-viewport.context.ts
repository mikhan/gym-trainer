import type { Action } from '$lib/types'
import { createContext } from '$lib/utils/create-context'
import { signal, type SignalStore } from '$lib/utils/signal-store'

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

  const actionContexts = new Map<Action, object>()
  const currentAction$ = signal<Action | undefined>()

  trainerViewportContext = {
    currentAction$,
    getActions() {
      return Array.from(actionContexts.keys())
    },
    setCurrentAction(action: Action) {
      currentAction$.set(action)
    },
    addAction(action) {
      actionContexts.set(action, {})
    },
    removeAction(action) {
      actionContexts.delete(action)
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
