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
      description: string
      series: RoutineSerie[]
    }

    type RoutineSerie = {
      id: string
      name: string
      group: string
      muscle: string
      notes: string
      steps: RoutineStep[]
    }

    type RoutineStep = {
      type: 'repetitions' | 'failure'
      value: string
      delay: number
      weight: Weight
    }

    type Weight = {
      value: number
      unit: string
    }

    type TrainerRecords = {
      [serieId: string]: {
        [stepIndex: string]: TrainerRecord
      }
    }

    type TrainerProgress = {
      [serieId: string]: number
    }

    type TrainerRecord = {
      type: 'repetitions' | 'failure'
      value: string
      delay: number
      weight: Weight
    }

    type TimePlayer =
      | {
          status: 'stopped'
          currentTime: null
          pauseTime: null
          history: null
        }
      | {
          status: 'playing'
          currentTime: TimePlayerRecord
          pauseTime: null
          history: TimePlayerRecordCompleted[]
        }
      | {
          status: 'paused'
          currentTime: TimePlayerRecord
          pauseTime: number
          history: TimePlayerRecordCompleted[]
        }

    type TimePlayerRecord = {
      start: number
      end?: number
      label?: string
    }

    type TimePlayerRecordCompleted = TimePlayerRecord & { end: number }
  }
}

export {}
