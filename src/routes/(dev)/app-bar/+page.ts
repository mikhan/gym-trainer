import type { PageLoad } from './$types'

export const load = (async ({ url }) => {
  const index = url.searchParams.get('index')

  return {
    index: index ? Number.parseInt(index) : null,
  }
}) satisfies PageLoad
