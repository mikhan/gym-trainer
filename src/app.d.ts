import { Session, SupabaseClient, User } from '@supabase/supabase-js'
import { Database } from './database/database.types'

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>
      safeGetSession(): Promise<{ session: Session | null; user: User | null }>
    }

    interface PageData {
      session: Session | null
      user: User | null
    }
  }

  interface ViewTransition {
    updateCallbackDone: Promise<void>
    ready: Promise<void>
    finished: Promise<void>
    skipTransition: () => void
  }

  interface Document {
    startViewTransition(updateCallback: () => Promise<void>): ViewTransition
  }
}

export {}
