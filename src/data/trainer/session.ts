import { setItem } from '$lib/services/storage/storage.local'
import { getTrainings } from './trainings'

export type Session = {
  currentTrainingId: string | undefined
  currentRoutineId: string | undefined
}

let session: Session

export async function getSession(): Promise<Session> {
  return (session ??= await createDefault())
}

export async function setSession(session: Session) {
  return setItem('trainer.session', session)
}

async function createDefault(): Promise<Session> {
  const trainings = await getTrainings()

  return {
    currentTrainingId: trainings[1]?.id,
    currentRoutineId: trainings[1]?.routines[0]?.id,
  }
}
