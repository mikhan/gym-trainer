import { updateTraining } from '$data/trainings'
import { getContext, setContext } from 'svelte'
import { getAppDatabaseContext } from '$lib/components/app/app-database-context.svelte'

type TrainingViewportContextInit = {
  training: Types.Training
}

export class TrainingViewportContext {
  static get() {
    return getContext<TrainingViewportContext>(TrainingViewportContext)
  }

  static create(init: TrainingViewportContextInit) {
    return setContext(TrainingViewportContext, new TrainingViewportContext(init))
  }

  #backup = {} as Types.Training
  #database = getAppDatabaseContext()

  training$ = $state.frozen({}) as Types.Training
  saving$ = $state(false)
  pristine$ = $state(true)

  private constructor(init: TrainingViewportContextInit) {
    this.training$ = init.training
    this.#backup = structuredClone(init.training)
  }

  update(training: Types.Training) {
    this.training$ = training
    this.pristine$ = false
  }

  updateRoutine(routine: Types.Routine) {
    const routineIndex = this.training$.routines.findIndex(({ id }) => id === routine.id)
    if (routineIndex < 0) throw new TypeError(`Routine id '${routine.id}' not found in training.`)
    const training = { ...this.training$ }
    training.routines.splice(routineIndex, 1, routine)
    this.update(training)
  }

  updateSerie(routineId: string, serie: Types.RoutineSerie) {
    const training = { ...this.training$ }
    const routine = training.routines.find(({ id }) => id === routineId)
    if (!routine) throw new TypeError(`Routine id '${routineId}' not found in training.`)
    const serieIndex = routine.series.findIndex(({ id }) => id === serie.id)
    if (serieIndex < 0) throw new TypeError(`Serie id '${serie.id}' not found in training.`)
    routine.series.splice(serieIndex, 1, serie)
    this.update(training)
  }

  deleteSerie(routineId: string, serieId: string) {
    const training = { ...this.training$ }
    const routine = training.routines.find(({ id }) => id === routineId)
    if (!routine) throw new TypeError(`Routine id '${routineId}' not found in training.`)
    const serieIndex = routine.series.findIndex(({ id }) => id === serieId)
    if (serieIndex < 0) throw new TypeError(`Serie id '${serieId}' not found in training.`)
    routine.series.splice(serieIndex, 1)
    this.update(training)
  }

  async save() {
    this.saving$ = true

    try {
      await updateTraining(this.#database, this.training$)
      this.#backup = structuredClone(this.training$)
      this.pristine$ = true
    } finally {
      this.saving$ = false
    }
  }

  reset() {
    this.training$ = structuredClone(this.#backup)
    this.pristine$ = true
  }
}
