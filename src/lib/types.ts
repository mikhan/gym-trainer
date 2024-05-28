export interface Routine {
  name: string
  series: Serie[]
}

export interface Serie {
  name: string
  muscle: string
  steps: Step[]
}

export interface Step {
  type: string
  value: string
  delay: number
}

export interface Action {
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

export interface ActionGroup {
  name: string
  color: { hue: string }
  actions: Action[]
}

export interface HSLColor {
  hue: string
  saturation: string
  lightness: string
  alpha?: string
}
