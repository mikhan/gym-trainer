import { getTraining } from '$data/trainings'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load = (async ({ params, parent }) => {
  const data = await parent()
  const training = await getTraining(data.supabase, params.id)

  if (!training) {
    error(404, { message: 'Training not found' })
  }

  return { training }
}) satisfies PageLoad
