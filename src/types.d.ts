declare global {
  namespace Types {
    type Training = {
      id: string
      name: string
      routines: Routine[]
    }

    type Routine = {
      id: string
      name: string
      series: RoutineSerie[]
    }

    type RoutineSerie = {
      id: string
      name: string
      group: string
      muscle: string
      steps: RoutineStep[]
    }

    type RoutineStep = {
      type: 'repetitions' | 'failure'
      value: string
      delay: number
    }
  }
}
export {}
