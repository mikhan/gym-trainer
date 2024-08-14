import { getTraining } from '$data/trainings'
import { redirect } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load = (async ({ parent, url }) => {
  const trainingId = url.searchParams.get('training')

  let training: Types.Training | null = null

  if (trainingId) {
    const data = await parent()
    training = await getTraining(data.supabase, trainingId)
  }

  if (!training || training.routines.length === 0) {
    return redirect(307, '/trainings')
  }

  return { training }
}) satisfies PageLoad
