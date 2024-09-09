<script lang="ts">
  import { viewTransitionName } from '$lib/actions/transition.action'
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
  import { TrainerContext } from './trainer/TrainerContext.svelte'
  import { wakeLock, type WakeLockStatus } from '$lib/stores/wakelock.store'
  import TrainerPlayer from './trainer/TrainerPlayer.svelte'

  type Props = { children: Snippet; data: LayoutData }

  let { children, data }: Props = $props()

  const trainerContext = TrainerContext.setContext()

  const colors: Record<WakeLockStatus, string> = {
    pending: 'gray',
    locked: 'green',
    denied: 'red',
    released: 'yellow',
  }

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
<AppDatabase client={data.supabase}>
  <AppShell>
    {@render children()}

    {#if trainerContext.state.status === 'running'}
      <TrainerPlayer state={trainerContext.state}></TrainerPlayer>
    {/if}
  </AppShell>
</AppDatabase>

<div
  class="fixed bottom-0 right-0 z-3 size-3 rounded-tl-button bg-default"
  use:viewTransitionName={'wakelock-status'}
  style:--color-default={colors[$wakeLock]}>
</div>
