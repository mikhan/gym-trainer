import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { BRANCH, COMMIT_REF } from '$env/static/private'

export const prerender = true

export const GET: RequestHandler = async () => {
  return json({
    branch: BRANCH,
    commitRef: COMMIT_REF,
    buildTime: new Date().toJSON(),
  })
}
