import type { LayoutServerLoad } from './$types'

// export const load = (async () => {
//   return {}
// }) satisfies LayoutServerLoad

export const load = (async ({ locals: { safeGetSession } }) => {
  const { session, user } = await safeGetSession()

  return { session, user }
}) satisfies LayoutServerLoad
