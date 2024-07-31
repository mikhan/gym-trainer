import { getTraining } from '$data/trainings'
import type { PageLoad } from './$types'

export const load = (async ({ parent, url }) => {
  const trainingId = url.searchParams.get('training')

  let training: Types.Training | null = null

  if (trainingId) {
    const data = await parent()
    training = await getTraining(data.supabase, trainingId)
  }

  return { training }
}) satisfies PageLoad
