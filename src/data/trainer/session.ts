import { setItem } from '$lib/services/storage/storage.local'
import { getTrainings } from './trainings'

export type Session = {
  currentTrainingId: string | undefined
  currentRoutineId: string | undefined
}

let session: Session

export function getSession(): Session {
  // return getItem('trainer.session', createDefault)
  return (session ??= createDefault())
}

export function setSession(session: Session) {
  return setItem('trainer.session', session)
}

function createDefault(): Session {
  const trainings = getTrainings()

  return {
    currentTrainingId: trainings[1].id,
    currentRoutineId: trainings[1].routines[0].id,
  }
}
