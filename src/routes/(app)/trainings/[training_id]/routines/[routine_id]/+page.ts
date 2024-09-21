import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load = (async ({ parent, params }) => {
  const { training } = await parent()
  const routineIndex = training.routines.findIndex(({ id }) => id === params.routine_id)

  if (routineIndex < 0) {
    error(404, { message: 'No se encontró la rutina que buscas.' })
  }

  return { training, routineIndex }
}) satisfies PageLoad
