import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ locals, params, fetch: f }) => {
  console.log(fetch)
  console.log(f)
  const { data, error } = await locals.supabase
    .from('training')
    .select(
      `
        id,
        name,
        routines`,
    )
    .eq('id', params.id)
    .returns<Types.Training[]>()

  if (error) throw error

  return json(data[0])
}
