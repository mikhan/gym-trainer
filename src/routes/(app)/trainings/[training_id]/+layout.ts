import { error } from '@sveltejs/kit'
import type { LayoutLoad } from './$types'

export const load = (async ({ params, parent }) => {
  const { trainings } = await parent()
  const training = trainings.find(({ id }) => id === params.training_id)

  if (!training) {
    error(404, { message: 'Training not found' })
  }

  return { training }
}) satisfies LayoutLoad
