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
      weight: { value: number; unit: string }
    }

    type Action = {
      id: string
      name: string
      muscle: {
        name: string
      }
      group: {
        id: string
        name: string
        color: Partial<HSLColor>
      }
      serie: number
      step: number
      steps: number
      description: string
      delay: number
    }

    type ActionGroup = {
      name: string
      color: { hue: string }
      actions: Action[]
    }

    type HSLColor = {
      hue: string
      saturation: string
      lightness: string
      alpha?: string
    }
  }
}

export {}
