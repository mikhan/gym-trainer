import { updateTraining } from '$data/trainings'
import { getContext, setContext } from 'svelte'
import { getAppDatabaseContext } from '$lib/components/app/app-database-context.svelte'
import type { ChartData } from './LineChart.svelte'

type TrainingViewportContextInit = {
  training: Types.Training
}

const colors = [
  '#b30000',
  '#7c1158',
  '#4421af',
  '#1a53ff',
  '#0d88e6',
  '#00b7c7',
  '#5ad45a',
  '#8be04e',
  '#ebdc78',
]

export class TrainingViewportContext {
  static get() {
    return getContext<TrainingViewportContext>(TrainingViewportContext)
  }

  static create(init: TrainingViewportContextInit) {
    return setContext(TrainingViewportContext, new TrainingViewportContext(init))
  }

  #backup = {} as Types.Training
  #database = getAppDatabaseContext()

  training$ = $state.raw({}) as Types.Training
  saving$ = $state(false)
  pristine$ = $state(true)

  readonly muscleColors = $derived(
    Object.fromEntries(
      this.training$.routines
        .map(({ series }) => series)
        .flat()
        .map((serie) => serie.muscle)
        .filter((e, i, a) => a.indexOf(e) === i)
        .map((muscle, index) => [muscle, colors[index] ?? 'black']),
    ),
  )

  readonly graphData = $derived(
    Object.fromEntries(
      this.training$.routines.map((routine) => [
        routine.id,
        createSerieChartData(routine.series, this.muscleColors),
      ]),
    ),
  )

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

  deleteRoutine(routineId: string) {
    const training = { ...this.training$ }
    const routineIndex = training.routines.findIndex(({ id }) => id === routineId)
    if (routineIndex < 0) throw new TypeError(`Routine id '${routineId}' not found in training.`)
    training.routines.splice(routineIndex, 1)
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

function createSerieChartData(
  series: Types.RoutineSerie[],
  colors: Record<string, string>,
): ChartData[] {
  return Object.values(
    series.reduce(
      (graphData, serie, _, series) => {
        let { total = 0, value = 0 } = graphData[serie.muscle] || { label: serie.muscle }
        total += 1
        value = Math.round((total / series.length) * 100)

        return {
          ...graphData,
          [serie.muscle]: {
            label: serie.muscle,
            value,
            color: colors[serie.muscle] ?? 'black',
            total,
          },
        }
      },
      {} as Record<string, ChartData & { total: number }>,
    ),
  )
}
