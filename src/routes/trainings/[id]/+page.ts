import type { PageLoad } from './$types'

export const load = (async ({ params }) => {
  return {
    trainingId: params.id,
  }
}) satisfies PageLoad
