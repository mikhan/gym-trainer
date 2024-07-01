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

export function getTrainings(): Training[] {
  // return getItem('trainer.trainings', createDefault)
  return (trainings ??= createDefault())
}

function createDefault(): Training[] {
  return seeds.trainings.map(({ routines, ...training }) => ({
    id: crypto.randomUUID(),
    routines: routines.map((routine) => ({ id: crypto.randomUUID(), ...routine })),
    ...training,
  }))
}
