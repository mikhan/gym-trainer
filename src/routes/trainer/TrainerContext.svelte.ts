import { set } from 'es-toolkit/compat'
import { getContext, setContext } from 'svelte'
import { getPersistedState } from '$lib/states/persisted-state.svelte'

export type TrainerContextStateUnset = {
  status: 'unset'
  training: null
  currentRoutineIndex: null
  currentRoutine: null
  currentSerieIndex: null
  currentSerie: null
  records: null
}

export type TrainerContextStateRunning = {
  status: 'running'
  training: Types.Training
  currentRoutineIndex: number
  currentRoutine: Types.Routine
  currentSerieIndex: number
  currentSerie: Types.RoutineSerie
  records: Types.TrainerRecords
}

export type TrainerContextStateCompleted = {
  status: 'completed'
  training: Types.Training
  currentRoutineIndex: number
  currentRoutine: Types.Routine
  currentSerieIndex: null
  currentSerie: null
  records: Types.TrainerRecords
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

  readonly #state = getPersistedState<TrainerContextState>('local', 'TrainerContext.state', {
    status: 'unset',
    training: null,
    currentRoutineIndex: null,
    currentSerieIndex: null,
    records: null,
  })

  state = $derived.by(() => {
    let currentRoutine: Types.Routine | null = null
    let currentSerie: Types.RoutineSerie | null = null

    const { status, training, currentRoutineIndex, currentSerieIndex } = this.#state

    switch (status) {
      case 'completed':
        currentRoutine = training.routines[currentRoutineIndex] || null
        if (!currentRoutine) throw new TypeError(`Invalid routine index '${currentRoutineIndex}'.`)
        return { ...this.#state, currentRoutine, currentSerie }

      case 'running':
        currentRoutine = training.routines[currentRoutineIndex] || null
        if (!currentRoutine) throw new TypeError(`Invalid routine index '${currentRoutineIndex}'.`)
        currentSerie = currentRoutine.series[currentSerieIndex] || null
        if (!currentSerie) throw new TypeError(`Invalid serie index '${currentSerieIndex}'.`)
        return { ...this.#state, currentRoutine, currentSerie }

      default:
        return { ...this.#state, currentRoutine, currentSerie }
    }
  })

  private constructor() {}

  startTraining(training: Types.Training, currentRoutineIndex: number, currentSerieIndex = 0) {
    console.log('startTraining')
    const routine = training.routines[currentRoutineIndex]
    if (!routine) throw new TypeError(`Invalid routine index '${currentRoutineIndex}'.`)
    const serie = routine.series[currentSerieIndex]
    if (!serie) throw new TypeError(`Invalid serie index '${currentSerieIndex}'.`)

    Object.assign(this.#state, {
      status: 'running',
      training,
      currentRoutineIndex,
      currentSerieIndex,
      records: {},
    })
  }

  terminateTraining() {
    if (this.#state.status === 'running')
      Object.assign(this.#state, {
        ...this.#state,
        status: 'completed',
        currentSerieIndex: null,
      })
  }

  clearTraining() {
    Object.assign(this.#state, {
      status: 'unset',
      training: null,
      currentRoutineIndex: null,
      currentSerieIndex: null,
      records: null,
    })
  }

  getSerie(serieIndex: number): Types.RoutineSerie {
    if (this.state.status === 'unset') throw new Error(`Training is not defined.`)

    const serie = this.state.currentRoutine.series[serieIndex]
    if (!serie) throw new Error(`Undefined serie index ${serieIndex}.`)

    return serie
  }

  getStep(serieIndex: number, stepIndex: number): Types.RoutineStep {
    const serie = this.getSerie(serieIndex)
    const step = serie.steps[stepIndex]
    if (!step) {
      console.log($state.snapshot(serie))
      throw new Error(`Undefined step ${stepIndex} of ${serie.steps.length}.`)
    }

    return step
  }

  setCurrentSerieIndex(indexOrId: number) {
    if (this.state.status !== 'running') return

    this.#state.currentSerieIndex = indexOrId
  }

  updateSerieNotes(serieIndex: number, value: string) {
    if (this.#state.status !== 'running') return

    set(
      this.#state,
      `training.routines.${this.#state.currentRoutineIndex}.series.${serieIndex}.notes`,
      value,
    )
  }

  setStepWeight(serieIndex: number, stepIndex: number, weight: Types.Weight) {
    if (this.#state.status !== 'running') return
    set(
      this.#state,
      `training.routines.${this.#state.currentRoutineIndex}.series.${serieIndex}.steps.${stepIndex}.weight`,
      weight,
    )
  }

  setRecord(serieIndex: number, stepIndex: number, step: Types.TrainerRecord) {
    if (this.#state.status !== 'running') return
    const serie = this.getSerie(serieIndex)
    this.#state.records[serie.id] ??= {}
    const records = this.#state.records[serie.id] ?? {}
    records[stepIndex] = step
    this.#state.records[serie.id] = records
  }

  deleteRecord(serieIndex: number, stepIndex: number) {
    if (this.#state.status !== 'running') return
    const serie = this.getSerie(serieIndex)
    const records = this.#state.records[serie.id]

    if (!records) return

    if (Object.keys(records).length === 1) {
      delete this.#state.records[serie.id]
    } else {
      delete records[stepIndex]
    }
  }
}
