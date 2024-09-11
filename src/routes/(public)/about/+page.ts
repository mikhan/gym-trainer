import { building } from '$app/environment'
import type { PageLoad } from './$types'

type Build = {
  branch: string
  commitRef: string
  buildDate: string
}

export const load = (async ({ fetch }) => {
  const build: Build = await (await fetch('/build.json')).json()
  if (!building) build.commitRef = Date.now().toString(16)

  return { build }
}) satisfies PageLoad
