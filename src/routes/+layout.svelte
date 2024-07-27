<script lang="ts">
  import type { Snippet } from 'svelte'
  import { onMount } from 'svelte'
  import AppDatabase from '$lib/components/app/app-database.svelte'
  import { invalidate } from '$app/navigation'
  import type { LayoutData } from './$types'
  import AppPwa from '$lib/components/app/app-pwa.svelte'
  import '$lib/styles/app.css'
  import AppShell from '$lib/components/app/app-shell.svelte'

  type Props = { children: Snippet; data: LayoutData }

  let { children, data }: Props = $props()

  const supabase = $derived(data.supabase)
  const session = $derived(data.session)

  onMount(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, _session) => {
      if (_session?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth')
      }
    })

    return () => subscription.unsubscribe()
  })
</script>

<AppPwa />
<AppShell>
  <AppDatabase client={data.supabase}>
    {@render children()}
  </AppDatabase>
</AppShell>
