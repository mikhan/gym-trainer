import { getItem, setItem } from '$lib/services/storage/storage.local'
import { getTrainings } from './trainings'

export type Session = {
  currentTrainingId: string | undefined
  currentRoutineId: string | undefined
}

export function getSession(): Session {
  return getItem('trainer.session', createDefault)
}

export function setSession(session: Session) {
  return setItem('trainer.session', session)
}

function createDefault(): Session {
  const trainings = getTrainings()

  return {
    currentTrainingId: trainings[0].id,
    currentRoutineId: trainings[0].routines[0].id,
  }
}
