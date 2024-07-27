// import { getItem } from '$lib/services/storage/storage.local'
import seeds from './seeds.json'

export type Training = {
  id: string
  name: string
  routines: Routine[]
}

export type Routine = {
  id: string
  name: string
  series: Serie[]
}

export type Serie = {
  id: string
  name: string
  group: string
  muscle: string
  steps: Step[]
}

export type Step = {
  type: string
  value: string
  delay: number
}

let trainings: Training[]

export async function getTrainings(): Promise<Types.Training[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  // return getItem('trainer.trainings', createDefault)
  return (trainings ??= createDefault())
}

function createDefault(): Types.Training[] {
  return seeds.trainings.map(({ routines, ...training }) => ({
    ...training,
    id: crypto.randomUUID(),
    routines: routines.map(({ series, ...routine }) => ({
      ...routine,
      id: crypto.randomUUID(),
      series: series.map(({ steps, ...serie }) => ({
        ...serie,
        id: crypto.randomUUID(),
        steps: steps.map(({ type, ...step }) => ({
          ...step,
          type: type as 'repetitions' | 'failure',
        })),
      })),
    })),
  }))
}
