import type { Database } from '$database/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getContext, setContext } from 'svelte'

export type DatabaseClient = SupabaseClient<Database>

const contextKey = Symbol('AppDatabaseContext')

export function setAppDatabaseContext(database: SupabaseClient) {
  return setContext(contextKey, database)
}

export function getAppDatabaseContext(): DatabaseClient {
  return getContext(contextKey)
}
