import { Session, SupabaseClient, User } from '@supabase/supabase-js'
import { Database } from './database/database.types'

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}

    interface Locals {
      supabase: SupabaseClient<Database>
      safeGetSession(): Promise<{ session: Session | null; user: User | null }>
    }

    interface PageData {
      session: Session | null
      user: User | null
    }

    // interface PageState {}
    // interface Platform {}
  }
}

export {}
