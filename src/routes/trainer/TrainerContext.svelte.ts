import { set } from 'es-toolkit/compat'
import { getContext, setContext } from 'svelte'
import { getLocalState } from '$lib/states/persisted-state.svelte'

export type TrainerContextStateUnset = {
  status: 'unset'
  training: null
  currentRoutineIndex: null
  currentRoutine: null
  currentSerieIndex: null
  currentSerie: null
}

export type TrainerContextStateRunning = {
  status: 'running'
  training: Types.Training
  currentRoutineIndex: number
  currentRoutine: Types.Routine
  currentSerieIndex: number
  currentSerie: Types.RoutineSerie
}

export type TrainerContextStateCompleted = {
  status: 'completed'
  training: Types.Training
  currentRoutineIndex: number
  currentRoutine: Types.Routine
  currentSerieIndex: null
  currentSerie: null
}

type TrainerContextState =
  | Omit<TrainerContextStateUnset, 'currentRoutine' | 'currentSerie'>
  | Omit<TrainerContextStateRunning, 'currentRoutine' | 'currentSerie'>
  | Omit<TrainerContextStateCompleted, 'currentRoutine' | 'currentSerie'>

export class TrainerContext {
  static getContext() {
    return getContext<TrainerContext>(TrainerContext)
  }

  static setContext() {
    return setContext(TrainerContext, new TrainerContext())
  }

  #state = getLocalState<TrainerContextState>('TrainerContext.state', {
    status: 'unset',
    training: null,
    currentRoutineIndex: null,
    currentSerieIndex: null,
  })

  state = $derived.by(() => {
    let currentRoutine: Types.Routine | null = null
    let currentSerie: Types.RoutineSerie | null = null

    const { status, training, currentRoutineIndex, currentSerieIndex } = this.#state.value

    switch (status) {
      case 'completed':
        currentRoutine = training.routines[currentRoutineIndex] || null
        if (!currentRoutine) throw new TypeError(`Invalid routine index '${currentRoutineIndex}'.`)
        return { ...this.#state.value, currentRoutine, currentSerie }

      case 'running':
        currentRoutine = training.routines[currentRoutineIndex] || null
        if (!currentRoutine) throw new TypeError(`Invalid routine index '${currentRoutineIndex}'.`)
        currentSerie = currentRoutine.series[currentSerieIndex] || null
        if (!currentSerie) throw new TypeError(`Invalid serie index '${currentSerieIndex}'.`)
        return { ...this.#state.value, currentRoutine, currentSerie }

      default:
        return { ...this.#state.value, currentRoutine, currentSerie }
    }
  })

  private constructor() {}

  startTraining(training: Types.Training, currentRoutineIndex: number, currentSerieIndex = 0) {
    const routine = training.routines[currentRoutineIndex]
    if (!routine) throw new TypeError(`Invalid routine index '${currentRoutineIndex}'.`)
    const serie = routine.series[currentSerieIndex]
    if (!serie) throw new TypeError(`Invalid serie index '${currentSerieIndex}'.`)

    this.#state.value = {
      status: 'running',
      training,
      currentRoutineIndex,
      currentSerieIndex,
    }
  }

  terminateTraining() {
    if (this.#state.value.status === 'running')
      this.#state.value = {
        ...this.#state.value,
        status: 'completed',
        currentSerieIndex: null,
      }
  }

  clearTraining() {
    this.#state.value = {
      status: 'unset',
      training: null,
      currentRoutineIndex: null,
      currentSerieIndex: null,
    }
  }

  setCurrentSerieIndex(indexOrId: number) {
    if (this.state.status !== 'running') return

    this.#state.value.currentSerieIndex = indexOrId
  }

  updateSerieNotes(serieIndex: number, value: string) {
    if (this.#state.value.status !== 'running') return

    set(
      this.#state.value.training,
      `routines.${this.#state.value.currentRoutineIndex}.series.${serieIndex}.notes`,
      value,
    )
  }

  setStepWeight(serieIndex: number, stepIndex: number, weight: Types.Weight) {
    if (this.#state.value.status !== 'running') return
    set(
      this.#state.value.training,
      `routines.${this.#state.value.currentRoutineIndex}.series.${serieIndex}.steps.${stepIndex}.weight`,
      weight,
    )
    // const routine = this.#state.value.training.routines[this.#state.value.currentRoutineIndex]
    // if (!routine) return
    // const serie = routine.series[serieIndex]
    // if (!serie) throw new TypeError(`Invalid serie id '${serieIndex}'.`)
    // const step = serie.steps[stepIndex]
    // if (step) step.weight = weight
  }
}
