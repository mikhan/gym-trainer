import type { PageLoad } from './$types'

type Build = {
  branch: string
  commitRef: string
  buildDate: string
}

export const load = (async ({ fetch }) => {
  return {
    build: (await (await fetch('/build.json')).json()) as Build,
  }
}) satisfies PageLoad
