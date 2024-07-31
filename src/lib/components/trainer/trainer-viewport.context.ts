import { createContext } from '$lib/utils/create-context'
import { type SignalStore, signal } from '$lib/utils/signal-store'

export interface TrainerViewportContext {
  currentAction$: SignalStore<Types.Action | undefined>
  setCurrentAction: (action: Types.Action) => void
  getActions: () => Types.Action[]
  addAction: (action: Types.Action) => void
  removeAction: (action: Types.Action) => void
}

export interface TrainerActionContext {
  action: Types.Action
  isActive$: SignalStore<boolean>
}

export const [getTrainerViewportContext, setTrainerViewportContext] =
  createContext<TrainerViewportContext>()

let trainerViewportContext: TrainerViewportContext | null = null

export function createTrainerViewportContext(): TrainerViewportContext {
  if (trainerViewportContext) return trainerViewportContext

  const actionContexts: Types.Action[] = []
  const currentAction$ = signal<Types.Action | undefined>()

  trainerViewportContext = {
    currentAction$,
    getActions() {
      return actionContexts
    },
    setCurrentAction(action: Types.Action) {
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

export function createTrainerActionContext(action: Types.Action): TrainerActionContext {
  const isActive$ = signal<boolean>(false)

  return {
    isActive$,
    action,
  }
}
