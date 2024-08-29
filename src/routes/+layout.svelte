<script lang="ts">
  import type { Snippet } from 'svelte'
  import { onMount } from 'svelte'
  import AppDatabase from '$lib/components/app/app-database.svelte'
  import { invalidate } from '$app/navigation'
  import type { LayoutData } from './$types'
  import AppPwa from '$lib/components/app/AppPwa.svelte'
  import '$lib/styles/app.css'
  import AppShell from '$lib/components/app/AppShell.svelte'
  import AppNavigatingIndicator from '$lib/components/app/AppNavigatingIndicator.svelte'
  import AppViewTransition from '$lib/components/app/AppViewTransition.svelte'
  import TrainerPlayer from './TrainerPlayer.svelte'
  import { TrainerContext } from './trainer/TrainerContext.svelte'

  type Props = { children: Snippet; data: LayoutData }

  let { children, data }: Props = $props()

  TrainerContext.setContext()

  onMount(() => {
    const {
      data: { subscription },
    } = data.supabase.auth.onAuthStateChange((_, session) => {
      if (session?.expires_at !== data.session?.expires_at) {
        invalidate('supabase:auth')
      }
    })

    return () => subscription.unsubscribe()
  })
</script>

<AppPwa />
<AppViewTransition />
<AppNavigatingIndicator />
<AppShell>
  <AppDatabase client={data.supabase}>
    {@render children()}
  </AppDatabase>
  <TrainerPlayer></TrainerPlayer>
</AppShell>
