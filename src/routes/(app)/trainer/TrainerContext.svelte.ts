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
  currentSerieCompleted: null
  records: null
  progress: null
  timer: null
}

export type TrainerContextStateRunning = {
  status: 'running'
  training: Types.Training
  currentRoutineIndex: number
  currentRoutine: Types.Routine
  currentSerieIndex: number
  currentSerie: Types.RoutineSerie
  currentSerieCompleted: boolean
  records: Types.TrainerRecords
  progress: Types.TrainerProgress
  timer: Types.TimePlayer
}

export type TrainerContextStateCompleted = {
  status: 'completed'
  training: Types.Training
  currentRoutineIndex: number
  currentRoutine: Types.Routine
  currentSerieIndex: null
  currentSerie: null
  currentSerieCompleted: null
  records: Types.TrainerRecords
  progress: Types.TrainerProgress
  timer: Types.TimePlayer
}

export type TrainerContextState =
  | TrainerContextStateUnset
  | TrainerContextStateRunning
  | TrainerContextStateCompleted

type DerivedProps = 'currentRoutine' | 'currentSerie' | 'currentSerieCompleted' | 'progress'

type PersistedState =
  | Omit<TrainerContextStateUnset, DerivedProps>
  | Omit<TrainerContextStateRunning, DerivedProps>
  | Omit<TrainerContextStateCompleted, DerivedProps>

export class TrainerContext {
  static getContext() {
    return getContext<TrainerContext>(TrainerContext)
  }

  static setContext() {
    return setContext(TrainerContext, new TrainerContext())
  }

  readonly #state = getPersistedState<PersistedState>('local', 'TrainerContext.state', {
    status: 'unset',
    training: null,
    currentRoutineIndex: null,
    currentSerieIndex: null,
    records: null,
    timer: null,
  })

  state: TrainerContextState = $derived.by(() => {
    let currentRoutine: Types.Routine | null = null
    let currentSerie: Types.RoutineSerie | null = null
    let progress: Types.TrainerProgress | null = null
    let currentSerieCompleted: boolean | null = null

    const { status, training, currentRoutineIndex, currentSerieIndex, records } = this.#state

    switch (status) {
      case 'running':
        currentRoutine = training.routines[currentRoutineIndex] || null
        if (!currentRoutine) throw new TypeError(`Invalid routine index '${currentRoutineIndex}'.`)
        currentSerie = currentRoutine.series[currentSerieIndex] || null
        if (!currentSerie) throw new TypeError(`Invalid serie index '${currentSerieIndex}'.`)
        progress = getProgress(currentRoutine, records)
        currentSerieCompleted = progress[currentSerie.id] === 1
        return { ...this.#state, currentRoutine, currentSerie, currentSerieCompleted, progress }

      case 'completed':
        currentRoutine = training.routines[currentRoutineIndex] || null

        if (!currentRoutine) throw new TypeError(`Invalid routine index '${currentRoutineIndex}'.`)
        progress = getProgress(currentRoutine, records)
        return { ...this.#state, currentRoutine, currentSerie, currentSerieCompleted, progress }

      default:
        return { ...this.#state, currentRoutine, currentSerie, currentSerieCompleted, progress }
    }
  })

  private constructor() {}

  startTraining(training: Types.Training, currentRoutineIndex: number, currentSerieIndex = 0) {
    const routine = training.routines[currentRoutineIndex]
    if (!routine) throw new TypeError(`Invalid routine index '${currentRoutineIndex}'.`)
    const serie = routine.series[currentSerieIndex]
    if (!serie) throw new TypeError(`Invalid serie index '${currentSerieIndex}'.`)

    const newState: Omit<TrainerContextStateRunning, DerivedProps> = {
      ...this.#state,
      status: 'running',
      training,
      currentRoutineIndex,
      currentSerieIndex,
      records: {},
      timer: {
        status: 'stopped',
        startTime: null,
        currentTime: null,
        pauseTime: null,
        history: null,
      },
    }

    Object.assign(this.#state, newState)
  }

  terminateTraining() {
    if (this.#state.status === 'running') {
      const newState: Omit<TrainerContextStateCompleted, DerivedProps> = {
        ...this.#state,
        status: 'completed',
        currentSerieIndex: null,
      }

      Object.assign(this.#state, newState)
    }
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

  startPlayer(label: string): Types.TimePlayerRecord | undefined {
    if (this.#state.timer?.status !== 'stopped') return

    const currentTime = { label, start: Date.now() }
    this.#state.timer = {
      startTime: Date.now(),
      status: 'playing',
      history: [],
      currentTime,
      pauseTime: null,
    }

    return currentTime
  }

  restartPlayer(label: string): Types.TimePlayerRecord | undefined {
    if (this.#state.timer?.status !== 'playing') return

    const now = Date.now()
    const currentTime = { label, start: now }
    this.#state.timer = {
      ...this.#state.timer,
      currentTime,
      history: [...this.#state.timer.history, { ...this.#state.timer.currentTime, end: now }],
    }

    return currentTime
  }

  pausePlayer() {
    if (this.#state.timer?.status !== 'playing') return
    this.#state.timer = {
      ...this.#state.timer,
      status: 'paused',
      pauseTime: Date.now(),
    }
  }

  resumePlayer() {
    if (this.#state.timer?.status !== 'paused') return
    this.#state.timer = {
      ...this.#state.timer,
      status: 'playing',
      currentTime: {
        ...this.#state.timer.currentTime,
        start: Date.now() - (this.#state.timer.pauseTime - this.#state.timer.currentTime.start),
      },
      pauseTime: null,
    }
  }

  clearHistory() {
    if (this.#state.timer?.status !== 'playing') return

    this.#state.timer = { ...this.#state.timer, history: [] }
  }
}

function getProgress(routine: Types.Routine, records: Types.TrainerRecords): Types.TrainerProgress {
  return Object.fromEntries(
    routine.series.map(({ id, steps }) => {
      const record = records[id]
      const progress = Object.keys(steps).filter((index) => record && record[index])
      return [id, progress.length / steps.length]
    }),
  )
}
