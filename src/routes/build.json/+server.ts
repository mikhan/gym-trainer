import { json } from '@sveltejs/kit'
import { BRANCH, COMMIT_REF } from '$env/static/private'
import type { RequestHandler } from './$types'

export const prerender = true

export const GET: RequestHandler = async () => {
  return json({
    branch: BRANCH,
    commitRef: COMMIT_REF,
    buildTime: new Date().toJSON(),
  })
}
