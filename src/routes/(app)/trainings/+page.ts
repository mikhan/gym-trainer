import { getTrainings } from '$data/trainings'
import type { PageLoad } from './$types'

export const load = (async ({ parent }) => {
  const data = await parent()

  return {
    trainings: await getTrainings(data.supabase),
  }
}) satisfies PageLoad
